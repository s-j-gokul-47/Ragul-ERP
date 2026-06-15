#!/usr/bin/env python3
"""Download screens from a Stitch project and save their files locally.

Usage:
  python scripts/download_stitch_project.py \
    --project-id <PROJECT_ID> \
    --api-key <API_KEY> \
    --output-dir <OUTPUT_DIR> \
    [--api-url <API_URL>] \
    [--max <MAX_SCREENS>]
"""
import argparse
import base64
import json
import os
import pathlib
import sys
import urllib.parse
import urllib.request
from typing import Any


DEFAULT_API_URL = "https://stitch.googleapis.com"


def safe_name(s: str) -> str:
    keep = []
    for ch in s:
        if ch.isalnum() or ch in "._- ":
            keep.append(ch)
        else:
            keep.append("-")
    name = "".join(keep).strip()
    return name[:200]


def ensure_dir(path: pathlib.Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def http_get_json(url: str, api_key: str) -> Any:
    # Try using X-Goog-Api-Key first (API key). If the API responds with
    # an OAuth-related 401, retry using Authorization: Bearer <token>.
    req = urllib.request.Request(url, headers={"X-Goog-Api-Key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8")
            if "ACCESS_TOKEN_TYPE_UNSUPPORTED" in body or e.code == 401:
                # Retry with Bearer token
                req2 = urllib.request.Request(url, headers={"Authorization": f"Bearer {api_key}"})
                with urllib.request.urlopen(req2, timeout=60) as resp2:
                    body2 = resp2.read().decode("utf-8")
                    return json.loads(body2)
        except Exception:
            pass
        raise


def http_get(url: str, api_key: str) -> bytes:
    req = urllib.request.Request(url, headers={"X-Goog-Api-Key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8")
            if "ACCESS_TOKEN_TYPE_UNSUPPORTED" in body or e.code == 401:
                req2 = urllib.request.Request(url, headers={"Authorization": f"Bearer {api_key}"})
                with urllib.request.urlopen(req2, timeout=60) as resp2:
                    return resp2.read()
        except Exception:
            pass
        raise


def download_screens(api_url: str, api_key: str, project_id: str, out_dir: pathlib.Path, max_screens: int = 0):
    ensure_dir(out_dir)

    list_url = f"{api_url.rstrip('/')}/v1/projects/{project_id}/screens?pageSize=500"
    print(f"Listing screens from: {list_url}")

    try:
        data = http_get_json(list_url, api_key)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error while listing: {e.code} {e.reason}")
        print(e.read().decode())
        sys.exit(1)

    screens = data.get("screens") or []
    if not screens:
        print("No screens returned by list endpoint.")

    # Filter candidates that look like mobile frames (title contains mobile or frame)
    candidates = []
    for s in screens:
        title = s.get("title", "") or ""
        if any(tok in title.lower() for tok in ("mobile", "frame", "phone", "iphone", "android")):
            candidates.append(s)

    if not candidates:
        print("No screens matched mobile heuristics; using first screens from list.")
        candidates = screens

    if max_screens and len(candidates) > max_screens:
        candidates = candidates[:max_screens]

    print(f"Preparing to download {len(candidates)} screens to {out_dir}")

    downloaded = []
    for s in candidates:
        name = s.get("name") or s.get("screen", {}).get("name")
        title = s.get("title") or s.get("screen", {}).get("title") or "screen"
        if not name:
            # If list entry embeds screen object
            screen_obj = s.get("screen") or {}
            name = screen_obj.get("name")

        print(f"Processing: {title} ({name})")

        # If the list response already contains file content, use it.
        screen_obj = s.get("screen") or s

        file_b64 = None
        mime = None
        if "screenshot" in screen_obj and screen_obj["screenshot"]:
            sc = screen_obj["screenshot"]
            file_b64 = sc.get("fileContentBase64")
            mime = sc.get("mimeType")
        if not file_b64 and "htmlCode" in screen_obj and screen_obj["htmlCode"]:
            hc = screen_obj["htmlCode"]
            file_b64 = hc.get("fileContentBase64")
            mime = hc.get("mimeType")

        # If no content, fetch the screen resource directly.
        if not file_b64 and name:
            encoded_name = urllib.parse.quote(name, safe="/")
            get_url = f"{api_url.rstrip('/')}/v1/{encoded_name}"
            print(f"Fetching screen details: {get_url}")
            try:
                detail = http_get_json(get_url, api_key)
            except urllib.error.HTTPError as e:
                print(f"Failed to fetch screen {name}: {e.code} {e.reason}")
                continue

            # Merge possibilities
            screen_detail = detail.get("screen") or detail
            if isinstance(screen_detail, dict):
                if "screenshot" in screen_detail and screen_detail["screenshot"]:
                    sc = screen_detail["screenshot"]
                    file_b64 = sc.get("fileContentBase64")
                    mime = sc.get("mimeType")
                if not file_b64 and "htmlCode" in screen_detail and screen_detail["htmlCode"]:
                    hc = screen_detail["htmlCode"]
                    file_b64 = hc.get("fileContentBase64")
                    mime = hc.get("mimeType")

        if not file_b64:
            print(f"No file content found for {title}; skipping.")
            continue

        # Determine extension
        ext = {
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/webp": ".webp",
            "text/html": ".html",
            "text/markdown": ".md",
        }.get(mime, "")

        safe_title = safe_name(title)
        filename = f"{safe_title}{ext}" if safe_title else f"{name.split('/')[-1]}{ext}"
        out_path = out_dir / filename

        try:
            data_bytes = base64.b64decode(file_b64)
            with open(out_path, "wb") as f:
                f.write(data_bytes)
            print(f"Saved: {out_path} ({len(data_bytes)} bytes)")
            downloaded.append(str(out_path))
        except Exception as e:
            print(f"Failed to write file for {title}: {e}")

    print("\nDownload complete.")
    print(json.dumps({"downloaded": downloaded}, indent=2))


def parse_args():
    p = argparse.ArgumentParser(description="Download Stitch project screens to disk")
    p.add_argument("--project-id", required=True)
    p.add_argument("--api-key", required=True)
    p.add_argument("--api-url", default=DEFAULT_API_URL)
    p.add_argument("--output-dir", required=True)
    p.add_argument("--max", type=int, default=0, help="Max number of screens to download (0 == all candidates)")
    return p.parse_args()


def main():
    args = parse_args()
    out_dir = pathlib.Path(args.output_dir)
    download_screens(args.api_url, args.api_key, args.project_id, out_dir, max_screens=args.max)


if __name__ == "__main__":
    main()

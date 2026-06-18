export function renderHeader(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="header-user">
      <div class="header-logo-zoho" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; width: 32px; height: 32px; margin-right: 12px;">
        <div style="background: var(--accent-danger); border-radius: 4px;"></div>
        <div style="background: var(--accent-primary); border-radius: 4px;"></div>
        <div style="background: var(--accent-success); border-radius: 4px;"></div>
        <div style="background: var(--accent-warning); border-radius: 4px;"></div>
      </div>
      <div>
        <h2 class="text-sm font-semibold">Welcome back,</h2>
        <p class="text-xs text-secondary">Ragul Admin</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="icon-btn">
        <i class="ri-search-line"></i>
      </button>
      <button class="icon-btn">
        <i class="ri-notification-3-line"></i>
        <span class="notification-dot"></span>
      </button>
    </div>
  `;
}

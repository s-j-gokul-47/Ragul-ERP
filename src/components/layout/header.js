export function renderHeader(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="header-user">
      <div class="avatar">R</div>
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

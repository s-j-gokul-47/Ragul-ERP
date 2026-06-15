export function renderBottomNav(containerId, activeTab = 'home') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const navItems = [
    { id: 'home', icon: 'ri-home-5-line', label: 'Home' },
    { id: 'inventory', icon: 'ri-box-3-line', label: 'Inventory' },
    { id: 'add', isAction: true, icon: 'ri-add-line' },
    { id: 'crm', icon: 'ri-group-line', label: 'CRM' },
    { id: 'settings', icon: 'ri-settings-4-line', label: 'Settings' }
  ];

  const renderItem = (item) => {
    if (item.isAction) {
      return `
        <button class="nav-item-action" id="nav-${item.id}">
          <i class="${item.icon}"></i>
        </button>
      `;
    }
    
    const isActive = activeTab === item.id ? 'active' : '';
    // Fill icon if active
    const iconClass = isActive ? item.icon.replace('-line', '-fill') : item.icon;
    
    return `
      <button class="nav-item ${isActive}" id="nav-${item.id}" data-tab="${item.id}">
        <i class="${iconClass}"></i>
        <span>${item.label}</span>
      </button>
    `;
  };

  container.innerHTML = navItems.map(renderItem).join('');

  // Add event listeners
  navItems.forEach(item => {
    if (!item.isAction) {
      const el = document.getElementById(`nav-${item.id}`);
      if (el) {
        el.addEventListener('click', () => {
          // This would typically trigger a route change
          // For now, we'll just dispatch a custom event
          const event = new CustomEvent('tab-change', { detail: { tabId: item.id } });
          window.dispatchEvent(event);
        });
      }
    }
  });
}

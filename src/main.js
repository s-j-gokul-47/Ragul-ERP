import { renderHeader } from './components/layout/header.js';
import { renderBottomNav } from './components/layout/bottom-nav.js';
import { renderDashboard } from './components/erp/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Layout
  renderHeader('header-container');
  renderBottomNav('bottom-nav-container', 'home');

  // Initialize Default View
  renderDashboard('main-content');

  // Handle Navigation
  window.addEventListener('tab-change', (e) => {
    const tabId = e.detail.tabId;
    const mainContent = document.getElementById('main-content');
    
    // Update active state in bottom nav
    renderBottomNav('bottom-nav-container', tabId);

    // Simple routing
    if (tabId === 'home') {
      renderDashboard('main-content');
    } else {
      mainContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0; animation: fadeIn 0.3s forwards;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--accent-primary); font-size: 2rem;">
            <i class="ri-hammer-line"></i>
          </div>
          <h2 style="font-size: var(--font-xl); margin-bottom: 8px;">${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Module</h2>
          <p style="color: var(--text-secondary); text-align: center;">This module is under construction.</p>
        </div>
      `;
    }
  });
});

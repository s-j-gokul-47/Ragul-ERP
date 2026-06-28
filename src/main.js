import { renderHeader } from './components/layout/header.js';
import { renderBottomNav } from './components/layout/bottom-nav.js';
import { renderDashboard } from './components/erp/dashboard.js';
import { renderSettings } from './components/erp/settings.js';
import { renderAuth } from './components/auth/auth.js';
import { mountReactInventory, unmountReactInventory } from './components/erp/inventory-bridge.tsx';
import { mountReactInvoice, unmountReactInvoice } from './components/erp/invoice-bridge.tsx';
import { mountReactCrm, unmountReactCrm } from './components/erp/crm-bridge.tsx';
import { mountReactPayment, unmountReactPayment } from './components/erp/payment-bridge.tsx';
import { mountReactReport, unmountReactReport } from './components/erp/report-bridge.tsx';

document.addEventListener('DOMContentLoaded', () => {
  // Initially render Auth
  renderAuth('auth-container');

  // Listen for successful authentication
  window.addEventListener('auth-success', (e) => {
    // Save current user to localStorage
    const userEmail = e.detail.user.email;
    const usersData = localStorage.getItem('erp_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const fullUser = users.find(u => u.email === userEmail);
      if (fullUser) {
        localStorage.setItem('currentUser', JSON.stringify(fullUser));
      }
    }

    // Hide auth, show app
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app').style.display = 'flex';

    // Initialize Layout
    renderHeader('header-container');
    checkProfileCompletion();
    renderBottomNav('bottom-nav-container', 'home');

    // Initialize Default View
    renderDashboard('main-content');
  });

  // Handle Navigation
  window.addEventListener('tab-change', (e) => {
    const tabId = e.detail.tabId;
    const mainContent = document.getElementById('main-content');
    
    // Clear React tree if moving away from inventory to prevent memory leaks and UI collisions
    if (tabId !== 'inventory') {
      unmountReactInventory();
    }
    if (tabId !== 'invoice') {
      unmountReactInvoice();
    }
    if (tabId !== 'crm') {
      unmountReactCrm();
    }
    if (tabId !== 'payment') {
      unmountReactPayment();
    }
    if (tabId !== 'report') {
      unmountReactReport();
    }

    // Update active state in bottom nav
    renderBottomNav('bottom-nav-container', tabId);

    // Simple routing
    if (tabId === 'home') {
      renderDashboard('main-content');
    } else if (tabId === 'settings') {
      renderSettings('main-content');
    } else if (tabId === 'inventory') {
      mainContent.innerHTML = ''; // clear out anything
      mountReactInventory('main-content');
    } else if (tabId === 'invoice') {
      mainContent.innerHTML = ''; // clear out anything
      mountReactInvoice('main-content');
    } else if (tabId === 'crm') {
      mainContent.innerHTML = ''; // clear out anything
      mountReactCrm('main-content');
    } else if (tabId === 'payment') {
      mainContent.innerHTML = ''; // clear out anything
      mountReactPayment('main-content');
    } else if (tabId === 'report') {
      mainContent.innerHTML = ''; // clear out anything
      mountReactReport('main-content');
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

export function checkProfileCompletion() {
  const bannerContainer = document.getElementById('profile-banner-container');
  if (!bannerContainer) return;

  const userData = localStorage.getItem('currentUser');
  if (!userData) return;
  
  const user = JSON.parse(userData);
  
  // Check if profile is complete
  const isComplete = user.phone && user.dob && user.address && user.phone.trim() !== '' && user.address.trim() !== '';

  if (!isComplete) {
    bannerContainer.innerHTML = `
      <div style="background-color: var(--danger-color); color: white; padding: 0.75rem 1rem; text-align: center; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="ri-error-warning-line" style="font-size: 1.25rem;"></i>
        <span>Remember, You should need to completly fill the Personal Information !!!</span>
      </div>
    `;
  } else {
    bannerContainer.innerHTML = '';
  }
}

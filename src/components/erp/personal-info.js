import { checkProfileCompletion } from '../../main.js';

export function renderPersonalInfo(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Retrieve current user
  let user = { name: '', email: '', phone: '', dob: '', address: '' };
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    user = { ...user, ...JSON.parse(userData) };
  }

  // Helper to escape HTML quotes
  const safeVal = (str) => (str ? str.replace(/"/g, '&quot;') : '');

  container.innerHTML = `
    <div class="personal-info-container">
      <div class="pi-header">
        <button id="pi-back-btn" class="pi-back-btn">
          <i class="ri-arrow-left-s-line"></i>
          <span>Settings</span>
        </button>
        <h2 class="pi-title">Personal Information</h2>
      </div>

      <div class="pi-content">
        <div class="pi-avatar-section">
          <div class="pi-avatar-large">
            ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            <div class="pi-avatar-upload">
              <i class="ri-camera-fill"></i>
            </div>
          </div>
        </div>

        <form class="pi-form" id="pi-form">
          <div class="pi-form-group">
            <label>Full Name</label>
            <input type="text" id="pi-name" value="${safeVal(user.name)}" class="pi-input" required />
          </div>

          <div class="pi-form-group">
            <label>Email Address</label>
            <input type="email" id="pi-email" value="${safeVal(user.email)}" class="pi-input" required readonly style="opacity: 0.7; cursor: not-allowed;" />
          </div>

          <div class="pi-form-group">
            <label>Phone Number</label>
            <input type="tel" id="pi-phone" value="${safeVal(user.phone)}" class="pi-input" placeholder="e.g. +1 (555) 123-4567" />
          </div>

          <div class="pi-form-group">
            <label>Date of Birth</label>
            <input type="date" id="pi-dob" value="${safeVal(user.dob)}" class="pi-input" />
          </div>

          <div class="pi-form-group">
            <label>Address</label>
            <textarea id="pi-address" class="pi-textarea" placeholder="Enter your full address">${safeVal(user.address)}</textarea>
          </div>

          <button type="submit" class="pi-save-btn" id="pi-save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  `;

  // Back button functionality
  document.getElementById('pi-back-btn').addEventListener('click', () => {
    const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
    window.dispatchEvent(event);
  });

  // Save functionality
  document.getElementById('pi-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('pi-save-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    setTimeout(() => {
      // Update user object
      user.name = document.getElementById('pi-name').value;
      user.phone = document.getElementById('pi-phone').value;
      user.dob = document.getElementById('pi-dob').value;
      user.address = document.getElementById('pi-address').value;

      // Save to currentUser
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Save to erp_users array
      const usersData = localStorage.getItem('erp_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const index = users.findIndex(u => u.email === user.email);
        if (index !== -1) {
          users[index] = { ...users[index], ...user };
          localStorage.setItem('erp_users', JSON.stringify(users));
        }
      }

      // Re-evaluate profile completion banner
      checkProfileCompletion();

      btn.textContent = 'Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }, 500);
  });
}

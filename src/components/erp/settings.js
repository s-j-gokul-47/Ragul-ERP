export function renderSettings(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="settings-container">
      
      <!-- Profile Header -->
      <div class="settings-profile">
        <div class="settings-avatar">
          R
          <div class="settings-avatar-edit"><i class="ri-pencil-line"></i></div>
        </div>
        <div class="settings-profile-info">
          <div class="settings-profile-name">Ragul Admin</div>
          <div class="settings-profile-role">Super Administrator</div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="settings-section">
        <div class="settings-section-title">Account</div>
        <div class="settings-list">
          <div class="settings-item">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-user-settings-line"></i></div>
              <div class="settings-label">Personal Information</div>
            </div>
            <div class="settings-item-right"><i class="ri-arrow-right-s-line"></i></div>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-building-line"></i></div>
              <div class="settings-label">Company Details</div>
            </div>
            <div class="settings-item-right"><i class="ri-arrow-right-s-line"></i></div>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-shield-keyhole-line"></i></div>
              <div class="settings-label">Security & Passwords</div>
            </div>
            <div class="settings-item-right"><i class="ri-arrow-right-s-line"></i></div>
          </div>
        </div>
      </div>

      <!-- App Preferences -->
      <div class="settings-section">
        <div class="settings-section-title">Preferences</div>
        <div class="settings-list">
          <div class="settings-item" onclick="this.querySelector('.toggle-switch').classList.toggle('active')">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-notification-3-line"></i></div>
              <div class="settings-label">Push Notifications</div>
            </div>
            <div class="settings-item-right">
              <div class="toggle-switch active"></div>
            </div>
          </div>
          <div class="settings-item" id="theme-toggle-btn">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-moon-line"></i></div>
              <div class="settings-label">Dark Mode</div>
            </div>
            <div class="settings-item-right">
              <div class="toggle-switch" id="theme-toggle-switch"></div>
            </div>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-global-line"></i></div>
              <div class="settings-label">Language</div>
            </div>
            <div class="settings-item-right">
              <span class="settings-value">English (US)</span>
              <i class="ri-arrow-right-s-line"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section" style="margin-top: 1rem;">
        <div class="settings-list">
          <div class="settings-item danger">
            <div class="settings-item-left">
              <div class="settings-icon"><i class="ri-logout-box-r-line"></i></div>
              <div class="settings-label">Log Out</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;

  // Handle Theme Toggle
  const themeToggleBtn = container.querySelector('#theme-toggle-btn');
  const themeToggleSwitch = container.querySelector('#theme-toggle-switch');
  
  // Initialize state: if light-mode is NOT present, we are in dark mode (active)
  if (!document.documentElement.classList.contains('light-mode')) {
    themeToggleSwitch.classList.add('active');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    themeToggleSwitch.classList.toggle('active');
  });
}

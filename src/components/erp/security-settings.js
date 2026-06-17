export function renderSecuritySettings(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="security-settings-container">
      <div class="sec-header">
        <button id="sec-back-btn" class="sec-back-btn">
          <i class="ri-arrow-left-s-line"></i>
          <span>Settings</span>
        </button>
        <h2 class="sec-title">Security & Passwords</h2>
      </div>

      <div class="sec-content">
        <!-- Change Password Section -->
        <div class="sec-section">
          <h3 class="sec-section-title">Change Password</h3>
          <p class="sec-section-desc">Ensure your account is using a long, random password to stay secure.</p>
          <form class="sec-form">
            <div class="sec-form-group">
              <label>Current Password</label>
              <div class="sec-input-wrapper">
                <input type="password" class="sec-input" placeholder="Enter current password" />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <div class="sec-form-group">
              <label>New Password</label>
              <div class="sec-input-wrapper">
                <input type="password" class="sec-input" placeholder="Enter new password" />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <div class="sec-form-group">
              <label>Confirm New Password</label>
              <div class="sec-input-wrapper">
                <input type="password" class="sec-input" placeholder="Confirm new password" />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <button type="button" class="sec-btn-primary">Update Password</button>
          </form>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="sec-section">
          <div class="sec-flex-between">
            <div>
              <h3 class="sec-section-title">Two-Factor Authentication (2FA)</h3>
              <p class="sec-section-desc">Add an extra layer of security to your ERP account.</p>
            </div>
            <div class="toggle-switch" id="tfa-toggle"></div>
          </div>
          <div class="sec-tfa-status" id="tfa-status-text">
            <i class="ri-shield-check-line"></i> 2FA is currently disabled
          </div>
        </div>

        <!-- Session Timeout -->
        <div class="sec-section">
          <h3 class="sec-section-title">Auto Logout</h3>
          <p class="sec-section-desc">Automatically log out after a period of inactivity.</p>
          <select class="sec-select">
            <option value="15">15 Minutes</option>
            <option value="30" selected>30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="never">Never</option>
          </select>
        </div>

        <!-- Active Sessions -->
        <div class="sec-section">
          <h3 class="sec-section-title">Active Sessions</h3>
          <p class="sec-section-desc">Devices that are currently logged into your account.</p>
          
          <div class="sec-session-list">
            <div class="sec-session-item current">
              <div class="sec-session-icon"><i class="ri-smartphone-line"></i></div>
              <div class="sec-session-info">
                <div class="sec-session-name">Current Device (Mobile)</div>
                <div class="sec-session-meta">Chennai, India • Active now</div>
              </div>
            </div>
            <div class="sec-session-item">
              <div class="sec-session-icon"><i class="ri-macbook-line"></i></div>
              <div class="sec-session-info">
                <div class="sec-session-name">Chrome on macOS</div>
                <div class="sec-session-meta">Chennai, India • Last active 2 hours ago</div>
              </div>
              <button class="sec-btn-text danger">Revoke</button>
            </div>
          </div>

          <button type="button" class="sec-btn-secondary danger-outline mt-4">Log out of all other devices</button>
        </div>

      </div>
    </div>
  `;

  // Back button functionality
  document.getElementById('sec-back-btn').addEventListener('click', () => {
    const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
    window.dispatchEvent(event);
  });

  // Toggle password visibility
  const eyeIcons = container.querySelectorAll('.sec-eye-icon');
  eyeIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        e.target.classList.remove('ri-eye-off-line');
        e.target.classList.add('ri-eye-line');
      } else {
        input.type = 'password';
        e.target.classList.remove('ri-eye-line');
        e.target.classList.add('ri-eye-off-line');
      }
    });
  });

  // 2FA Toggle
  const tfaToggle = document.getElementById('tfa-toggle');
  const tfaStatusText = document.getElementById('tfa-status-text');
  tfaToggle.addEventListener('click', () => {
    tfaToggle.classList.toggle('active');
    if (tfaToggle.classList.contains('active')) {
      tfaStatusText.innerHTML = '<i class="ri-shield-check-fill" style="color:var(--success-color)"></i> 2FA is currently enabled';
    } else {
      tfaStatusText.innerHTML = '<i class="ri-shield-check-line"></i> 2FA is currently disabled';
    }
  });
}

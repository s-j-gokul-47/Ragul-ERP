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
          <form class="sec-form" id="sec-pwd-form">
            <div class="sec-form-group">
              <label>Current Password</label>
              <div class="sec-input-wrapper">
                <input type="password" id="sec-current-pwd" class="sec-input" placeholder="Enter current password" required />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <div class="sec-form-group">
              <label>New Password</label>
              <div class="sec-input-wrapper">
                <input type="password" id="sec-new-pwd" class="sec-input" placeholder="Enter new password" required />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <div class="sec-form-group">
              <label>Confirm New Password</label>
              <div class="sec-input-wrapper">
                <input type="password" id="sec-confirm-pwd" class="sec-input" placeholder="Confirm new password" required />
                <i class="ri-eye-off-line sec-eye-icon"></i>
              </div>
            </div>
            <button type="submit" id="sec-update-pwd-btn" class="sec-btn-primary">Update Password</button>
            <div id="sec-pwd-msg" style="margin-top: 10px; font-size: 0.875rem; font-weight: 500;"></div>
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
      tfaStatusText.innerHTML = '<i class="ri-shield-check-fill" style="color:var(--accent-success)"></i> 2FA is currently enabled';
    } else {
      tfaStatusText.innerHTML = '<i class="ri-shield-check-line"></i> 2FA is currently disabled';
    }
  });

  // Handle Password Update
  const pwdForm = document.getElementById('sec-pwd-form');
  const msgDiv = document.getElementById('sec-pwd-msg');
  const currentPwdInput = document.getElementById('sec-current-pwd');
  const newPwdInput = document.getElementById('sec-new-pwd');
  const confirmPwdInput = document.getElementById('sec-confirm-pwd');
  const updateBtn = document.getElementById('sec-update-pwd-btn');

  if (pwdForm) {
    pwdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      msgDiv.textContent = '';
      msgDiv.style.color = '';

      const currentPwd = currentPwdInput.value;
      const newPwd = newPwdInput.value;
      const confirmPwd = confirmPwdInput.value;

      const userDataStr = localStorage.getItem('currentUser');
      if (!userDataStr) {
        msgDiv.textContent = 'User session not found. Please log in again.';
        msgDiv.style.color = 'var(--accent-danger)';
        return;
      }

      const user = JSON.parse(userDataStr);

      if (user.password !== currentPwd) {
        msgDiv.textContent = 'Incorrect current password.';
        msgDiv.style.color = 'var(--accent-danger)';
        return;
      }

      if (newPwd !== confirmPwd) {
        msgDiv.textContent = 'New passwords do not match.';
        msgDiv.style.color = 'var(--accent-danger)';
        return;
      }

      if (newPwd.length < 4) {
        msgDiv.textContent = 'Password must be at least 4 characters long.';
        msgDiv.style.color = 'var(--accent-danger)';
        return;
      }

      // Update password
      updateBtn.textContent = 'Updating...';
      updateBtn.disabled = true;

      setTimeout(() => {
        user.password = newPwd;
        localStorage.setItem('currentUser', JSON.stringify(user));

        const usersData = localStorage.getItem('erp_users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const index = users.findIndex(u => u.email === user.email);
          if (index !== -1) {
            users[index].password = newPwd;
            localStorage.setItem('erp_users', JSON.stringify(users));
          }
        }

        msgDiv.textContent = 'Password updated successfully!';
        msgDiv.style.color = 'var(--accent-success)';
        
        currentPwdInput.value = '';
        newPwdInput.value = '';
        confirmPwdInput.value = '';
        
        updateBtn.textContent = 'Update Password';
        updateBtn.disabled = false;
      }, 600);
    });
  }
}

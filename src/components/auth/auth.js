export function renderAuth(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // State can be: 'login', 'signup', 'forgot', 'otp', 'reset'
  let viewState = 'login';
  let resetEmail = ''; // Store email temporarily during reset flow
  let simulatedOTP = ''; // Store the generated OTP

  const render = () => {
    let title = '';
    let subtitle = '';
    let formContent = '';
    let footerContent = '';
    let btnText = '';

    if (viewState === 'login') {
      title = 'Welcome Back';
      subtitle = 'Sign in to access your ERP dashboard';
      btnText = 'Sign In';
      formContent = `
        <div class="auth-group">
          <label>Email Address</label>
          <div class="auth-input-container">
            <i class="ri-mail-line icon-left"></i>
            <input type="email" id="auth-email" class="auth-input" placeholder="Enter your email" required />
          </div>
        </div>
        <div class="auth-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label>Password</label>
            <span id="auth-to-forgot" class="auth-link" style="font-size: 0.75rem; font-weight: 500;">Forgot Password?</span>
          </div>
          <div class="auth-input-container">
            <i class="ri-lock-line icon-left"></i>
            <input type="password" id="auth-password" class="auth-input" placeholder="Enter your password" required />
          </div>
        </div>
      `;
      footerContent = `Don't have an account? <span id="auth-to-signup" class="auth-link">Sign up</span>`;
    } else if (viewState === 'signup') {
      title = 'Create Account';
      subtitle = 'Sign up to get started with Ragul ERP';
      btnText = 'Create Account';
      formContent = `
        <div class="auth-group">
          <label>Full Name</label>
          <div class="auth-input-container">
            <i class="ri-user-line icon-left"></i>
            <input type="text" id="auth-name" class="auth-input" placeholder="Enter your name" required />
          </div>
        </div>
        <div class="auth-group">
          <label>Email Address</label>
          <div class="auth-input-container">
            <i class="ri-mail-line icon-left"></i>
            <input type="email" id="auth-email" class="auth-input" placeholder="Enter your email" required />
          </div>
        </div>
        <div class="auth-group">
          <label>Password</label>
          <div class="auth-input-container">
            <i class="ri-lock-line icon-left"></i>
            <input type="password" id="auth-password" class="auth-input" placeholder="Create a password" required />
          </div>
        </div>
      `;
      footerContent = `Already have an account? <span id="auth-to-login" class="auth-link">Sign in</span>`;
    } else if (viewState === 'forgot') {
      title = 'Reset Password';
      subtitle = 'Enter your email to receive an OTP';
      btnText = 'Send OTP';
      formContent = `
        <div class="auth-group">
          <label>Email Address</label>
          <div class="auth-input-container">
            <i class="ri-mail-line icon-left"></i>
            <input type="email" id="auth-email" class="auth-input" placeholder="Enter your registered email" required />
          </div>
        </div>
      `;
      footerContent = `Remember your password? <span id="auth-to-login" class="auth-link">Sign in</span>`;
    } else if (viewState === 'otp') {
      title = 'Verify Identity';
      subtitle = 'Please enter the 6-digit OTP sent to your email.';
      btnText = 'Verify OTP';
      formContent = `
        <div class="auth-group">
          <label>6-Digit OTP</label>
          <div class="auth-input-container">
            <i class="ri-message-3-line icon-left"></i>
            <input type="text" id="auth-otp" class="auth-input" placeholder="Enter 6-digit OTP" maxlength="6" required />
          </div>
        </div>
      `;
      footerContent = `<span id="auth-to-login" class="auth-link">Cancel and back to Sign in</span>`;
    } else if (viewState === 'reset') {
      title = 'Create New Password';
      subtitle = `Updating password for ${resetEmail}`;
      btnText = 'Save New Password';
      formContent = `
        <div class="auth-group">
          <label>New Password</label>
          <div class="auth-input-container">
            <i class="ri-lock-line icon-left"></i>
            <input type="password" id="auth-new-password" class="auth-input" placeholder="Enter new password" required />
          </div>
        </div>
        <div class="auth-group">
          <label>Confirm Password</label>
          <div class="auth-input-container">
            <i class="ri-lock-check-line icon-left"></i>
            <input type="password" id="auth-confirm-password" class="auth-input" placeholder="Confirm new password" required />
          </div>
        </div>
      `;
      footerContent = `<span id="auth-to-login" class="auth-link">Cancel and back to Sign in</span>`;
    }

    container.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo-zoho" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; width: 48px; height: 48px; margin: 0 auto 16px;">
              <div style="background: var(--accent-danger); border-radius: 8px;"></div>
              <div style="background: var(--accent-primary); border-radius: 8px;"></div>
              <div style="background: var(--accent-success); border-radius: 8px;"></div>
              <div style="background: var(--accent-warning); border-radius: 8px;"></div>
            </div>
            <h1 class="auth-title">${title}</h1>
            <p class="auth-subtitle">${subtitle}</p>
          </div>

          <div id="auth-error" class="auth-error"></div>

          <form id="auth-form" class="auth-form">
            ${formContent}
            <button type="submit" class="auth-btn">${btnText}</button>
          </form>

          <div class="auth-footer">
            ${footerContent}
          </div>
        </div>
      </div>
    `;

    // Attach navigation listeners
    const attachNav = (id, targetState) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => { viewState = targetState; render(); });
    };
    attachNav('auth-to-signup', 'signup');
    attachNav('auth-to-login', 'login');
    attachNav('auth-to-forgot', 'forgot');

    // Attach form submit listener
    document.getElementById('auth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('auth-error');
      const btn = e.target.querySelector('button');
      const originalText = btn.textContent;
      
      btn.textContent = 'Processing...';
      btn.disabled = true;
      errorEl.style.display = 'none';

      setTimeout(() => {
        try {
          const usersData = localStorage.getItem('erp_users');
          const users = usersData ? JSON.parse(usersData) : [];

          if (viewState === 'signup') {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const name = document.getElementById('auth-name').value;
            
            if (users.find(u => u.email === email)) {
              errorEl.textContent = 'User already exists with this email. Please sign in.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            users.push({ name, email, password });
            localStorage.setItem('erp_users', JSON.stringify(users));
            window.dispatchEvent(new CustomEvent('auth-success', { detail: { user: { email, name } } }));

          } else if (viewState === 'login') {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const user = users.find(u => u.email === email);
            
            if (!user || user.password !== password) {
              errorEl.textContent = 'Login/password is incorrect.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            window.dispatchEvent(new CustomEvent('auth-success', { detail: { user: { email: user.email, name: user.name } } }));

          } else if (viewState === 'forgot') {
            const email = document.getElementById('auth-email').value;
            const user = users.find(u => u.email === email);
            
            if (!user) {
              errorEl.textContent = 'No account found with that email address.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            // Generate a 6 digit OTP
            simulatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            alert(`[SIMULATED EMAIL] An OTP has been sent to ${email}.\n\nYour 6-digit OTP is: ${simulatedOTP}`);

            // Move to OTP verification state
            resetEmail = email;
            viewState = 'otp';
            render();

          } else if (viewState === 'otp') {
            const enteredOtp = document.getElementById('auth-otp').value;

            if (enteredOtp !== simulatedOTP) {
              errorEl.textContent = 'Invalid OTP. Please check your email and try again.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            // Move to final reset state
            viewState = 'reset';
            render();

          } else if (viewState === 'reset') {
            const newPass = document.getElementById('auth-new-password').value;
            const confirmPass = document.getElementById('auth-confirm-password').value;
            
            if (newPass !== confirmPass) {
              errorEl.textContent = 'Passwords do not match.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            if (newPass.length < 4) {
              errorEl.textContent = 'Password must be at least 4 characters long.';
              errorEl.style.display = 'block';
              btn.textContent = originalText;
              btn.disabled = false;
              return;
            }

            // Update user password
            const userIndex = users.findIndex(u => u.email === resetEmail);
            if (userIndex !== -1) {
              users[userIndex].password = newPass;
              localStorage.setItem('erp_users', JSON.stringify(users));
              
              alert('Password updated successfully! You can now log in.');
              viewState = 'login';
              render();
            }
          }
        } catch (err) {
          errorEl.textContent = 'An error occurred. Please try again.';
          errorEl.style.display = 'block';
          btn.textContent = originalText;
          btn.disabled = false;
        }
      }, 600);
    });
  };

  render();
}

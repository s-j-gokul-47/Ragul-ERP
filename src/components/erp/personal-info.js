export function renderPersonalInfo(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

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
            R
            <div class="pi-avatar-upload">
              <i class="ri-camera-fill"></i>
            </div>
          </div>
        </div>

        <form class="pi-form">
          <div class="pi-form-group">
            <label>Full Name</label>
            <input type="text" value="Ragul Admin" class="pi-input" />
          </div>

          <div class="pi-form-group">
            <label>Email Address</label>
            <input type="email" value="admin@ragulerp.com" class="pi-input" />
          </div>

          <div class="pi-form-group">
            <label>Phone Number</label>
            <input type="tel" value="+1 (555) 123-4567" class="pi-input" />
          </div>

          <div class="pi-form-group">
            <label>Date of Birth</label>
            <input type="date" value="1990-01-01" class="pi-input" />
          </div>

          <div class="pi-form-group">
            <label>Address</label>
            <textarea class="pi-textarea">123 Business Avenue, Suite 100, Tech City, TC 12345</textarea>
          </div>

          <button type="button" class="pi-save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  `;

  // Back button functionality
  document.getElementById('pi-back-btn').addEventListener('click', () => {
    const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
    window.dispatchEvent(event);
  });
}

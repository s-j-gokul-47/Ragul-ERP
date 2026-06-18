export function renderCompanyDetails(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Retrieve current company details
  let company = {
    name: '',
    registrationNo: '',
    industry: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  };
  
  const companyData = localStorage.getItem('companyDetails');
  if (companyData) {
    company = { ...company, ...JSON.parse(companyData) };
  }

  // Helper to escape HTML quotes
  const safeVal = (str) => (str ? str.replace(/"/g, '&quot;') : '');

  container.innerHTML = `
    <div class="company-details-container">
      <div class="cd-header">
        <button id="cd-back-btn" class="cd-back-btn">
          <i class="ri-arrow-left-s-line"></i>
          <span>Settings</span>
        </button>
        <h2 class="cd-title">Company Details</h2>
      </div>

      <div class="cd-content">
        <div class="cd-logo-section">
          <div class="cd-logo-large">
            ${company.name ? company.name.charAt(0).toUpperCase() : '<i class="ri-building-line"></i>'}
            <div class="cd-logo-upload">
              <i class="ri-camera-fill"></i>
            </div>
          </div>
        </div>

        <form class="cd-form" id="cd-form">
          <div class="cd-form-group">
            <label>Company Name</label>
            <input type="text" id="cd-name" value="${safeVal(company.name)}" class="cd-input" required placeholder="e.g. Acme Corp" />
          </div>

          <div class="cd-form-group">
            <label>Registration Number / Tax ID</label>
            <input type="text" id="cd-reg-no" value="${safeVal(company.registrationNo)}" class="cd-input" placeholder="e.g. 12-3456789" />
          </div>

          <div class="cd-form-group">
            <label>Industry</label>
            <input type="text" id="cd-industry" value="${safeVal(company.industry)}" class="cd-input" placeholder="e.g. Software Development" />
          </div>

          <div class="cd-form-group">
            <label>Company Email</label>
            <input type="email" id="cd-email" value="${safeVal(company.email)}" class="cd-input" placeholder="e.g. contact@acmecorp.com" />
          </div>

          <div class="cd-form-group">
            <label>Company Phone</label>
            <input type="tel" id="cd-phone" value="${safeVal(company.phone)}" class="cd-input" placeholder="e.g. +1 (555) 987-6543" />
          </div>

          <div class="cd-form-group">
            <label>Website</label>
            <input type="url" id="cd-website" value="${safeVal(company.website)}" class="cd-input" placeholder="e.g. https://www.acmecorp.com" />
          </div>

          <div class="cd-form-group">
            <label>Registered Address</label>
            <textarea id="cd-address" class="cd-textarea" placeholder="Enter full registered address">${safeVal(company.address)}</textarea>
          </div>

          <button type="submit" class="cd-save-btn" id="cd-save-btn">Save Company Details</button>
        </form>
      </div>
    </div>
  `;

  // Back button functionality
  document.getElementById('cd-back-btn').addEventListener('click', () => {
    const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
    window.dispatchEvent(event);
  });

  // Save functionality
  document.getElementById('cd-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('cd-save-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    setTimeout(() => {
      // Update company object
      company.name = document.getElementById('cd-name').value;
      company.registrationNo = document.getElementById('cd-reg-no').value;
      company.industry = document.getElementById('cd-industry').value;
      company.email = document.getElementById('cd-email').value;
      company.phone = document.getElementById('cd-phone').value;
      company.website = document.getElementById('cd-website').value;
      company.address = document.getElementById('cd-address').value;

      // Save to localStorage
      localStorage.setItem('companyDetails', JSON.stringify(company));

      btn.textContent = 'Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }, 500);
  });
}

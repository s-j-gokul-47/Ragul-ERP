import { ALL_LANGUAGES } from '../../data/languages.js';

export function renderLanguageSettings(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Let's assume 'en-US' is currently active
  const activeLangId = 'en-US';

  container.innerHTML = `
    <div class="language-settings-container">
      <div class="lang-header">
        <button id="lang-back-btn" class="lang-back-btn">
          <i class="ri-arrow-left-s-line"></i>
          <span>Settings</span>
        </button>
        <h2 class="lang-title">Language</h2>
      </div>

      <div class="lang-content">
        <div class="lang-list-container">
          <p class="lang-description">Select your preferred language. Includes historical and constructed languages.</p>
          
          <div class="lang-search-container">
            <i class="ri-search-line lang-search-icon"></i>
            <input type="text" id="lang-search-input" class="lang-search-input" placeholder="Search languages...">
          </div>

          <div class="lang-list" id="lang-list">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </div>
  `;

  const langListEl = document.getElementById('lang-list');
  const searchInput = document.getElementById('lang-search-input');

  const renderList = (filterText = '') => {
    const lowerFilter = filterText.toLowerCase();
    const filtered = ALL_LANGUAGES.filter(l => l.name.toLowerCase().includes(lowerFilter));
    
    if (filtered.length === 0) {
      langListEl.innerHTML = '<div class="lang-no-results">No languages found.</div>';
      return;
    }

    langListEl.innerHTML = filtered.map(lang => `
      <div class="lang-item" data-lang-id="${lang.id}">
        <div class="lang-item-left">
          <div class="lang-name">${lang.name}</div>
        </div>
        <div class="lang-item-right">
          ${lang.id === activeLangId ? '<i class="ri-check-line lang-check"></i>' : ''}
        </div>
      </div>
    `).join('');

    // Re-attach listeners
    const langItems = langListEl.querySelectorAll('.lang-item');
    langItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove check from all
        document.querySelectorAll('.lang-item-right').forEach(right => right.innerHTML = '');
        // Add check to clicked
        item.querySelector('.lang-item-right').innerHTML = '<i class="ri-check-line lang-check"></i>';
        
        setTimeout(() => {
          const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
          window.dispatchEvent(event);
        }, 300);
      });
    });
  };

  // Initial render
  renderList();

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    renderList(e.target.value);
  });

  // Back button functionality
  document.getElementById('lang-back-btn').addEventListener('click', () => {
    const event = new CustomEvent('tab-change', { detail: { tabId: 'settings' } });
    window.dispatchEvent(event);
  });
}

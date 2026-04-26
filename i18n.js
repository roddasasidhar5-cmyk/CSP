// i18n Configuration and Initialization
let i18nInstance = null;

// Simple i18n implementation for client-side
class SimpleI18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
    this.isLoaded = false;
  }

  // Load translations for a specific language
  async loadLanguage(lang) {
    try {
      const response = await fetch(`/locales/${lang}/translation.json`);
      if (!response.ok) {
        console.warn(`Failed to load language ${lang}, falling back to English`);
        return null;
      }
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`Error loading language ${lang}:`, error);
      return null;
    }
  }

  // Initialize i18n with default language
  async init(defaultLang = 'en') {
    try {
      const lang = this.currentLanguage || defaultLang;
      await this.setLanguage(lang);
      this.isLoaded = true;
      return this;
    } catch (error) {
      console.error('Error initializing i18n:', error);
      return this;
    }
  }

  // Set the current language
  async setLanguage(lang) {
    if (!this.translations[lang]) {
      const translations = await this.loadLanguage(lang);
      if (!translations && lang !== 'en') {
        // Fallback to English if language not found
        return this.setLanguage('en');
      }
    }
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    return this.currentLanguage;
  }

  // Get a translation key
  t(key, defaultValue = key) {
    const lang = this.currentLanguage;
    if (!this.translations[lang]) {
      return defaultValue;
    }

    const keys = key.split('.');
    let value = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    // Handle template variables like {score}
    if (typeof value === 'string' && typeof defaultValue === 'object') {
      for (const [varKey, varValue] of Object.entries(defaultValue)) {
        value = value.replace(`{${varKey}}`, varValue);
      }
    }

    return value;
  }

  // Get all translations for current language
  getAll() {
    return this.translations[this.currentLanguage] || {};
  }

  // Get current language
  getLanguage() {
    return this.currentLanguage;
  }

  // Translate HTML content dynamically
  translateElement(element) {
    const elements = element ? [element] : document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Handle data-i18n-html for innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = this.t(key);
      }
    });
  }

  // Translate all page content
  translatePage() {
    this.translateElement();
    // Dispatch event for other components to listen to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLanguage } }));
  }
}

// Initialize i18n instance
async function initializeI18n() {
  i18nInstance = new SimpleI18n();
  await i18nInstance.init();
  window.i18n = i18nInstance;
  return i18nInstance;
}

// Helper function for shorthand translation
function t(key, defaultValue = key) {
  return window.i18n ? window.i18n.t(key, defaultValue) : key;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimpleI18n, initializeI18n, t };
}

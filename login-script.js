// ==================== INTERNATIONALIZATION (I18N) ====================

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initializeI18n();
  setupLanguageSwitcher();
  i18n.translatePage();
});

// Setup language switcher
function setupLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  const currentLang = window.i18n.getLanguage();

  // Set active button
  langBtns.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    // Add click listener
    btn.addEventListener('click', async () => {
      const newLang = btn.getAttribute('data-lang');
      await window.i18n.setLanguage(newLang);

      // Update active state
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Translate page
      window.i18n.translatePage();

      // Update page title
      document.title = window.i18n.t('common.appName', 'Placement Dashboard');
    });
  });
}

// ==================== TAB NAVIGATION & LOGIN ====================

// Tab navigation functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all tabs and contents
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active to clicked tab
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Form submission handlers
const adminForm = document.getElementById('admin-login-form');
const userForm = document.getElementById('user-login-form');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleLogin('admin');
});

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleLogin('user');
});

async function handleLogin(role) {
  const email = role === 'admin' 
    ? document.getElementById('admin-email').value 
    : document.getElementById('user-email').value;
  
  const password = role === 'admin' 
    ? document.getElementById('admin-password').value 
    : document.getElementById('user-password').value;

  // Validate inputs
  if (!email || !password) {
    showError(window.i18n.t('messages.invalidInput', 'Please fill in all fields'));
    return;
  }

  // Show loading spinner
  showLoading(true);
  hideError();

  try {
    console.log('[LOGIN] Sending request:', { email, role });

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim(), password, role }),
    });

    console.log('[LOGIN] Response status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('[LOGIN] Response data:', data);
    } catch (jsonErr) {
      console.error('[LOGIN] JSON parse error:', jsonErr);
      throw new Error(`Invalid response (${response.status}): ${response.statusText}`);
    }

    if (response.ok) {
      // Store session data
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('language', window.i18n.getLanguage());
      console.log('[LOGIN] Success, redirecting...');
      window.location.href = '/index.html';  // Absolute path
    } else {
      const errorMsg = data.message || window.i18n.t('login.loginFailed', `Login failed (HTTP ${response.status})`);
      console.error('[LOGIN] Auth error:', errorMsg);
      showError(errorMsg);
    }
  } catch (error) {
    console.error('Login network error:', error);
    
    let errorMsg = window.i18n.t('errors.networkError', 'Network error: ');
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMsg += 'Server not reachable. Check if server is running on port 3000.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMsg += 'Cannot connect to server. Verify http://localhost:3000.';
    } else {
      errorMsg += error.message;
    }
    
    showError(errorMsg);
  } finally {
    showLoading(false);
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove('hidden');
  } else {
    loadingSpinner.classList.add('hidden');
  }
}

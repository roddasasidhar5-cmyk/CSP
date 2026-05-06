// ==================== INTERNATIONALIZATION (I18N) ====================

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initializeI18n();
  setupLanguageSwitcher();
  i18n.translatePage();
  setupPasswordToggles();
  setupViewSwitching();
  setupAutoFocus();
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

// ==================== PASSWORD TOGGLE ====================

function setupPasswordToggles() {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = toggle.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// ==================== VIEW SWITCHING (Login <-> Register) ====================

function setupViewSwitching() {
  const showRegisterBtn = document.getElementById('show-register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', switchToRegister);
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', switchToLogin);
  }
}

function switchToRegister() {
  const userTab = document.getElementById('user-tab');
  const registerTab = document.getElementById('register-tab');

  // Fade out user tab
  userTab.style.opacity = '0';
  userTab.style.transform = 'translateY(-10px)';

  setTimeout(() => {
    userTab.classList.remove('active');
    userTab.style.display = 'none';

    // Show register tab
    registerTab.style.display = 'block';
    void registerTab.offsetWidth;
    registerTab.classList.add('active');

    // Auto-focus first input
    const firstInput = registerTab.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }, 200);
}

function switchToLogin() {
  const userTab = document.getElementById('user-tab');
  const registerTab = document.getElementById('register-tab');

  // Fade out register tab
  registerTab.style.opacity = '0';
  registerTab.style.transform = 'translateY(-10px)';

  setTimeout(() => {
    registerTab.classList.remove('active');
    registerTab.style.display = 'none';

    // Show user tab
    userTab.style.display = 'block';
    void userTab.offsetWidth;
    userTab.classList.add('active');

    // Auto-focus first input
    const firstInput = userTab.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }, 200);
}

// ==================== AUTO FOCUS ====================

function setupAutoFocus() {
  // Focus first input on page load
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) {
    const firstInput = activeTab.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
  }
}

// ==================== FORM HANDLERS ====================

const userForm = document.getElementById('user-login-form');
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loadingOverlay = document.getElementById('loading-overlay');
const loginBox = document.querySelector('.login-box');

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleLogin();
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleRegister();
});

async function handleLogin() {
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const role = 'user';


// Validate inputs
  if (!email || !password || !role) {
    showError(window.i18n.t('messages.invalidInput', 'Please fill in all fields including role'));
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Please enter a valid email address');
    return;
  }

  // Password validation
  if (password.length < 6) {
    showError('Password must be at least 6 characters long');
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
      window.location.href = '/index.html';
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

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;

  if (!name || !email || !password) {
    showError('Please fill in all fields');
    return;
  }

  showLoading(true);
  hideError();

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: email.toLowerCase(), password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      showSuccess('Registration successful! Please log in.');
      // Switch back to login view
      switchToLogin();
      registerForm.reset();
    } else {
      showError(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Register error:', error);
    showError('Network error: Unable to register. Is the server running?');
  } finally {
    showLoading(false);
  }
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');

  // Trigger shake animation
  loginBox.classList.remove('shake');
  void loginBox.offsetWidth;
  loginBox.classList.add('shake');

  // Remove shake class after animation
  setTimeout(() => {
    loginBox.classList.remove('shake');
  }, 500);
}

function showSuccess(message) {
  errorText.textContent = message;
  errorMessage.style.background = 'rgba(34, 197, 94, 0.15)';
  errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.3)';
  errorMessage.style.color = '#bbf7d0';
  errorMessage.querySelector('i').className = 'fas fa-check-circle';
  errorMessage.classList.remove('hidden');

  // Reset styles after 3 seconds
  setTimeout(() => {
    errorMessage.style.background = '';
    errorMessage.style.borderColor = '';
    errorMessage.style.color = '';
    errorMessage.querySelector('i').className = 'fas fa-exclamation-circle';
    hideError();
  }, 3000);
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function showLoading(show) {
  if (show) {
    loadingOverlay.classList.add('active');
  } else {
    loadingOverlay.classList.remove('active');
  }
}


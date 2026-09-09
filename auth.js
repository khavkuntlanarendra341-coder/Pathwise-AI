const FinPathAuth = (() => {
  const USERS_KEY = 'finpath_ai_users_v1';
  const SESSION_KEY = 'finpath_ai_session_v1';
  const DEFAULT_PROVIDER = 'local';

  const route = {
    login: '/login/',
    signup: '/signup/',
    dashboard: '/dashboard/',
    onboarding: '/onboarding-wizard.html'
  };

  const PROFILE_KEY = 'finpath_student_onboarding_v1';

  function ensureStorage() {
    if (!window.localStorage) {
      throw new Error('Browser storage is unavailable.');
    }
  }

  function decodeHTML(value) {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function passwordValidation(password) {
    const results = {
      valid: true,
      errors: []
    };

    if (password.length < 8) {
      results.valid = false;
      results.errors.push('Use at least 8 characters.');
    }

    if (!/[A-Z]/.test(password)) {
      results.valid = false;
      results.errors.push('Add at least one uppercase letter.');
    }

    if (!/[a-z]/.test(password)) {
      results.valid = false;
      results.errors.push('Add at least one lowercase letter.');
    }

    if (!/\d/.test(password)) {
      results.valid = false;
      results.errors.push('Add at least one number.');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      results.valid = false;
      results.errors.push('Add at least one symbol.');
    }

    return results;
  }

  async function hashPassword(password, saltBytes = makeSalt()) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBytes,
      iterations: 120000
    }, keyMaterial, 256);

    return {
      passwordHash: bytesToHex(new Uint8Array(derivedBits)),
      passwordSalt: bytesToHex(saltBytes)
    };
  }

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  function hexToBytes(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  }

  function makeSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  function loadUsers() {
    ensureStorage();
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function persistUsers(users) {
    ensureStorage();
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentSession() {
    ensureStorage();
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function setCurrentSession(user) {
    ensureStorage();
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    if (user.profile) {
      session.profile = user.profile;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearCurrentSession() {
    ensureStorage();
    window.localStorage.removeItem(SESSION_KEY);
  }

  function signUp(name, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        ensureStorage();

        const trimmedName = String(name || '').trim();
        const trimmedEmail = String(email || '').trim().toLowerCase();
        const trimmedPassword = String(password || '');

        if (!trimmedName) {
          reject(new Error('Name is required.'));
          return;
        }

        if (!isValidEmail(trimmedEmail)) {
          reject(new Error('Enter a valid student email address.'));
          return;
        }

        const validation = passwordValidation(trimmedPassword);
        if (!validation.valid) {
          reject(new Error(validation.errors.join(' ')));
          return;
        }

        const users = loadUsers();
        if (users.some((user) => user.email === trimmedEmail)) {
          reject(new Error('An account already exists for that email.'));
          return;
        }

        const salt = makeSalt();
        const { passwordHash, passwordSalt } = await hashPassword(trimmedPassword, salt);

        const user = {
          id: crypto.randomUUID(),
          name: trimmedName,
          email: trimmedEmail,
          passwordHash,
          passwordSalt,
          authProvider: DEFAULT_PROVIDER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        users.push(user);
        persistUsers(users);
        setCurrentSession(user);

        resolve({ user, redirect: route.onboarding });
      } catch (error) {
        reject(error);
      }
    });
  }


async function login(email, password) {
  ensureStorage();

  const trimmedEmail = String(email || '').trim().toLowerCase();
  const trimmedPassword = String(password || '');

  if (!isValidEmail(trimmedEmail)) {
    throw new Error('Enter a valid email address.');
  }

  if (!trimmedPassword) {
    throw new Error('Enter your password.');
  }

  const users = loadUsers();
  const registeredUser = users.find((candidate) => candidate.email === trimmedEmail);
  let user;

  if (registeredUser) {
    const { passwordHash } = await hashPassword(password, hexToBytes(registeredUser.passwordSalt));
    if (passwordHash !== registeredUser.passwordHash) {
      throw new Error('Email or password is incorrect.');
    }
    user = registeredUser;
  } else {
    user = {
      id: 'demo-user',
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      authProvider: 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: JSON.parse(window.localStorage.getItem(PROFILE_KEY) || 'null')
    };
  }

  setCurrentSession(user);

  return {
    user,
    redirect: route.dashboard
  };
}


  function logout() {
    clearCurrentSession();
    window.location.href = route.login;
  }

  function requireAuth() {
    const session = getCurrentSession();
    const currentPath = window.location.pathname;
    if (!session && !currentPath.startsWith(route.login) && !currentPath.startsWith(route.signup)) {
      window.location.href = route.login;
    }

    if (session && (currentPath === '/' || currentPath.startsWith(route.login))) {
      window.location.href = route.dashboard;
    }

    if (session && currentPath.startsWith(route.signup)) {
      window.location.href = route.dashboard;
    }
  }

  function initLoginPage() {
    const form = document.querySelector('#loginForm');
    const errorBox = document.querySelector('#authError');

    if (!form || !errorBox) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');

      try {
        form.classList.add('is-loading');
        errorBox.textContent = '';
        const result = await login(email, password);
        window.location.assign(result.redirect);
      } catch (error) {
        errorBox.textContent = error.message;
      } finally {
        form.classList.remove('is-loading');
      }
    });
  }

  function initSignupPage() {
    const form = document.querySelector('#signupForm');
    const errorBox = document.querySelector('#authError');

    if (!form || !errorBox) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '');
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');

      try {
        form.classList.add('is-loading');
        errorBox.textContent = '';
        const result = await signUp(name, email, password);
        window.location.assign(result.redirect);
      } catch (error) {
        errorBox.textContent = error.message;
      } finally {
        form.classList.remove('is-loading');
      }
    });
  }

  function initLogoutButtons() {
    Array.from(document.querySelectorAll('[data-logout]')).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        logout();
      });
    });
  }

  function initOnboardingPage() {
    const onboardingForm = document.querySelector('#onboardingForm');
    if (!onboardingForm) return;

    onboardingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(onboardingForm);
      const session = getCurrentSession();
      if (!session) {
        window.location.assign(route.login);
        return;
      }

      session.profile = {
        field: String(formData.get('field') || 'Data Science'),
        academicProgram: String(formData.get('program') || 'Career Pathway'),
        annualBudget: String(formData.get('budget') || '0')
      };

      const users = loadUsers();
      const userIndex = users.findIndex((u) => u.email === session.email);
      if (userIndex >= 0) {
        users[userIndex].updatedAt = new Date().toISOString();
        users[userIndex].profile = session.profile;
        persistUsers(users);
      }

      window.location.assign(route.dashboard);
    });
  }

  function init() {
    requireAuth();
    initLoginPage();
    initSignupPage();
    initLogoutButtons();
    initOnboardingPage();
  }

  return {
    signUp,
    login,
    logout,
    requireAuth,
    getCurrentSession,
    validatePassword: passwordValidation,
    init
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  FinPathAuth.init();
});

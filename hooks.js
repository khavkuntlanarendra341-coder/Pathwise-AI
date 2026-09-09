const FinPathAuthHooks = (() => {
  const USERS_KEY = 'finpath_ai_users_v1';
  const SESSION_KEY = 'finpath_ai_session_v1';

  function getSession() {
    const session = window.localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  function getCurrentUser() {
    return getSession();
  }

  function isAuthenticated() {
    return Boolean(getSession());
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    window.location.assign('/login/');
  }

  function createSession(user) {
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function persistUserProfile(profile) {
    const session = getSession();
    if (!session) return;

    const users = JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((item) => item.email === session.email);
    if (user) {
      user.profile = profile;
      user.updatedAt = new Date().toISOString();
      window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }

  return {
    getSession,
    getCurrentUser,
    isAuthenticated,
    logout,
    createSession,
    persistUserProfile
  };
})();

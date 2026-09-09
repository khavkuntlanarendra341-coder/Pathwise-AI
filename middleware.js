const FinPathAuthMiddleware = (() => {
  const route = {
    login: '/login/',
    signup: '/signup/',
    dashboard: '/dashboard/',
    onboarding: '/onboarding/'
  };

  function getSession() {
    const session = window.localStorage.getItem('finpath_ai_session_v1');
    return session ? JSON.parse(session) : null;
  }

  function requireAuth() {
    const session = getSession();
    const path = window.location.pathname;
    const isPublicAuthPath = path.startsWith(route.login) || path.startsWith(route.signup);

    if (!session && !isPublicAuthPath) {
      window.location.assign(route.login);
      return false;
    }

    if (session && isPublicAuthPath) {
      window.location.assign(route.dashboard);
      return false;
    }

    return true;
  }

  function requireGuest() {
    const session = getSession();
    if (session) {
      window.location.assign(route.dashboard);
      return false;
    }
    return true;
  }

  return {
    route,
    getSession,
    requireAuth,
    requireGuest
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  FinPathAuthMiddleware.requireAuth();
});

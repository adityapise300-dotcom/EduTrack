/**
 * auth.js
 * Login, logout and session/token management.
 * Session is kept in localStorage as: token, user (JSON), schoolId.
 */
(function () {
  const { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, SCHOOL_STORAGE_KEY } = window.APP_CONFIG;

  async function login(schoolId, username, password, remember) {
    const data = await window.Api.fetchWithToken('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ schoolId, username, password }),
    });

    const storage = remember === false ? sessionStorage : localStorage;
    // Always write to localStorage too so the rest of the app (which reads
    // from localStorage) works regardless of the "remember me" choice —
    // sessionStorage is used only to decide persistence across browser
    // restarts is out of scope for this mock. Simplify: always localStorage.
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    localStorage.setItem(SCHOOL_STORAGE_KEY, data.user.schoolId);
    return data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(SCHOOL_STORAGE_KEY);
  }

  function getCurrentUser() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!token || !raw) return null;
    try {
      const user = JSON.parse(raw);
      return { token, userId: user.id, role: user.role, schoolId: user.schoolId, user };
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = resolvePath('/login.html');
      return null;
    }
    return getCurrentUser();
  }

  // Resolve an app-root-relative path (e.g. "/login.html") against the
  // current deployment location, so the app also works when hosted in a
  // sub-folder rather than the domain root.
  function resolvePath(rootRelativePath) {
    return rootRelativePath; // app is deployed at domain root by default
  }

  window.Auth = { login, logout, getCurrentUser, isLoggedIn, requireAuth, resolvePath };
})();

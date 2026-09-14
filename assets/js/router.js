/**
 * router.js
 * Lightweight client-side guards. These exist purely for UX (hide pages
 * from the wrong role, bounce logged-out users to the login screen) —
 * the backend must always be the source of truth for authorization.
 *
 * Usage at the top of any protected page:
 *   <script src="/assets/js/router.js"></script>
 *   <script>Router.requireRole(['student']);</script>
 */
(function () {
  function depthPrefix() {
    // Pages live one folder deep (e.g. /student/dashboard.html), so
    // root-relative paths like "/login.html" resolve correctly from any
    // host as long as the app is served from its root. This helper is kept
    // so future nested routes have a single place to adjust.
    return '';
  }

  function requireAuth() {
    const session = window.Auth.getCurrentUser();
    if (!session) {
      window.location.href = `${depthPrefix()}/login.html`;
      return null;
    }
    return session;
  }

  function requireRole(allowedRoles) {
    const session = requireAuth();
    if (!session) return null;
    if (!allowedRoles.includes(session.role)) {
      window.location.href = `${depthPrefix()}/unauthorized.html`;
      return null;
    }
    return session;
  }

  function redirectToDashboardByRole(role) {
    const target = window.APP_CONFIG.ROLE_HOME[role] || '/login.html';
    window.location.href = target;
  }

  function redirectIfLoggedIn() {
    const session = window.Auth.getCurrentUser();
    if (session) redirectToDashboardByRole(session.role);
  }

  window.Router = { requireAuth, requireRole, redirectToDashboardByRole, redirectIfLoggedIn };
})();

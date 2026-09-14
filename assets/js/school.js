/**
 * school.js
 * Fetches the list of schools for the tenant-selection dropdown, and
 * (optionally) per-school configuration such as theming or feature flags.
 */
(function () {
  async function getSchools() {
    return window.Api.fetchWithToken('/auth/schools');
  }

  async function getSchoolConfig(schoolId) {
    const schools = await getSchools();
    return schools.find((s) => s.id === schoolId) || null;
  }

  window.School = { getSchools, getSchoolConfig };
})();

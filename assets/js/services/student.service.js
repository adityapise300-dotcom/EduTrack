/**
 * student.service.js
 * Data access for the student role. Thin wrappers around Api.fetchWithToken
 * so page scripts never call fetch() directly.
 */
window.StudentService = {
  getAttendance: () => Api.fetchWithToken('/student/attendance'),
  getResults: () => Api.fetchWithToken('/student/results'),
  getAssignments: () => Api.fetchWithToken('/student/assignments'),
  getTimetable: () => Api.fetchWithToken('/student/timetable'),
  getFees: () => Api.fetchWithToken('/student/fees'),
};

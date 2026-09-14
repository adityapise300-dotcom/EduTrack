/**
 * teacher.service.js
 * Data access for the teacher role.
 */
window.TeacherService = {
  getClassesToday: () => Api.fetchWithToken('/teacher/classes-today'),
  getClasses: () => Api.fetchWithToken('/teacher/classes'),
  getRoster: () => Api.fetchWithToken('/teacher/roster'),
  getSubmissions: () => Api.fetchWithToken('/teacher/submissions'),
  getSchedule: () => Api.fetchWithToken('/teacher/schedule'),
  markAttendance: (classId, date, records) =>
    Api.fetchWithToken('/teacher/attendance', { method: 'POST', body: JSON.stringify({ classId, date, records }) }),
  saveMarks: (examId, marksArray) =>
    Api.fetchWithToken('/teacher/marks', { method: 'POST', body: JSON.stringify({ examId, marksArray }) }),
  createAssignment: (data) =>
    Api.fetchWithToken('/teacher/assignments', { method: 'POST', body: JSON.stringify(data) }),
};

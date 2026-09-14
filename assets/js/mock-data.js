/**
 * mock-data.js
 * Stand-in "database" for the mock backend used by api.js / the service
 * layer while USE_MOCK_BACKEND is true in config.js. Replace this whole
 * file (and the mock branches in api.js) once real API endpoints exist —
 * the service layer's function signatures are designed to stay the same.
 */
(function () {
  const SCHOOLS = [
    { id: 'sch_lincoln', name: 'Lincoln High School', city: 'Pune', code: 'LHS' },
    { id: 'sch_riverdale', name: 'Riverdale Public School', city: 'Mumbai', code: 'RPS' },
    { id: 'sch_stxaviers', name: "St. Xavier's Academy", city: 'Bengaluru', code: 'SXA' },
  ];

  // demo accounts — password for every seeded account is "password123"
  const USERS = [
    { id: 'u_student_1', schoolId: 'sch_lincoln', role: 'student', name: 'Ananya Sharma', email: 'ananya.student@edutrack.io', username: 'ananya.student', classLabel: 'Grade 10 - A', rollNo: '10A-14', avatarColor: '#4F46E5' },
    { id: 'u_teacher_1', schoolId: 'sch_lincoln', role: 'teacher', name: 'Mr. Rohan Verma', email: 'rohan.teacher@edutrack.io', username: 'rohan.teacher', subject: 'Mathematics', avatarColor: '#10B981' },
    { id: 'u_parent_1', schoolId: 'sch_lincoln', role: 'parent', name: 'Mrs. Sunita Sharma', email: 'sunita.parent@edutrack.io', username: 'sunita.parent', avatarColor: '#F59E0B' },
    { id: 'u_admin_1', schoolId: 'sch_lincoln', role: 'admin', name: 'Dr. Julian Vance', email: 'julian.admin@edutrack.io', username: 'julian.admin', avatarColor: '#0F172A' },
    { id: 'u_accountant_1', schoolId: 'sch_lincoln', role: 'accountant', name: 'Priya Nair', email: 'priya.accounts@edutrack.io', username: 'priya.accounts', avatarColor: '#4F46E5' },
    { id: 'u_transport_1', schoolId: 'sch_lincoln', role: 'transport', name: 'Vikram Singh', email: 'vikram.transport@edutrack.io', username: 'vikram.transport', avatarColor: '#10B981' },
    { id: 'u_librarian_1', schoolId: 'sch_lincoln', role: 'librarian', name: 'Meera Iyer', email: 'meera.library@edutrack.io', username: 'meera.library', avatarColor: '#F59E0B' },
  ];

  const DEMO_PASSWORD = 'password123';

  const CHILDREN = [
    { id: 'child_1', parentId: 'u_parent_1', name: 'Ananya Sharma', classLabel: 'Grade 10 - A', rollNo: '10A-14', studentId: 'u_student_1' },
    { id: 'child_2', parentId: 'u_parent_1', name: 'Aarav Sharma', classLabel: 'Grade 6 - C', rollNo: '6C-08', studentId: 'u_student_2' },
  ];

  const ATTENDANCE_SUMMARY = { present: 172, absent: 6, late: 4, leave: 3, totalDays: 185, percentage: 93.0 };

  const ATTENDANCE_LOG = [
    { date: '2026-09-12', status: 'Present' }, { date: '2026-09-11', status: 'Present' },
    { date: '2026-09-10', status: 'Late' }, { date: '2026-09-09', status: 'Present' },
    { date: '2026-09-08', status: 'Absent' }, { date: '2026-09-05', status: 'Present' },
    { date: '2026-09-04', status: 'Present' }, { date: '2026-09-03', status: 'Leave' },
    { date: '2026-09-02', status: 'Present' }, { date: '2026-09-01', status: 'Present' },
  ];

  const RESULTS = [
    { exam: 'Term 1 — Unit Test 2', subject: 'Mathematics', marks: 88, maxMarks: 100, grade: 'A' },
    { exam: 'Term 1 — Unit Test 2', subject: 'Physics', marks: 76, maxMarks: 100, grade: 'B+' },
    { exam: 'Term 1 — Unit Test 2', subject: 'Chemistry', marks: 91, maxMarks: 100, grade: 'A+' },
    { exam: 'Term 1 — Unit Test 2', subject: 'English', marks: 82, maxMarks: 100, grade: 'A' },
    { exam: 'Term 1 — Unit Test 2', subject: 'Computer Science', marks: 95, maxMarks: 100, grade: 'A+' },
    { exam: 'Term 1 — Unit Test 1', subject: 'Mathematics', marks: 79, maxMarks: 100, grade: 'B+' },
    { exam: 'Term 1 — Unit Test 1', subject: 'Physics', marks: 71, maxMarks: 100, grade: 'B' },
  ];

  const ASSIGNMENTS = [
    { id: 'a1', title: 'Quadratic Equations — Problem Set 4', subject: 'Mathematics', dueDate: '2026-09-18', status: 'Pending', teacher: 'Mr. Rohan Verma' },
    { id: 'a2', title: 'Lab Report: Acid-Base Titration', subject: 'Chemistry', dueDate: '2026-09-16', status: 'Submitted', teacher: 'Ms. Kavita Rao' },
    { id: 'a3', title: 'Essay: Climate Change Mitigation', subject: 'English', dueDate: '2026-09-14', status: 'Graded', grade: '18/20', teacher: 'Mr. Arjun Mehta' },
    { id: 'a4', title: 'Binary Search Tree Implementation', subject: 'Computer Science', dueDate: '2026-09-20', status: 'Pending', teacher: 'Ms. Divya Kulkarni' },
  ];

  const TIMETABLE = {
    Monday: [
      { time: '08:30 - 09:15', subject: 'Mathematics', room: 'Room 204', teacher: 'Mr. Rohan Verma' },
      { time: '09:15 - 10:00', subject: 'Physics', room: 'Lab 1', teacher: 'Ms. Kavita Rao' },
      { time: '10:15 - 11:00', subject: 'English', room: 'Room 108', teacher: 'Mr. Arjun Mehta' },
      { time: '11:00 - 11:45', subject: 'Computer Science', room: 'Lab 3', teacher: 'Ms. Divya Kulkarni' },
    ],
    Tuesday: [
      { time: '08:30 - 09:15', subject: 'Chemistry', room: 'Lab 2', teacher: 'Ms. Kavita Rao' },
      { time: '09:15 - 10:00', subject: 'Mathematics', room: 'Room 204', teacher: 'Mr. Rohan Verma' },
      { time: '10:15 - 11:00', subject: 'History', room: 'Room 110', teacher: 'Mrs. Leela Menon' },
      { time: '11:00 - 11:45', subject: 'Physical Education', room: 'Field', teacher: 'Mr. Sameer Khan' },
    ],
    Wednesday: [
      { time: '08:30 - 09:15', subject: 'English', room: 'Room 108', teacher: 'Mr. Arjun Mehta' },
      { time: '09:15 - 10:00', subject: 'Computer Science', room: 'Lab 3', teacher: 'Ms. Divya Kulkarni' },
      { time: '10:15 - 11:00', subject: 'Mathematics', room: 'Room 204', teacher: 'Mr. Rohan Verma' },
      { time: '11:00 - 11:45', subject: 'Chemistry', room: 'Lab 2', teacher: 'Ms. Kavita Rao' },
    ],
    Thursday: [
      { time: '08:30 - 09:15', subject: 'Physics', room: 'Lab 1', teacher: 'Ms. Kavita Rao' },
      { time: '09:15 - 10:00', subject: 'History', room: 'Room 110', teacher: 'Mrs. Leela Menon' },
      { time: '10:15 - 11:00', subject: 'English', room: 'Room 108', teacher: 'Mr. Arjun Mehta' },
      { time: '11:00 - 11:45', subject: 'Mathematics', room: 'Room 204', teacher: 'Mr. Rohan Verma' },
    ],
    Friday: [
      { time: '08:30 - 09:15', subject: 'Computer Science', room: 'Lab 3', teacher: 'Ms. Divya Kulkarni' },
      { time: '09:15 - 10:00', subject: 'Chemistry', room: 'Lab 2', teacher: 'Ms. Kavita Rao' },
      { time: '10:15 - 11:00', subject: 'Physical Education', room: 'Field', teacher: 'Mr. Sameer Khan' },
      { time: '11:00 - 11:45', subject: 'Art', room: 'Studio', teacher: 'Ms. Fiona D’Souza' },
    ],
  };

  const FEES = {
    summary: { totalDue: 45000, totalPaid: 30000, pending: 15000, nextDueDate: '2026-10-05' },
    installments: [
      { term: 'Term 1 Tuition', amount: 15000, status: 'Paid', paidOn: '2026-06-10', receipt: 'RCPT-1042' },
      { term: 'Term 2 Tuition', amount: 15000, status: 'Paid', paidOn: '2026-08-02', receipt: 'RCPT-1198' },
      { term: 'Term 3 Tuition', amount: 15000, status: 'Due', paidOn: null, receipt: null },
      { term: 'Annual Lab & Activity Fee', amount: 5000, status: 'Due', paidOn: null, receipt: null },
    ],
  };

  const CLASSES = [
    { id: 'c10a', label: 'Grade 10 - A', teacher: 'Mr. Rohan Verma', students: 32, room: 'Room 204' },
    { id: 'c10b', label: 'Grade 10 - B', teacher: 'Mr. Rohan Verma', students: 30, room: 'Room 205' },
    { id: 'c9a', label: 'Grade 9 - A', teacher: 'Ms. Kavita Rao', students: 29, room: 'Room 110' },
  ];

  const TEACHER_CLASSES_TODAY = [
    { time: '08:30 - 09:15', classLabel: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 204', attendanceMarked: true },
    { time: '10:15 - 11:00', classLabel: 'Grade 9 - A', subject: 'Mathematics', room: 'Room 110', attendanceMarked: false },
    { time: '12:00 - 12:45', classLabel: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 205', attendanceMarked: false },
  ];

  const STUDENTS_FOR_ATTENDANCE = [
    { rollNo: '10A-01', name: 'Aditi Bhatt' }, { rollNo: '10A-02', name: 'Rahul Kapoor' },
    { rollNo: '10A-03', name: 'Sneha Joshi' }, { rollNo: '10A-04', name: 'Karan Malhotra' },
    { rollNo: '10A-05', name: 'Priya Desai' }, { rollNo: '10A-06', name: 'Aman Gupta' },
    { rollNo: '10A-07', name: 'Neha Reddy' }, { rollNo: '10A-08', name: 'Vivek Nair' },
    { rollNo: '10A-09', name: 'Ishita Sen' }, { rollNo: '10A-10', name: 'Rohan Pillai' },
    { rollNo: '10A-11', name: 'Divya Menon' }, { rollNo: '10A-12', name: 'Arjun Rao' },
    { rollNo: '10A-13', name: 'Kavya Iyer' }, { rollNo: '10A-14', name: 'Ananya Sharma' },
  ];

  const SUBMISSIONS = [
    { student: 'Aditi Bhatt', assignment: 'Quadratic Equations — Problem Set 4', submittedOn: '2026-09-15', status: 'Submitted', grade: null },
    { student: 'Rahul Kapoor', assignment: 'Quadratic Equations — Problem Set 4', submittedOn: '2026-09-16', status: 'Submitted', grade: null },
    { student: 'Sneha Joshi', assignment: 'Quadratic Equations — Problem Set 4', submittedOn: null, status: 'Pending', grade: null },
    { student: 'Karan Malhotra', assignment: 'Quadratic Equations — Problem Set 4', submittedOn: '2026-09-14', status: 'Graded', grade: '17/20' },
  ];

  const NOTICES = [
    { id: 'n1', title: 'Annual Sports Day — Schedule Released', date: '2026-09-10', audience: 'All', priority: 'Normal' },
    { id: 'n2', title: 'PTA Meeting for Grade 9-10', date: '2026-09-08', audience: 'Parents', priority: 'High' },
    { id: 'n3', title: 'Library Closed for Stock-Taking (Sept 20-21)', date: '2026-09-05', audience: 'All', priority: 'Normal' },
    { id: 'n4', title: 'Fee Payment Deadline Reminder — Term 3', date: '2026-09-01', audience: 'Parents', priority: 'High' },
  ];

  const FEE_STRUCTURES = [
    { classLabel: 'Grade 1 - 5', tuition: 40000, transport: 12000, lab: 3000 },
    { classLabel: 'Grade 6 - 8', tuition: 48000, transport: 12000, lab: 4000 },
    { classLabel: 'Grade 9 - 10', tuition: 55000, transport: 14000, lab: 5000 },
    { classLabel: 'Grade 11 - 12', tuition: 65000, transport: 14000, lab: 7000 },
  ];

  const TRANSACTIONS = [
    { id: 'TXN-8841', student: 'Ananya Sharma', classLabel: '10A-14', amount: 15000, mode: 'UPI', date: '2026-09-12', status: 'Paid' },
    { id: 'TXN-8840', student: 'Rahul Kapoor', classLabel: '10A-02', amount: 15000, mode: 'Card', date: '2026-09-11', status: 'Paid' },
    { id: 'TXN-8839', student: 'Meera Kulkarni', classLabel: '9B-19', amount: 8000, mode: 'Cash', date: '2026-09-11', status: 'Paid' },
    { id: 'TXN-8838', student: 'Sanjay Verma', classLabel: '8C-05', amount: 12000, mode: 'Bank Transfer', date: '2026-09-10', status: 'Pending' },
    { id: 'TXN-8837', student: 'Kavya Iyer', classLabel: '10A-13', amount: 15000, mode: 'UPI', date: '2026-09-09', status: 'Paid' },
  ];

  const DEFAULTERS = [
    { student: 'Sanjay Verma', classLabel: '8C-05', dueAmount: 12000, overdueDays: 14 },
    { student: 'Ritika Shah', classLabel: '7A-11', dueAmount: 9500, overdueDays: 7 },
    { student: 'Farhan Sheikh', classLabel: '11B-02', dueAmount: 18000, overdueDays: 21 },
  ];

  const CONCESSIONS = [
    { student: 'Meera Kulkarni', classLabel: '9B-19', type: 'Sibling Discount', percentage: 10, approvedBy: 'Dr. Julian Vance' },
    { student: 'Om Prakash', classLabel: '6A-04', type: 'Merit Scholarship', percentage: 25, approvedBy: 'Dr. Julian Vance' },
    { student: 'Zara Ahmed', classLabel: '10B-08', type: 'Staff Ward', percentage: 50, approvedBy: 'Dr. Julian Vance' },
  ];

  const ROUTES = [
    { id: 'R1', name: 'Route 1 — Koregaon Park Loop', driver: 'Suresh Patil', vehicle: 'MH-12-AB-4521', capacity: 45, occupied: 38, stops: 9, status: 'Active' },
    { id: 'R2', name: 'Route 2 — Viman Nagar Express', driver: 'Ramesh Jadhav', vehicle: 'MH-12-CD-7788', capacity: 40, occupied: 40, stops: 7, status: 'Active' },
    { id: 'R3', name: 'Route 3 — Hinjewadi Corridor', driver: 'Anil Deshmukh', vehicle: 'MH-12-EF-1290', capacity: 45, occupied: 22, stops: 11, status: 'Active' },
    { id: 'R4', name: 'Route 4 — Kothrud Circle', driver: 'Sunil Gaikwad', vehicle: 'MH-12-GH-6634', capacity: 40, occupied: 0, stops: 8, status: 'Maintenance' },
  ];

  const TRANSPORT_STUDENTS = [
    { name: 'Ananya Sharma', classLabel: '10A-14', route: 'Route 1 — Koregaon Park Loop', stop: 'Koregaon Park Gate 3', pickupTime: '07:15 AM' },
    { name: 'Rahul Kapoor', classLabel: '10A-02', route: 'Route 1 — Koregaon Park Loop', stop: 'North Main Road', pickupTime: '07:20 AM' },
    { name: 'Meera Kulkarni', classLabel: '9B-19', route: 'Route 2 — Viman Nagar Express', stop: 'Viman Nagar Square', pickupTime: '07:05 AM' },
    { name: 'Sanjay Verma', classLabel: '8C-05', route: 'Route 3 — Hinjewadi Corridor', stop: 'Hinjewadi Phase 2', pickupTime: '06:55 AM' },
  ];

  const BOOKS = [
    { isbn: '9780141439600', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Fiction', copies: 6, available: 2 },
    { isbn: '9780262033848', title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Computer Science', copies: 4, available: 1 },
    { isbn: '9780199535569', title: 'Frankenstein', author: 'Mary Shelley', category: 'Fiction', copies: 5, available: 5 },
    { isbn: '9780134685991', title: 'Effective Java', author: 'Joshua Bloch', category: 'Computer Science', copies: 3, available: 0 },
    { isbn: '9780070084784', title: 'Concepts of Physics', author: 'H.C. Verma', category: 'Science', copies: 10, available: 6 },
  ];

  const ISSUED_BOOKS = [
    { title: 'Introduction to Algorithms', student: 'Karan Malhotra', classLabel: '10A-04', issuedOn: '2026-08-28', dueOn: '2026-09-11', status: 'Overdue' },
    { title: 'Effective Java', student: 'Vivek Nair', classLabel: '10A-08', issuedOn: '2026-09-01', dueOn: '2026-09-15', status: 'Issued' },
    { title: 'Effective Java', student: 'Arjun Rao', classLabel: '10A-12', issuedOn: '2026-09-03', dueOn: '2026-09-17', status: 'Issued' },
    { title: 'Pride and Prejudice', student: 'Kavya Iyer', classLabel: '10A-13', issuedOn: '2026-08-20', dueOn: '2026-09-03', status: 'Returned' },
  ];

  const EXAMS = [
    { name: 'Term 1 — Unit Test 1', classes: 'Grade 9 - 12', startDate: '2026-07-14', endDate: '2026-07-18', status: 'Completed' },
    { name: 'Term 1 — Unit Test 2', classes: 'Grade 9 - 12', startDate: '2026-09-08', endDate: '2026-09-12', status: 'Completed' },
    { name: 'Term 1 — Final Examination', classes: 'Grade 9 - 12', startDate: '2026-10-20', endDate: '2026-10-29', status: 'Scheduled' },
    { name: 'Term 2 — Unit Test 1', classes: 'Grade 9 - 12', startDate: '2026-12-08', endDate: '2026-12-12', status: 'Scheduled' },
  ];

  const ADMIN_OVERVIEW = {
    totalStudents: 1842, totalTeachers: 96, totalClasses: 42,
    feeCollectedThisMonth: 2840000, feeCollectionRate: 87,
    attendanceToday: 94.2, pendingAdmissions: 12,
  };

  const TEACHERS_DIRECTORY = [
    { name: 'Mr. Rohan Verma', subject: 'Mathematics', classes: '10A, 10B, 9A', email: 'rohan.teacher@edutrack.io', status: 'Active' },
    { name: 'Ms. Kavita Rao', subject: 'Physics / Chemistry', classes: '10A, 9A', email: 'kavita.rao@edutrack.io', status: 'Active' },
    { name: 'Mr. Arjun Mehta', subject: 'English', classes: '10A, 10B, 8C', email: 'arjun.mehta@edutrack.io', status: 'Active' },
    { name: 'Ms. Divya Kulkarni', subject: 'Computer Science', classes: '10A, 11B', email: 'divya.kulkarni@edutrack.io', status: 'On Leave' },
  ];

  const STUDENTS_DIRECTORY = [
    { name: 'Ananya Sharma', rollNo: '10A-14', classLabel: 'Grade 10 - A', guardian: 'Mrs. Sunita Sharma', status: 'Active' },
    { name: 'Rahul Kapoor', rollNo: '10A-02', classLabel: 'Grade 10 - A', guardian: 'Mr. Dinesh Kapoor', status: 'Active' },
    { name: 'Meera Kulkarni', rollNo: '9B-19', classLabel: 'Grade 9 - B', guardian: 'Mrs. Anita Kulkarni', status: 'Active' },
    { name: 'Sanjay Verma', rollNo: '8C-05', classLabel: 'Grade 8 - C', guardian: 'Mr. Rakesh Verma', status: 'Inactive' },
  ];

  window.MockDB = {
    SCHOOLS, USERS, DEMO_PASSWORD, CHILDREN,
    ATTENDANCE_SUMMARY, ATTENDANCE_LOG, RESULTS, ASSIGNMENTS, TIMETABLE, FEES,
    CLASSES, TEACHER_CLASSES_TODAY, STUDENTS_FOR_ATTENDANCE, SUBMISSIONS, NOTICES,
    FEE_STRUCTURES, TRANSACTIONS, DEFAULTERS, CONCESSIONS,
    ROUTES, TRANSPORT_STUDENTS, BOOKS, ISSUED_BOOKS, EXAMS,
    ADMIN_OVERVIEW, TEACHERS_DIRECTORY, STUDENTS_DIRECTORY,
  };
})();

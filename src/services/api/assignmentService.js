import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getByClassId(classId) {
    await delay(200);
    const classAssignments = assignments.filter(a => a.classId === parseInt(classId));
    return [...classAssignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      totalPoints: parseInt(assignmentData.totalPoints)
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(350);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { 
      ...assignmentData, 
      Id: parseInt(id),
      totalPoints: parseInt(assignmentData.totalPoints)
    };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
throw new Error("Assignment not found");
  }
  const deletedAssignment = assignments.splice(index, 1)[0];
  return { ...deletedAssignment };
},

async getAssignmentProgress(assignmentId) {
  await delay(250);
  const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  
  const totalStudents = assignment.submissions?.length || 0;
  const submittedCount = assignment.submissions?.filter(s => s.status === 'submitted').length || 0;
  const pendingCount = assignment.submissions?.filter(s => s.status === 'pending').length || 0;
  const overdueCount = assignment.submissions?.filter(s => s.status === 'overdue').length || 0;
  
  return {
    assignmentId: assignment.Id,
    title: assignment.title,
    dueDate: assignment.dueDate,
    totalStudents,
    submittedCount,
    pendingCount,
    overdueCount,
    completionRate: totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0
  };
},

async updateSubmissionStatus(assignmentId, studentId, status, submittedAt = null) {
  await delay(200);
  const assignmentIndex = assignments.findIndex(a => a.Id === parseInt(assignmentId));
  if (assignmentIndex === -1) {
    throw new Error("Assignment not found");
  }
  
  const assignment = assignments[assignmentIndex];
  if (!assignment.submissions) {
    assignment.submissions = [];
  }
  
  const submissionIndex = assignment.submissions.findIndex(s => s.studentId === parseInt(studentId));
  if (submissionIndex >= 0) {
    assignment.submissions[submissionIndex] = {
      ...assignment.submissions[submissionIndex],
      status,
      submittedAt: submittedAt || new Date().toISOString()
    };
  } else {
    assignment.submissions.push({
      studentId: parseInt(studentId),
      status,
      submittedAt: submittedAt || new Date().toISOString()
    });
  }
  
  return { ...assignment };
},

async sendReminder(assignmentId, reminderType = 'due_soon') {
  await delay(300);
  const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  
  if (!assignment.reminderEnabled) {
    throw new Error("Reminders are disabled for this assignment");
  }
  
  // Simulate sending reminder
  const reminderSent = {
    assignmentId: assignment.Id,
    title: assignment.title,
    reminderType,
    sentAt: new Date().toISOString(),
    recipients: assignment.submissions?.length || 0
  };
  
  return reminderSent;
},

async getOverdueAssignments() {
  await delay(200);
  const today = new Date().toDateString();
  const overdueAssignments = assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate).toDateString();
    return new Date(dueDate) < new Date(today);
  });
  
  return overdueAssignments.map(assignment => ({
    ...assignment,
    daysOverdue: Math.ceil((new Date() - new Date(assignment.dueDate)) / (1000 * 60 * 60 * 24))
  }));
}
};
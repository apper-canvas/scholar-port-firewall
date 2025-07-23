import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getByClassId(classId) {
    await delay(200);
    const classGrades = grades.filter(g => {
      // Find grades by matching assignment's classId
      return true; // For now, return all grades
    });
    return [...classGrades];
  },

  async getByStudentId(studentId) {
    await delay(200);
    const studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    return [...studentGrades];
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      score: parseFloat(gradeData.score),
      submittedDate: gradeData.submittedDate || new Date().toISOString().split("T")[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(350);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { 
      ...gradeData, 
      Id: parseInt(id),
      score: parseFloat(gradeData.score)
    };
    return { ...grades[index] };
  },

  async updateOrCreate(studentId, assignmentId, score) {
    await delay(300);
    const existingGrade = grades.find(g => 
      g.studentId === parseInt(studentId) && g.assignmentId === parseInt(assignmentId)
    );

    if (existingGrade) {
      existingGrade.score = parseFloat(score);
      existingGrade.submittedDate = new Date().toISOString().split("T")[0];
      return { ...existingGrade };
    } else {
      const maxId = Math.max(...grades.map(g => g.Id), 0);
      const newGrade = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        assignmentId: parseInt(assignmentId),
        score: parseFloat(score),
        submittedDate: new Date().toISOString().split("T")[0]
      };
      grades.push(newGrade);
      return { ...newGrade };
    }
  },

  async delete(id) {
    await delay(250);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
};
import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getByDate(date) {
    await delay(200);
    const dateAttendance = attendance.filter(a => a.date === date);
    return [...dateAttendance];
  },

  async getByStudentId(studentId) {
    await delay(200);
    const studentAttendance = attendance.filter(a => a.studentId === parseInt(studentId));
    return [...studentAttendance];
  },

  async getByClassId(classId) {
    await delay(200);
    const classAttendance = attendance.filter(a => a.classId === parseInt(classId));
    return [...classAttendance];
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newAttendance = {
      ...attendanceData,
      Id: maxId + 1
    };
    attendance.push(newAttendance);
    return { ...newAttendance };
  },

  async updateOrCreate(studentId, classId, date, status, note = "") {
    await delay(300);
    const existingRecord = attendance.find(a => 
      a.studentId === parseInt(studentId) && 
      a.classId === parseInt(classId) && 
      a.date === date
    );

    if (existingRecord) {
      existingRecord.status = status;
      existingRecord.note = note;
      return { ...existingRecord };
    } else {
      const maxId = Math.max(...attendance.map(a => a.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        date,
        status,
        note
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async delete(id) {
    await delay(250);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
};
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const GradeGrid = ({ students, assignments, grades, onGradeChange, onSave }) => {
  const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : "";
  };

  const getStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return "-";
    
    const total = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round(total / studentGrades.length);
  };

  const getLetterGrade = (average) => {
    if (average === "-") return "-";
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grade Entry</CardTitle>
        <Button onClick={onSave} size="sm">
          <ApperIcon name="Save" className="mr-2" size={16} />
          Save Changes
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-200 min-w-[200px]">
                  Student
                </th>
                {assignments.map((assignment) => (
                  <th key={assignment.Id} className="text-center py-3 px-3 font-medium text-gray-700 min-w-[80px]">
                    <div className="text-sm">{assignment.title}</div>
                    <div className="text-xs text-gray-500">({assignment.totalPoints} pts)</div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[100px] border-l border-gray-200">
                  Average
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px]">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => {
                const average = getStudentAverage(student.Id);
                const letterGrade = getLetterGrade(average);
                
                return (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
<td className="sticky left-0 bg-white py-3 px-4 border-r border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-xs">
                            {student.first_name_c[0]}{student.last_name_c[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {student.first_name_c} {student.last_name_c}
                          </div>
                          <div className="text-xs text-gray-500">Grade {student.grade_level_c}</div>
                        </div>
                      </div>
                    </td>
                    {assignments.map((assignment) => (
                      <td key={assignment.Id} className="py-3 px-3 text-center">
                        <Input
                          type="number"
                          min="0"
                          max={assignment.totalPoints}
                          value={getGrade(student.Id, assignment.Id)}
                          onChange={(e) => onGradeChange(student.Id, assignment.Id, e.target.value)}
                          className="w-16 text-center text-sm"
                          placeholder="-"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center border-l border-gray-200">
                      <span className="font-semibold text-gray-900">{average}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        letterGrade === "A" ? "bg-success-100 text-success-800" :
                        letterGrade === "B" ? "bg-primary-100 text-primary-800" :
                        letterGrade === "C" ? "bg-warning-100 text-warning-800" :
                        letterGrade === "F" ? "bg-error-100 text-error-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {letterGrade}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeGrid;
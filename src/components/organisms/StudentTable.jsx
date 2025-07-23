import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Records</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Grade Level</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Enrolled</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Contact</th>
                <th className="text-right py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
<td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-medium text-sm">
                          {(student?.first_name_c?.[0] || "?")}{(student?.last_name_c?.[0] || "?")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.first_name_c || ''} {student.last_name_c || ''}
                        </div>
                        <div className="text-sm text-gray-500">{student.email_c}</div>
                      </div>
                    </div>
                  </td>
<td className="py-4 px-6 text-gray-900">
                    Grade {student.grade_level_c}
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    {format(new Date(student.enrollment_date_c), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusVariant(student.status_c)}>
                      {student.status_c}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    {student.parent_contact_c}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(student)}
                        className="p-2"
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(student)}
                        className="p-2"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(student.Id)}
                        className="p-2 text-error-600 hover:text-error-700"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";

const AttendanceGrid = ({ students, attendance, selectedDate, onAttendanceChange, onSave }) => {
  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(a => 
      a.studentId === studentId && 
      format(new Date(a.date), "yyyy-MM-dd") === selectedDate
    );
    return record ? record.status : "present";
  };

  const statusOptions = [
    { value: "present", label: "Present", icon: "Check", color: "success" },
    { value: "absent", label: "Absent", icon: "X", color: "error" },
    { value: "late", label: "Late", icon: "Clock", color: "warning" },
    { value: "excused", label: "Excused", icon: "FileText", color: "default" }
  ];

  const getStatusConfig = (status) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance - {format(new Date(selectedDate), "MMMM dd, yyyy")}</CardTitle>
        <Button onClick={onSave} size="sm">
          <ApperIcon name="Save" className="mr-2" size={16} />
          Save Attendance
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student, index) => {
            const currentStatus = getAttendanceStatus(student.Id);
            const statusConfig = getStatusConfig(currentStatus);

            return (
<motion.div
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-medium text-sm">
                      {student.first_name_c?.[0] || ''}{student.last_name_c?.[0] || ''}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {student.first_name_c} {student.last_name_c}
                    </div>
                    <div className="text-sm text-gray-500">Grade {student.grade_level_c}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant={statusConfig.color}>
                    <ApperIcon name={statusConfig.icon} size={12} className="mr-1" />
                    {statusConfig.label}
                  </Badge>

                  <div className="flex items-center space-x-1">
                    {statusOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={currentStatus === option.value ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => onAttendanceChange(student.Id, option.value)}
                        className="p-2"
                        title={option.label}
                      >
                        <ApperIcon name={option.icon} size={16} />
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;
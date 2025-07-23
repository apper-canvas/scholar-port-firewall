import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Attendance = ({ onMenuClick }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsData, classesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAttendance(attendanceData);
      
      // Auto-select first class
      if (classesData.length > 0 && !selectedClassId) {
        setSelectedClassId(classesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calculate attendance stats for selected date
    const dateAttendance = attendance.filter(a => a.date === selectedDate);
    const stats = {
      present: dateAttendance.filter(a => a.status === "present").length,
      absent: dateAttendance.filter(a => a.status === "absent").length,
      late: dateAttendance.filter(a => a.status === "late").length,
      excused: dateAttendance.filter(a => a.status === "excused").length
    };
    setAttendanceStats(stats);
  }, [attendance, selectedDate]);

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => 
        a.studentId === parseInt(studentId) && 
        a.date === selectedDate &&
        a.classId === parseInt(selectedClassId)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        const maxId = Math.max(...prev.map(a => a.Id), 0);
        return [...prev, {
          Id: maxId + 1,
          studentId: parseInt(studentId),
          classId: parseInt(selectedClassId),
          date: selectedDate,
          status,
          note: ""
        }];
      }
    });
  };

  const handleSaveAttendance = async () => {
    try {
      // In a real app, this would make API calls to save attendance
      toast.success("Attendance saved successfully!");
    } catch (err) {
      toast.error("Failed to save attendance");
    }
  };

  const getClassStudents = () => {
    if (!selectedClassId) return [];
    
    const selectedClass = classes.find(c => c.Id === parseInt(selectedClassId));
    if (!selectedClass) return [];
    
    return students.filter(student => selectedClass.studentIds.includes(student.Id));
  };

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadData} />;
    
    if (classes.length === 0) {
      return (
        <Empty
          title="No classes found"
          description="You need to create classes before you can take attendance."
          icon="BookOpen"
          actionLabel="Go to Classes"
          onAction={() => window.location.href = "/classes"}
        />
      );
    }

    if (!selectedClassId) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Class</h3>
            <p className="text-gray-600">Choose a class to take attendance.</p>
          </CardContent>
        </Card>
      );
    }

    const classStudents = getClassStudents();
    
    if (classStudents.length === 0) {
      return (
        <Empty
          title="No students in this class"
          description="This class doesn't have any students enrolled yet."
          icon="Users"
          actionLabel="Manage Classes"
          onAction={() => window.location.href = "/classes"}
        />
      );
    }

    return (
      <AttendanceGrid
        students={classStudents}
        attendance={attendance}
        selectedDate={selectedDate}
        onAttendanceChange={handleAttendanceChange}
        onSave={handleSaveAttendance}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Attendance Tracking"
        onMenuClick={onMenuClick}
      />

      <main className="p-6">
        {/* Attendance Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Settings" className="mr-2" size={20} />
                Attendance Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <Select value={selectedClassId} onChange={handleClassChange}>
                    <option value="">Choose a class...</option>
                    {classes.map(classItem => (
                      <option key={classItem.Id} value={classItem.Id}>
                        {classItem.name} ({classItem.period})
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>

                {selectedClassId && (
                  <div className="flex items-end">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">Students Enrolled</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {getClassStudents().length}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Attendance Summary */}
              {selectedClassId && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="present">Present</Badge>
                    <span className="text-lg font-semibold text-success-600">
                      {attendanceStats.present}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="absent">Absent</Badge>
                    <span className="text-lg font-semibold text-error-600">
                      {attendanceStats.absent}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="late">Late</Badge>
                    <span className="text-lg font-semibold text-warning-600">
                      {attendanceStats.late}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="excused">Excused</Badge>
                    <span className="text-lg font-semibold text-gray-600">
                      {attendanceStats.excused}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Attendance;
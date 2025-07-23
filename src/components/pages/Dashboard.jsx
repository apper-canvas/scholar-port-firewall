import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { assignmentService } from "@/services/api/assignmentService";
import { format } from "date-fns";

const Dashboard = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    averageGrade: 0,
    totalAssignments: 0,
    pendingSubmissions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Enhanced service calls to include system fields for real-time activity generation
      const [students, classes, attendance, grades, assignments] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        assignmentService.getAll()
      ]);

      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = attendance.filter(a => a.date === today);
      const presentToday = todayAttendance.filter(a => a.status === "present").length;

      const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
      const averageGrade = grades.length > 0 ? Math.round(totalGrades / grades.length) : 0;

      const pendingSubmissions = assignments.reduce((count, assignment) => {
        return count + (assignment.submissions?.filter(s => s.status === 'pending').length || 0);
      }, 0);

      setDashboardData({
        totalStudents: students.length,
        totalClasses: classes.length,
        presentToday,
        averageGrade,
        totalAssignments: assignments.length,
        pendingSubmissions
      });

      // Generate real-time activities based on actual database records
      const activities = generateRecentActivities({
        students,
        classes,
        attendance,
        grades,
        assignments
      });

      setRecentActivity(activities);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Generate real-time activities based on actual database operations
  const generateRecentActivities = ({ students, classes, attendance, grades, assignments }) => {
    const activities = [];
    const now = new Date();

    // Helper function to format relative time
    const getRelativeTime = (timestamp) => {
      if (!timestamp) return "recently";
      
      const date = new Date(timestamp);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return format(date, "MMM d, yyyy");
    };

    // Process student activities
    students.forEach(student => {
      if (student.CreatedOn) {
        activities.push({
          type: "student",
          message: `Student ${student.first_name_c || student.Name || 'New Student'} enrolled`,
          time: getRelativeTime(student.CreatedOn),
          icon: "UserPlus",
          timestamp: new Date(student.CreatedOn)
        });
      }
      if (student.ModifiedOn && student.ModifiedOn !== student.CreatedOn) {
        activities.push({
          type: "student",
          message: `Student ${student.first_name_c || student.Name || 'Student'} information updated`,
          time: getRelativeTime(student.ModifiedOn),
          icon: "Users",
          timestamp: new Date(student.ModifiedOn)
        });
      }
    });

    // Process assignment activities
    assignments.forEach(assignment => {
      if (assignment.CreatedOn) {
        activities.push({
          type: "assignment",
          message: `Assignment "${assignment.title || assignment.Name}" created`,
          time: getRelativeTime(assignment.CreatedOn),
          icon: "ClipboardList",
          timestamp: new Date(assignment.CreatedOn)
        });
      }
      if (assignment.ModifiedOn && assignment.ModifiedOn !== assignment.CreatedOn) {
        activities.push({
          type: "assignment",
          message: `Assignment "${assignment.title || assignment.Name}" updated`,
          time: getRelativeTime(assignment.ModifiedOn),
          icon: "Edit",
          timestamp: new Date(assignment.ModifiedOn)
        });
      }
    });

    // Process grade activities
    grades.forEach(grade => {
      if (grade.CreatedOn) {
        activities.push({
          type: "grade",
          message: `Grade ${grade.score} recorded`,
          time: getRelativeTime(grade.CreatedOn),
          icon: "FileText",
          timestamp: new Date(grade.CreatedOn)
        });
      }
    });

    // Process attendance activities
    attendance.forEach(record => {
      if (record.CreatedOn) {
        const statusText = record.status === 'present' ? 'marked present' : 
                          record.status === 'absent' ? 'marked absent' : 
                          record.status === 'late' ? 'marked late' : 'attendance recorded';
        activities.push({
          type: "attendance",
          message: `Student ${statusText} for ${format(new Date(record.date), "MMM d")}`,
          time: getRelativeTime(record.CreatedOn),
          icon: "Calendar",
          timestamp: new Date(record.CreatedOn)
        });
      }
    });

    // Process class activities
    classes.forEach(cls => {
      if (cls.CreatedOn) {
        activities.push({
          type: "class",
          message: `Class "${cls.subject || cls.Name}" scheduled`,
          time: getRelativeTime(cls.CreatedOn),
          icon: "BookOpen",
          timestamp: new Date(cls.CreatedOn)
        });
      }
      if (cls.ModifiedOn && cls.ModifiedOn !== cls.CreatedOn) {
        activities.push({
          type: "class",
          message: `Class "${cls.subject || cls.Name}" updated`,
          time: getRelativeTime(cls.ModifiedOn),
          icon: "BookOpen",
          timestamp: new Date(cls.ModifiedOn)
        });
      }
    });

    // Sort by timestamp (most recent first) and return top 10
    return activities
      .filter(activity => activity.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(({ timestamp, ...activity }) => activity); // Remove timestamp from final output
  };

  useEffect(() => {
    loadDashboardData();
}, []);

  // Quick action handlers
  const handleAddStudent = () => {
    navigate('/students');
  };

  const handleTakeAttendance = () => {
    navigate('/attendance');
  };

  const handleEnterGrades = () => {
    navigate('/grades');
  };

  const handleCreateAssignment = () => {
    navigate('/assignments');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header 
        title="Dashboard Overview" 
        onMenuClick={onMenuClick}
      />
      
      <main className="p-6">
        {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={dashboardData.totalStudents}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+2 this month"
          />
          <StatCard
            title="Total Classes"
            value={dashboardData.totalClasses}
            icon="BookOpen"
            color="secondary"
            trend="neutral"
            trendValue="Same as last week"
          />
          <StatCard
            title="Present Today"
            value={dashboardData.presentToday}
            icon="Calendar"
            color="success"
            trend="up"
            trendValue="85% attendance rate"
          />
          <StatCard
            title="Assignments"
            value={dashboardData.totalAssignments}
            icon="ClipboardList"
            color="warning"
            trend="up"
            trendValue={`${dashboardData.pendingSubmissions} pending`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Activity" className="mr-2" size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full p-2">
                        <ApperIcon name={activity.icon} size={16} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Zap" className="mr-2" size={20} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
<motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg cursor-pointer border border-primary-200"
                    onClick={handleAddStudent}
                  >
                    <div className="flex flex-col items-center text-center">
                      <ApperIcon name="UserPlus" className="text-primary-600 mb-2" size={24} />
                      <span className="text-sm font-medium text-primary-900">Add Student</span>
                    </div>
                  </motion.div>

<motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg cursor-pointer border border-secondary-200"
                    onClick={handleTakeAttendance}
                  >
                    <div className="flex flex-col items-center text-center">
                      <ApperIcon name="Calendar" className="text-secondary-600 mb-2" size={24} />
                      <span className="text-sm font-medium text-secondary-900">Take Attendance</span>
                    </div>
                  </motion.div>

<motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg cursor-pointer border border-success-200"
                    onClick={handleEnterGrades}
                  >
                    <div className="flex flex-col items-center text-center">
                      <ApperIcon name="FileText" className="text-success-600 mb-2" size={24} />
                      <span className="text-sm font-medium text-success-900">Enter Grades</span>
                    </div>
                  </motion.div>

<motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg cursor-pointer border border-warning-200"
                    onClick={handleCreateAssignment}
                  >
                    <div className="flex flex-col items-center text-center">
                      <ApperIcon name="ClipboardList" className="text-warning-600 mb-2" size={24} />
                      <span className="text-sm font-medium text-warning-900">Create Assignment</span>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
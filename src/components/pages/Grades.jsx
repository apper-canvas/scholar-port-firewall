import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import GradeGrid from "@/components/organisms/GradeGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = ({ onMenuClick }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsData, classesData, gradesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setGrades(gradesData);
      
      // Auto-select first class
      if (classesData.length > 0 && !selectedClassId) {
        setSelectedClassId(classesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load grade data");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async (classId) => {
    if (!classId) return;
    
    try {
      const assignmentsData = await assignmentService.getByClassId(classId);
      setAssignments(assignmentsData);
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadAssignments(selectedClassId);
    }
  }, [selectedClassId]);

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };

  const handleGradeChange = (studentId, assignmentId, score) => {
    if (score === "") {
      // Remove grade if empty
      setGrades(prev => prev.filter(g => 
        !(g.studentId === parseInt(studentId) && g.assignmentId === parseInt(assignmentId))
      ));
      return;
    }

    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0) return;

    // Update or add grade in local state
    setGrades(prev => {
      const existingIndex = prev.findIndex(g => 
        g.studentId === parseInt(studentId) && g.assignmentId === parseInt(assignmentId)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], score: numericScore };
        return updated;
      } else {
        const maxId = Math.max(...prev.map(g => g.Id), 0);
        return [...prev, {
          Id: maxId + 1,
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId),
          score: numericScore,
          submittedDate: new Date().toISOString().split("T")[0]
        }];
      }
    });
  };

  const handleSaveGrades = async () => {
    try {
      // In a real app, this would make API calls to save the grades
      toast.success("Grades saved successfully!");
    } catch (err) {
      toast.error("Failed to save grades");
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
          description="You need to create classes before you can enter grades."
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
            <ApperIcon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Class</h3>
            <p className="text-gray-600">Choose a class to view and enter grades.</p>
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

    if (assignments.length === 0) {
      return (
        <Empty
          title="No assignments found"
          description="Create assignments for this class to start entering grades."
          icon="FileText"
          actionLabel="Create Assignment"
          onAction={() => toast.info("Assignment creation feature coming soon!")}
        />
      );
    }

    return (
      <GradeGrid
        students={classStudents}
        assignments={assignments}
        grades={grades}
        onGradeChange={handleGradeChange}
        onSave={handleSaveGrades}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Grade Management"
        onMenuClick={onMenuClick}
      />

      <main className="p-6">
        {/* Class Selection */}
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
                Grade Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                
                {selectedClassId && (
                  <>
                    <div className="flex items-end">
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">Students Enrolled</div>
                        <div className="text-2xl font-bold text-primary-600">
                          {getClassStudents().length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">Assignments</div>
                        <div className="text-2xl font-bold text-secondary-600">
                          {assignments.length}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade Grid */}
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

export default Grades;
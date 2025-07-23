import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useStudents } from "@/hooks/useStudents";
import { motion, AnimatePresence } from "framer-motion";

const Students = ({ onMenuClick }) => {
  const {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
  } = useStudents();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchStudents(query);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleViewStudent = (student) => {
    // For now, just edit - could open a detailed view modal
    handleEditStudent(student);
  };

  const handleFormSubmit = async (studentData) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.Id, studentData);
      } else {
        await createStudent(studentData);
      }
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(studentId);
    }
  };

  const renderContent = () => {
    if (showForm) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <StudentForm
            student={editingStudent}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </motion.div>
      );
    }

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadStudents} />;
    
    if (students.length === 0) {
      return (
        <Empty
          title="No students found"
          description={searchQuery ? 
            "No students match your search criteria. Try adjusting your search terms." :
            "Get started by adding your first student to the system."
          }
          icon="Users"
          actionLabel={searchQuery ? undefined : "Add First Student"}
          onAction={searchQuery ? undefined : handleAddStudent}
        />
      );
    }

    return (
      <StudentTable
        students={students}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onView={handleViewStudent}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Student Management"
        onMenuClick={onMenuClick}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search students..."
        actions={
          !showForm && (
            <Button onClick={handleAddStudent}>
              <ApperIcon name="Plus" className="mr-2" size={16} />
              Add Student
            </Button>
          )
        }
      />

      <main className="p-6">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Students;
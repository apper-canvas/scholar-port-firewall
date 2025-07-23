import React, { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StudentForm from "@/components/organisms/StudentForm";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

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
  const [showView, setShowView] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

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
    setViewingStudent(student);
    setShowView(true);
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
    setShowView(false);
    setViewingStudent(null);
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

    if (showView && viewingStudent) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="User" className="mr-3 text-primary-600" size={24} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {viewingStudent.first_name_c} {viewingStudent.last_name_c}
                    </h2>
                    <p className="text-sm text-gray-600">Student Details</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleFormCancel}>
                  <ApperIcon name="X" className="mr-2" size={16} />
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {viewingStudent.first_name_c || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {viewingStudent.last_name_c || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {viewingStudent.email_c || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade Level
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      Grade {viewingStudent.grade_level_c || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Date
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {viewingStudent.enrollment_date_c ? 
                        new Date(viewingStudent.enrollment_date_c).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Contact
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {viewingStudent.parent_contact_c || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-md">
                      <Badge 
                        variant={
                          viewingStudent.status_c === 'active' ? 'success' :
                          viewingStudent.status_c === 'inactive' ? 'error' : 'warning'
                        }
                      >
                        {viewingStudent.status_c ? 
                          viewingStudent.status_c.charAt(0).toUpperCase() + viewingStudent.status_c.slice(1) : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      #{viewingStudent.Id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          !showForm && !showView && (
            <Button onClick={handleAddStudent}>
              <ApperIcon name="Plus" className="mr-2" size={16} />
              Add Student
            </Button>
          )
        }
/>

      <main className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Students;
import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Classes = ({ onMenuClick }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const getStudentNames = (studentIds) => {
    return studentIds
      .map(id => {
        const student = students.find(s => s.Id === id);
        return student ? `${student.first_name_c} ${student.last_name_c}` : "";
      })
      .filter(name => name);
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadData} />;
    
    if (filteredClasses.length === 0) {
      return (
        <Empty
          title="No classes found"
          description={searchQuery ? 
            "No classes match your search criteria. Try adjusting your search terms." :
            "Get started by creating your first class."
          }
          icon="BookOpen"
          actionLabel={searchQuery ? undefined : "Create First Class"}
          onAction={searchQuery ? undefined : () => toast.info("Class creation feature coming soon!")}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem, index) => (
          <motion.div
            key={classItem.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-display gradient-text">
                    {classItem.name}
                  </CardTitle>
                  <Badge variant="primary">{classItem.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Clock" className="mr-2" size={16} />
                    {classItem.period}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="MapPin" className="mr-2" size={16} />
                    {classItem.room}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Users" className="mr-2" size={16} />
                    {classItem.studentIds.length} students enrolled
                  </div>

                  {classItem.studentIds.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Enrolled Students:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {getStudentNames(classItem.studentIds).slice(0, 3).map((name, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                            {name}
                          </div>
                        ))}
                        {classItem.studentIds.length > 3 && (
                          <div className="text-gray-500">
                            +{classItem.studentIds.length - 3} more students
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <ApperIcon name="Eye" className="mr-1" size={14} />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <ApperIcon name="Edit" className="mr-1" size={14} />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error-600 hover:text-error-700">
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Class Management"
        onMenuClick={onMenuClick}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search classes..."
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" className="mr-2" size={16} />
            Create Class
          </Button>
        }
      />

      <main className="p-6">
        {renderContent()}
        
        {showCreateModal && (
          <CreateClassModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadData();
            }}
            students={students}
          />
        )}
      </main>
    </div>
  );
};

// Create Class Modal Component
const CreateClassModal = ({ onClose, onSuccess, students }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    studentIds: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.period.trim()) {
      newErrors.period = "Period is required";
    }
    
    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await classService.create(formData);
      if (result) {
        toast.success("Class created successfully!");
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleStudentSelection = (studentId) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold gradient-text">Create New Class</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter class name"
                className={errors.name ? "border-error-500" : ""}
              />
              {errors.name && (
                <p className="text-error-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Enter subject"
                className={errors.subject ? "border-error-500" : ""}
              />
              {errors.subject && (
                <p className="text-error-600 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period *
              </label>
              <Input
                type="text"
                value={formData.period}
                onChange={(e) => handleInputChange("period", e.target.value)}
                placeholder="Enter period (e.g., 1st, 2nd)"
                className={errors.period ? "border-error-500" : ""}
              />
              {errors.period && (
                <p className="text-error-600 text-sm mt-1">{errors.period}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room *
              </label>
              <Input
                type="text"
                value={formData.room}
                onChange={(e) => handleInputChange("room", e.target.value)}
                placeholder="Enter room number"
                className={errors.room ? "border-error-500" : ""}
              />
              {errors.room && (
                <p className="text-error-600 text-sm mt-1">{errors.room}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enroll Students (Optional)
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-gray-500 text-sm">No students available</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <label key={student.Id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.studentIds.includes(student.Id)}
                        onChange={() => handleStudentSelection(student.Id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
/>
                      <span className="text-sm text-gray-700">
                        {student.first_name_c} {student.last_name_c}
                        {student.email_c && <span className="text-gray-500 ml-1">({student.email_c})</span>}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {formData.studentIds.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.studentIds.length} student{formData.studentIds.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="mr-2" size={16} />
                  Create Class
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Classes;
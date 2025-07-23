import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
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
        return student ? `${student.firstName} ${student.lastName}` : "";
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
          <Button onClick={() => toast.info("Create class feature coming soon!")}>
            <ApperIcon name="Plus" className="mr-2" size={16} />
            Create Class
          </Button>
        }
      />

      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Classes;
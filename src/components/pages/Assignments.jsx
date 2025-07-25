import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { assignmentService } from "@/services/api/assignmentService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import Chart from "react-apexcharts";

const Assignments = ({ onMenuClick }) => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [progressData, setProgressData] = useState({});

const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    classId: "",
    totalPoints: "",
    dueDate: "",
    category: "",
    status: "pending",
    reminderEnabled: true
  });
const categories = ["Quiz", "Homework", "Exam", "Essay", "Lab", "Project"];
  const statuses = ["pending", "in progress", "completed", "submitted", "graded"];
const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll()
      ]);
      setAssignments(assignmentsData);
      setClasses(classesData);
      
      // Calculate real-time progress data based on actual assignments
      const calculatedProgressData = assignmentService.calculateProgressData(assignmentsData);
      setProgressData(calculatedProgressData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
if (!formData.title || !formData.classId || !formData.totalPoints || !formData.dueDate || !formData.category || !formData.status) {
      toast.error("Please fill in all required fields: title, class, category, status, total points, and due date");
      return;
    }

    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, formData);
        toast.success("Assignment updated successfully");
      } else {
        await assignmentService.create(formData);
        toast.success("Assignment created successfully");
      }
      
      setShowForm(false);
      setEditingAssignment(null);
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save assignment");
    }
  };

const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
setFormData({
      title: assignment.title,
      description: assignment.description || "",
      instructions: assignment.instructions || "",
      classId: assignment.classId ? assignment.classId.toString() : "",
      totalPoints: assignment.totalPoints ? assignment.totalPoints.toString() : "",
      dueDate: assignment.dueDate,
      category: assignment.category,
      status: assignment.status || "pending",
      reminderEnabled: assignment.reminderEnabled ?? true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      await assignmentService.delete(id);
      toast.success("Assignment deleted successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete assignment");
    }
  };

  const handleSendReminder = async (assignmentId) => {
    try {
      await assignmentService.sendReminder(assignmentId);
      toast.success("Reminder sent successfully");
    } catch (err) {
      toast.error(err.message || "Failed to send reminder");
    }
  };

  const resetForm = () => {
setFormData({
      title: "",
      description: "",
      instructions: "",
      classId: "",
      totalPoints: "",
      dueDate: "",
      category: "",
      status: "pending",
      reminderEnabled: true
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAssignment(null);
    resetForm();
  };

  const getStatusBadge = (assignment) => {
    const dueDate = parseISO(assignment.dueDate);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    if (isBefore(dueDate, now)) {
      return <Badge variant="error">Overdue</Badge>;
    } else if (isBefore(dueDate, threeDaysFromNow)) {
      return <Badge variant="warning">Due Soon</Badge>;
    } else {
      return <Badge variant="success">Upcoming</Badge>;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || (assignment.classId ? assignment.classId.toString() === selectedClass : false);
    const matchesCategory = !categoryFilter || assignment.category === categoryFilter;
    return matchesSearch && matchesClass && matchesCategory;
  });

  const getProgressChartData = () => {
    const progressValues = Object.values(progressData);
    if (progressValues.length === 0) return { series: [], options: {} };

    const series = [{
      name: 'Completion Rate',
      data: progressValues.map(p => p.completionRate)
    }];

    const options = {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: progressValues.map(p => p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title),
      },
      yaxis: {
        title: {
          text: 'Completion Rate (%)'
        }
      },
      fill: {
        opacity: 1,
        colors: ['#2563EB']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%"
          }
        }
      }
    };

    return { series, options };
  };

  const getSubmissionStatusData = () => {
    const progressValues = Object.values(progressData);
    if (progressValues.length === 0) return { series: [], options: {} };

    const totalSubmitted = progressValues.reduce((sum, p) => sum + p.submittedCount, 0);
    const totalPending = progressValues.reduce((sum, p) => sum + p.pendingCount, 0);
    const totalOverdue = progressValues.reduce((sum, p) => sum + p.overdueCount, 0);

    const series = [totalSubmitted, totalPending, totalOverdue];
    const options = {
      chart: {
        type: 'donut',
        height: 350,
      },
      labels: ['Submitted', 'Pending', 'Overdue'],
      colors: ['#10B981', '#F59E0B', '#EF4444'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    return { series, options };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <Header 
        title="Assignment Management" 
        onMenuClick={onMenuClick}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search assignments..."
      />
      
      <main className="h-full overflow-y-auto p-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.Id} value={cls.Id.toString()}>
                  {cls.name}
                </option>
              ))}
            </Select>
            
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Progress Charts */}
        {Object.keys(progressData).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="BarChart3" className="mr-2" size={20} />
                  Assignment Completion Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={getProgressChartData().options}
                  series={getProgressChartData().series}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="PieChart" className="mr-2" size={20} />
                  Overall Submission Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={getSubmissionStatusData().options}
                  series={getSubmissionStatusData().series}
                  type="donut"
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assignment Form */}
<Modal
          isOpen={showForm}
          onRequestClose={handleCancel}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
          ariaHideApp={false}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
                  </CardTitle>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
                      label="Assignment Title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter assignment title"
                      required
                      error=""
                    />

<FormField
                      label="Class"
                      type="select"
                      value={formData.classId}
                      onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                      placeholder="Select a class"
                      options={classes.map(cls => ({
                        value: cls.Id.toString(),
                        label: cls.name
                      }))}
                      required
                      error=""
                    />

<FormField
                      label="Category"
                      type="select"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Select category"
                      options={categories.map(category => ({
                        value: category,
                        label: category
                      }))}
                      required
                      error=""
                    />

<FormField
                      label="Total Points"
                      type="number"
                      value={formData.totalPoints}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalPoints: e.target.value }))}
                      placeholder="Enter total points"
                      required
                      error=""
                    />

<FormField
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                      error=""
                    />

<FormField
                      label="Status"
                      type="select"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      placeholder="Select status"
                      options={statuses.map(status => ({
                        value: status,
                        label: status.charAt(0).toUpperCase() + status.slice(1)
                      }))}
                      required
                      error=""
                    />

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="reminderEnabled"
                        checked={formData.reminderEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="reminderEnabled" className="text-sm font-medium">
                        Enable automatic reminders
                      </label>
                    </div>
                  </div>
<FormField
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter assignment description"
                    error=""
                  />

<FormField
                    label="Instructions"
                    type="textarea"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Enter detailed instructions for students"
                    error=""
                  />

                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingAssignment ? "Update Assignment" : "Create Assignment"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Modal>

{/* Assignments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="ClipboardList" className="mr-2" size={20} />
              Assignments ({filteredAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {filteredAssignments.length === 0 ? (
              <Empty 
                title="No assignments found"
                description="Create your first assignment to get started."
                actionLabel="Create Assignment"
                onAction={() => setShowForm(true)}
              />
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => {
                  const progress = progressData[assignment.Id];
                  const className = classes.find(c => c.Id === assignment.classId)?.name || "Unknown Class";
                  
                  return (
                    <motion.div
                      key={assignment.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assignment.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {className} • {assignment.category} • {assignment.totalPoints} points
                              </p>
                            </div>
                            {getStatusBadge(assignment)}
                          </div>
                          
{assignment.description && (
                            <p className="text-sm text-gray-700 mb-2">{assignment.description}</p>
                          )}
                          
                          {assignment.status && (
                            <div className="mb-2">
                              <Badge variant={
                                assignment.status === 'completed' || assignment.status === 'graded' ? 'success' :
                                assignment.status === 'in progress' || assignment.status === 'submitted' ? 'warning' :
                                'default'
                              }>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <ApperIcon name="Calendar" size={14} className="mr-1" />
                              Due: {format(parseISO(assignment.dueDate), "MMM dd, yyyy")}
                            </span>
                            {assignment.reminderEnabled && (
                              <span className="flex items-center">
                                <ApperIcon name="Bell" size={14} className="mr-1" />
                                Reminders enabled
                              </span>
                            )}
                          </div>

                          {progress && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progress: {progress.completionRate}%</span>
                                <span>{progress.submittedCount}/{progress.totalStudents} submitted</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full" 
                                  style={{ width: `${progress.completionRate}%` }}
                                ></div>
                              </div>
                              <div className="flex gap-4 mt-2 text-xs">
                                <span className="text-green-600">✓ {progress.submittedCount} submitted</span>
                                <span className="text-yellow-600">⏳ {progress.pendingCount} pending</span>
                                <span className="text-red-600">⚠ {progress.overdueCount} overdue</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {assignment.reminderEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(assignment.Id)}
                            >
                              <ApperIcon name="Bell" size={14} className="mr-1" />
                              Remind
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(assignment)}
                          >
                            <ApperIcon name="Edit" size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(assignment.Id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Assignments;
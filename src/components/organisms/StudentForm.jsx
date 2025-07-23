import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradeLevel: "",
    enrollmentDate: "",
    parentContact: "",
    status: "active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        gradeLevel: student.gradeLevel || "",
        enrollmentDate: student.enrollmentDate || "",
        parentContact: student.parentContact || "",
        status: student.status || "active"
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    if (!formData.parentContact.trim()) {
      newErrors.parentContact = "Parent contact is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const studentData = {
      ...formData,
      gradeLevel: parseInt(formData.gradeLevel)
    };

    if (student) {
      studentData.Id = student.Id;
    }

    onSubmit(studentData);
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const gradeOptions = [
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
    { value: "11", label: "Grade 11" },
    { value: "12", label: "Grade 12" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name={student ? "Edit" : "Plus"} className="mr-2" size={20} />
          {student ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              placeholder="Enter first name"
              required
              error={errors.firstName}
            />

            <FormField
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              placeholder="Enter last name"
              required
              error={errors.lastName}
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="Enter email address"
              required
              error={errors.email}
            />

            <FormField
              label="Grade Level"
              type="select"
              value={formData.gradeLevel}
              onChange={handleChange("gradeLevel")}
              options={gradeOptions}
              required
              error={errors.gradeLevel}
            />

            <FormField
              label="Enrollment Date"
              type="date"
              value={formData.enrollmentDate}
              onChange={handleChange("enrollmentDate")}
              required
              error={errors.enrollmentDate}
            />

<FormField
              label="Parent Contact"
              value={formData.parent_contact_c}
              onChange={handleChange("parent_contact_c")}
              placeholder="Enter parent phone/email"
              required
              error={errors.parent_contact_c}
            />

            <FormField
              label="Status"
              type="select"
              value={formData.status_c}
              onChange={handleChange("status_c")}
              options={statusOptions}
              required
              error={errors.status_c}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Save" className="mr-2" size={16} />
              {student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const StudentForm = ({ student, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    grade_level_c: "",
    enrollment_date_c: "",
    parent_contact_c: "",
    status_c: "active"
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        email_c: student.email_c || "",
        grade_level_c: student.grade_level_c || "",
        enrollment_date_c: student.enrollment_date_c || "",
        parent_contact_c: student.parent_contact_c || "",
        status_c: student.status_c || "active"
      });
    }
  }, [student]);

const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }

    if (!formData.grade_level_c) {
      newErrors.grade_level_c = "Grade level is required";
    }

    if (!formData.enrollment_date_c) {
      newErrors.enrollment_date_c = "Enrollment date is required";
    }

    if (!formData.parent_contact_c.trim()) {
      newErrors.parent_contact_c = "Parent contact is required";
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
      grade_level_c: parseInt(formData.grade_level_c)
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
              value={formData.first_name_c}
              onChange={handleChange("first_name_c")}
              placeholder="Enter first name"
              required
              error={errors.first_name_c}
            />

            <FormField
              label="Last Name"
              value={formData.last_name_c}
              onChange={handleChange("last_name_c")}
              placeholder="Enter last name"
              required
              error={errors.last_name_c}
            />

<FormField
              label="Email"
              type="email"
              value={formData.email_c}
              onChange={handleChange("email_c")}
              placeholder="Enter email address"
              required
              error={errors.email_c}
            />

<FormField
              label="Grade Level"
              type="select"
              value={formData.grade_level_c}
              onChange={handleChange("grade_level_c")}
              options={gradeOptions}
              required
              error={errors.grade_level_c}
            />

<FormField
              label="Enrollment Date"
              type="date"
              value={formData.enrollment_date_c}
              onChange={handleChange("enrollment_date_c")}
              required
              error={errors.enrollment_date_c}
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
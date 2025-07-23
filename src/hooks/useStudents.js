import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentService } from "@/services/api/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      toast.success("Student added successfully!");
      return newStudent;
    } catch (err) {
      toast.error(err.message || "Failed to add student");
      throw err;
    }
  };

const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentService.update(id, studentData);
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.Id === parseInt(id) ? updatedStudent : s));
        toast.success("Student updated successfully!");
      }
      return updatedStudent;
    } catch (err) {
      toast.error(err.message || "Failed to update student");
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.Id !== parseInt(id)));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete student");
      throw err;
    }
  };

  const searchStudents = async (query) => {
    if (!query.trim()) {
      loadStudents();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await studentService.search(query);
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
  };
};
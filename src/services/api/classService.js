import { toast } from "react-toastify";

export const classService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "student_ids_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(cls => ({
        ...cls,
        name: cls.Name,
        subject: cls.subject_c,
        period: cls.period_c,
        room: cls.room_c,
        studentIds: cls.student_ids_c?.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) || []
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "student_ids_c" } }
        ]
      };

      const response = await apperClient.getRecordById("class_c", id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const cls = response.data;
      return {
        ...cls,
        name: cls.Name,
        subject: cls.subject_c,
        period: cls.period_c,
        room: cls.room_c,
        studentIds: cls.student_ids_c?.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) || []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get all students to map IDs to picklist indices
      const students = await this.getAll(); // This will get students for mapping
      
      // Map student IDs to picklist values (1-8 based on schema)
      let studentPicklistValues = "";
      if (classData.studentIds && classData.studentIds.length > 0) {
        const mappedValues = classData.studentIds
          .map(id => {
            const studentIndex = students.findIndex(s => s.Id === id);
            return studentIndex >= 0 ? (studentIndex + 1).toString() : null;
          })
          .filter(value => value !== null && parseInt(value) <= 8);
        studentPicklistValues = mappedValues.join(',');
      }

      const params = {
        records: [{
          Name: classData.name,
          subject_c: classData.subject,
          period_c: classData.period,
          room_c: classData.room,
          student_ids_c: studentPicklistValues
        }]
      };

      const response = await apperClient.createRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create classes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

async update(id, classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get all students to map IDs to picklist indices
      const students = await this.getAll(); // This will get students for mapping
      
      // Map student IDs to picklist values (1-8 based on schema)
      let studentPicklistValues = "";
      if (classData.studentIds && classData.studentIds.length > 0) {
        const mappedValues = classData.studentIds
          .map(id => {
            const studentIndex = students.findIndex(s => s.Id === id);
            return studentIndex >= 0 ? (studentIndex + 1).toString() : null;
          })
          .filter(value => value !== null && parseInt(value) <= 8);
        studentPicklistValues = mappedValues.join(',');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: classData.name,
          subject_c: classData.subject,
          period_c: classData.period,
          room_c: classData.room,
          student_ids_c: studentPicklistValues
        }]
      };

      const response = await apperClient.updateRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update classes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete classes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  }
};
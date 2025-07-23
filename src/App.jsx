import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import Classes from "@/components/pages/Classes";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import Assignments from "@/components/pages/Assignments";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
<Routes>
            <Route path="/" element={<Dashboard onMenuClick={handleMenuClick} />} />
            <Route path="/students" element={<Students onMenuClick={handleMenuClick} />} />
            <Route path="/classes" element={<Classes onMenuClick={handleMenuClick} />} />
            <Route path="/grades" element={<Grades onMenuClick={handleMenuClick} />} />
            <Route path="/attendance" element={<Attendance onMenuClick={handleMenuClick} />} />
            <Route path="/assignments" element={<Assignments onMenuClick={handleMenuClick} />} />
          </Routes>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
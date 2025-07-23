import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/students", label: "Students", icon: "Users" },
    { path: "/classes", label: "Classes", icon: "BookOpen" },
    { path: "/grades", label: "Grades", icon: "FileText" },
    { path: "/attendance", label: "Attendance", icon: "Calendar" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-2 mr-3">
            <ApperIcon name="GraduationCap" className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl gradient-text">Scholar Hub</h1>
            <p className="text-sm text-gray-500">Student Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Shield" size={16} className="mr-2" />
          <span>Academic Year 2024</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 w-64 h-screen z-50"
          >
            <SidebarContent />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;
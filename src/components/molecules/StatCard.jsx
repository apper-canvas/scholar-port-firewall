import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    success: "text-success-600 bg-success-50",
    warning: "text-warning-600 bg-warning-50",
    error: "text-error-600 bg-error-50"
  };

  const trendColors = {
    up: "text-success-600",
    down: "text-error-600",
    neutral: "text-gray-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              {trend && (
                <div className="flex items-center mt-2">
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                    className={`${trendColors[trend]} mr-1`} 
                    size={16} 
                  />
                  <span className={`text-sm font-medium ${trendColors[trend]}`}>
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <ApperIcon name={icon} size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
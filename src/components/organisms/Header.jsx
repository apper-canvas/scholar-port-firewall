import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuClick, searchValue, onSearchChange, searchPlaceholder, actions }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="lg:hidden mr-2 p-2"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {searchValue !== undefined && onSearchChange && (
            <div className="hidden md:block">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="w-80"
              />
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="p-2">
              <ApperIcon name="Bell" size={20} />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {searchValue !== undefined && onSearchChange && (
        <div className="md:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
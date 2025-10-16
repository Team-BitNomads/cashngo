import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const activeLinkStyle = {
    borderBottom: '2px solid #10B981',
    color: '#10B981'
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">CashnGo</h1>
        <div className="flex space-x-6">
          <NavLink 
            to="/dashboard" // <-- Link to the dashboard root
            end // <-- `end` prop ensures it's only active on the exact path
            className="text-gray-600 hover:text-green-600 font-medium"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Gigs
          </NavLink>
          <NavLink 
            to="/dashboard/profile" // <-- Link to the profile page
            className="text-gray-600 hover:text-green-600 font-medium"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img src={logo} alt="Logo" width="50" height="50" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-red hover:border-red text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/scenarios/oxygenation" 
                className="border-transparent text-gray-500 hover:border-red hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Oxygenation
              </Link>
              <Link 
                to="/scenarios/hemodynamics" 
                className="border-transparent text-gray-500 hover:border-red hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Hemodynamics
              </Link>
              <Link 
                to="/scenarios/cardiovascular" 
                className="border-transparent text-gray-500 hover:border-red hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Cardiovascular
              </Link>
              <Link 
                to="/scenarios/ecmoparameters" 
                className="border-transparent text-gray-500 hover:border-red hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                ECMO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let timer = null;

  const handleMouseEnter = () => {
    if (timer) clearTimeout(timer);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src={logo} alt="Logo" width="50" height="50" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-red text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>

              <div
                className="relative flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Scenarios
                </a>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link to="/Scenarios/acute-heart-failure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Acute Heart Failure
                      </Link>
                      <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Chronic Heart Failure
                      </Link>
                      <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Cardiogenic Shock
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link to="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Simulations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../images/logo.svg';

// const NavBar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   let timer = null;

//   // Open the dropdown on hover
//   const handleMouseEnter = () => {
//     if (timer) clearTimeout(timer);
//     setIsDropdownOpen(true);
//   };

//   // Close the dropdown with a small delay to allow user to move the mouse
//   const handleMouseLeave = () => {
//     timer = setTimeout(() => {
//       setIsDropdownOpen(false);
//     }, 200); // Adjust the delay to a small time period, e.g., 200ms
//   };

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <img src={logo} alt="Logo" width="50" height="50" />
//             </div>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               <Link to="/" className="border-red text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                 Dashboard
//               </Link>

//               <div
//                 className="relative flex items-center"
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                   Scenarios
//                 </a>
//                 {isDropdownOpen && (
//                   <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
//                     <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//                       <Link to="/Scenarios/acute-heart-failure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                         Acute Heart Failure
//                       </Link>
//                       <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                         Chronic Heart Failure
//                       </Link>
//                       <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                         Cardiogenic Shock
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Link to="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                 Simulations
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

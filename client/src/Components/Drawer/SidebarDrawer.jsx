import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for open/close
import logo from "../Images/logo.png";
import { useNavigate } from "react-router-dom";



const SidebarDrawer = () => {
  const [isOpen, setIsOpen] = useState(false); // Set open initially for demo
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-3.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex flex-row items-center lg:flex-1">
            <div onClick={()=>navigate('/')} className="cursor-pointer -m-1.5 flex items-center">
              <img className="h-12  w-auto" src={logo} alt="" />
              <span className="text-2xl font-semibold text-gray-900 -ml-1">
                EchoAI
              </span>
            </div>
          </div>
          <button
            onClick={toggleDrawer}
            className="focus:outline-none text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col space-y-3 px-4">
            <button onClick={()=>navigate('/')} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">
              Home
            </button>
            <button onClick={()=>navigate('/EvalutionTest')} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
              Evaluation Test
            </button>
            <button onClick={()=>navigate('/Admin')} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleDrawer}
          className="fixed left-0 top-1/2 transform  -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white -ml-2 w-10 h-16 flex items-center justify-center rounded-r-lg shadow-lg"
        >
          <FaBars className="lg:h-6" />
        </button>
      )}
    </div>
  );
};

export default SidebarDrawer;

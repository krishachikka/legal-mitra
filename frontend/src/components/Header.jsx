import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import logo from '../../public/assets/legalmitra_white.png';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../utils/auth';

const Header = ({ setHeaderHeight, user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const headerRef = useRef(null); // Ref for header element

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [setHeaderHeight]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false); // Close the drawer when navigating
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call your logout function (should clear the auth state)
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header ref={headerRef} className="bg-red-900 text-white p-2 flex justify-between mx-auto items-center fixed top-0 left-0 w-full z-50">
      <IconButton
        sx={{ color: 'white' }}
        onClick={toggleDrawer(!open)} // Toggle drawer open/close
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-row items-center space-x-4 justify-around">
          <img src={logo} className="w-16 h-auto" alt="LegalMitra Logo" />
          <h1 className="text-2xl font-bold">LEGAL MITRA</h1>
        </div>
        <nav>
          <div className="flex space-x-6">
            <button
              onClick={() => handleNavigation('/')}
              className="hover:text-gray-300 py-2 px-4 rounded-3xl bg-transparent border-none text-white cursor-pointer hover:bg-gray-800 transform hover:scale-110 transition ease-in-out duration-300"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className="hover:text-gray-300 py-2 px-4 rounded-3xl bg-transparent border-none text-white cursor-pointer hover:bg-gray-800 transform hover:scale-110 transition ease-in-out duration-300"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation('/services')}
              className="hover:text-gray-300 py-2 px-4 rounded-3xl bg-transparent border-none text-white cursor-pointer hover:bg-gray-800 transform hover:scale-110 transition ease-in-out duration-300"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="hover:text-gray-300 py-2 px-4 rounded-3xl bg-transparent border-none text-white cursor-pointer hover:bg-gray-800 transform hover:scale-110 transition ease-in-out duration-300"
            >
              Contact
            </button>
          </div>
        </nav>

        {/* Conditionally render logout button */}
        {user && (
          <button
            onClick={handleLogout}
            className="ml-6 bg-white text-red-900 py-2 px-4 rounded-3xl hover:bg-gray-200 transition ease-in-out duration-300"
          >
            Logout
          </button>
        )}
      </div>

      <SideDrawer open={open} toggleDrawer={toggleDrawer}/>
    </header>
  );
};

export default Header;

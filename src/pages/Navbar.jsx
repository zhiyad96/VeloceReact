


import React, { useState, useRef, useEffect, useContext } from 'react';
import logo from "../assets/logo.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Authcontext } from '../Context/Authcontext';
import { Cartcontext } from '../Context/Cartcontext';
import { Wishcontext } from '../Context/Wishlistcontext';

export default function Navbar() {
  const { user, logout } = useContext(Authcontext);
  const { cart } = useContext(Cartcontext);
  const { wishlength } = useContext(Wishcontext);
// --------------------------for dropdown------------------
  const [open, setOpen] = useState(false); 
  // ------------------------formobilemenu------------------------
  const [mobileMenu, setMobileMenu] = useState(false); 
  const menuRef = useRef();
  const navigate = useNavigate();

  // --------------------------when click the outside menu------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------cartquantity--------------------
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className='shadow-lg border-b px-6 py-4 fixed w-full z-50 backdrop-blur-sm bg-white'>
        <div className='container mx-auto flex justify-between items-center'>
          
          <Link to="/" className='flex items-center space-x-3'>
            <img src={logo} alt='logo' className='w-12 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300' />
            <span className='text-xl font-bold text-black hidden sm:block'>Veloce Garage</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-black">
            <Link to="/" className='font-medium hover:text-black transition-colors duration-200 relative py-2'>Home</Link>
            <Link to="/About" className='font-medium hover:text-black transition-colors duration-200 relative py-2'>About</Link>
            <Link to="/Product" className='font-medium hover:text-black transition-colors duration-200 relative py-2'>Shop</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <FaRegHeart size={22} className='text-black transition-colors duration-200' />
              <span className="absolute -top-1 -right-2 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlength}
              </span>
            </Link>

            {/* Cart */}
            <Link to="/Cart" className="relative">
              <FaShoppingCart size={22} className='text-black transition-colors duration-200' />
              <span className="absolute -top-1 -right-2 bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {quantity}
              </span>
            </Link>

            {/* Profile dropdown */}
            <div className="relative inline-block" ref={menuRef}>
              <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 p-2 rounded-lg border border-transparent transition-all duration-200">
                {user ? (
                  <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-gradient-to-r from-black to-white rounded-full flex items-center justify-center text-black text-sm font-medium'>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-black font-medium hidden sm:block'>{user.name}</span>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center space-x-2">
                    <CgProfile size={20} className='text-gray-600' />
                    <span className='text-gray-700 font-medium'>Login</span>
                  </Link>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-black rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm">
                  <div className="p-2">
                    {user ? (
                      <>
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-white hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 font-medium">Sign Out</button>
                        <button onClick={() => navigate("/OrederHistory")} className="w-full text-left px-4 py-3 text-white hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 font-medium">Order History</button>
                      </>
                    ) : (
                      <button onClick={() => navigate("/OrederHistory")} className="w-full text-left px-4 py-3 text-white hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 font-medium">Order History</button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white w-full mt-2 rounded-lg shadow-lg p-4 space-y-3">
            <Link to="/" className='block font-medium py-2'>Home</Link>
            <Link to="/About" className='block font-medium py-2'>About</Link>
            <Link to="/Product" className='block font-medium py-2'>Shop</Link>
          </div>
        )}
      </nav>
    </>
  );
}

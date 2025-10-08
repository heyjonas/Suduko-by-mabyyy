import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaTrophy, FaSignInAlt, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { SessionContext } from '../context/SessionContext';
import { supabase } from '../supabaseClient';

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { session, profile } = useContext(SessionContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { label: 'Home', path: '/', icon: <FaHome /> },
    { label: 'Friends', path: '/friends', icon: <FaUsers /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> }
  ];

  const visibleItems = menuItems.filter(item => item.path !== currentPath);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-yellow-100 border-t border-yellow-300 shadow-md z-50">
      <div className="flex justify-around items-center py-2 text-xs font-medium text-yellow-800 relative">
        {visibleItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center hover:text-yellow-600 transition-colors duration-200"
          >
            <div className="text-xl">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
        {session ? (
          <div className="relative flex flex-col items-center" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex flex-col items-center focus:outline-none"
            >
              <FaUser className="text-xl mb-1" />
              <span className="text-xs font-semibold">{profile?.username || 'User'}</span>
            </button>
            <div
              className={`absolute bottom-12 mb-2 bg-white border border-yellow-300 rounded shadow-lg p-2 text-sm w-36 text-center z-50 transition-all duration-300 ${
                showDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <Link
                to="/profile"
                className="flex items-center justify-center gap-1 text-yellow-800 hover:text-yellow-600 mb-2"
                onClick={() => setShowDropdown(false)}
              >
                <FaCog />
                <span>Profile Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex flex-col items-center hover:text-blue-600 transition-colors duration-200"
          >
            <div className="text-xl"><FaSignInAlt /></div>
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
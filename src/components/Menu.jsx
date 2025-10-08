import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaUser, FaUsers, FaTrophy } from 'react-icons/fa'

export default function Menu() {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    { label: 'Home', path: '/', icon: <FaHome /> },
    { label: 'Profile', path: '/profile', icon: <FaUser /> },
    { label: 'Friends', path: '/friends', icon: <FaUsers /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> }
  ]

  const visibleItems = menuItems.filter(item => item.path !== currentPath)

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md z-50">
      <div className="flex justify-around py-2 text-xs font-medium text-gray-700">
        {visibleItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center hover:text-blue-600 transition-colors duration-200"
          >
            <div className="text-xl">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
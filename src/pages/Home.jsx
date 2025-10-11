import React from 'react'
import { useNavigate } from 'react-router-dom'
import usePWAInstallPrompt from '../hooks/usePWAInstallPrompt'

const Home = () => {
  const navigate = useNavigate()
  const { isInstallable, promptInstall } = usePWAInstallPrompt()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-amber-600 text-center">🧠 Sudoku by Mabyyy</h1>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/difficulty')}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Play Sudoku
        </button>
        <button
          onClick={() => navigate('/friends')}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          Friends List
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600"
        >
          Profile Settings
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600"
        >
          Leaderboard
        </button>
        {isInstallable && (
          <button onClick={promptInstall} className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900">
            📲 Install App
          </button>
        )}
      </div>
    </div>
  )
}

export default Home

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../context/SessionContext';

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const navigate = useNavigate()
  const { session } = React.useContext(SessionContext)

    useEffect(() => {
    if (session && location.pathname === '/signup') {
      navigate('/game') // redirect to game if already authenticated
    }  
    }, [session])

  const DEFAULT_AVATAR = 'https://via.placeholder.com/100'

  const validateUsername = (name) => {
    const trimmed = name.trim()
    return /^[a-zA-Z0-9_]{3,20}$/.test(trimmed)
  }

  const checkUsernameExists = async (name) => {
    if (!validateUsername(name)) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', name)
      .single()

    setUsernameAvailable(data === null)
    setCheckingUsername(false)
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if (username) checkUsernameExists(username)
    }, 500) // debounce

    return () => clearTimeout(delay)
  }, [username])

  const handleSignup = async () => {
    if (!validateUsername(username)) {
      alert('Username must be 3–20 characters long and contain only letters, numbers, or underscores.')
      return
    }

    if (usernameAvailable === false) {
      alert('Username is already taken. Please choose another one.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar_url: avatarUrl || DEFAULT_AVATAR
        }
      }
    })

    if (error) {
      alert('Signup failed: ' + error.message)
    } else {
      alert('Signup successful!')
      navigate('/game')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Preferred Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-2 py-1 mb-1 w-full"
      />
      {username && (
        <p className="text-sm mb-2">
          {checkingUsername
            ? 'Checking availability...'
            : usernameAvailable === null
            ? ''
            : usernameAvailable
            ? '✅ Username is available'
            : '❌ Username is taken'}
        </p>
      )}
      <input
        type="text"
        placeholder="Avatar URL (optional)"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />
      <button
        onClick={handleSignup}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Sign Up
      </button>
    </div>
  )
}

export default Signup
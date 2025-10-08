import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/'); // Redirect to home if already logged in
      }
    });

    // Listen for auth changes (optional but useful)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/'); // Redirect after login
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://sudoku-by-mabyyy.vercel.app/auth/callback' // Your Vercel domain
      }
    });

    if (error) {
      console.error('Login error:', error.message);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Sudoku</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleEmailAuth = async () => {
    setFeedback('');
    setSuccess(false);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://sudoku-by-mabyyy.vercel.app/auth/callback'
        }
      });

      if (error) {
        setFeedback('Sign-up failed: ' + error.message);
      } else {
        setFeedback(`Verification email sent to ${email}. Please check your inbox.`);
        setSuccess(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setFeedback('Login failed: ' + error.message);
      } else {
        setFeedback('Login successful!');
        setSuccess(true);
      }
    }
  };

  const handleResendVerification = async () => {
    setFeedback('');
    setSuccess(false);
    setCooldown(30);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://sudoku-by-mabyyy.vercel.app/auth/callback'
      }
    });

    if (error) {
      setFeedback('Resend failed: ' + error.message);
    } else {
      setFeedback(`Verification email resent to ${email}.`);
      setSuccess(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 font-sans">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          {isSignUp ? 'Create Account' : 'Welcome to Sudoku'}
        </h1>
        {feedback && (
          <div className={`mb-4 text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleEmailAuth}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition mb-3"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        {isSignUp && (
          <button
            onClick={handleResendVerification}
            disabled={cooldown > 0}
            className={`w-full py-2 rounded transition mb-3 ${
              cooldown > 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </button>
        )}
        <p className="text-sm text-gray-600 mb-2">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFeedback('');
              setSuccess(false);
            }}
            className="ml-2 text-purple-600 underline"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

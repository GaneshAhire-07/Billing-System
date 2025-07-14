import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'emp001' && password === 'emp123') {
      localStorage.setItem('loginAs', 'employee');
      localStorage.setItem('loginId', 'employee');
      setError('');
      alert('Login successful! Redirecting to employee dashboard...');
      navigate('/employee');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-md hover:shadow-lg transition-all">
        <div className="text-center mb-4">
          <i className="bi bi-person-circle text-4xl text-indigo-600 animate-pulse"></i>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              className="w-full rounded-md p-2.5 border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full rounded-md p-2.5 border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-300 rounded-md p-2 text-sm mb-3">{error}</div>
          )}
          <div className="text-right mb-3">
            <a href="#" className="text-purple-600 hover:underline text-xs">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md py-2.5 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1 transition-all"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;

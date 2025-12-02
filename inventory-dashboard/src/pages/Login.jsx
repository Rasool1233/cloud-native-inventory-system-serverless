import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { login, isAuthenticated, loading: authLoading } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  // Demo login shortcut
  const handleDemoLogin = async () => {
    setUsername('demo');
    setPassword('demo');
    setError('');
    setLoading(true);
    const result = await login('demo', 'demo');
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Dashboard</h1>
          <p className="text-gray-600">AWS Cloud Demo - Sign in to continue</p>
          {isDemoMode && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Demo Mode Active
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
                disabled={loading || authLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
                disabled={loading || authLoading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || authLoading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {isDemoMode && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleDemoLogin}
                className="w-full py-2 px-4 border border-primary-300 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors font-medium"
                disabled={loading || authLoading}
              >
                Quick Demo Login
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a demo application for AWS hands-on practice.
              <br />
              {isDemoMode ? 'Demo mode is enabled - any credentials will work.' : 'Configure AWS Cognito in Settings.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

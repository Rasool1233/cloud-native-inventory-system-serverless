import React from 'react';
import { useUser } from '../context/UserContext';

const Settings = () => {
  const { user } = useUser();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application configuration</p>
      </div>

      {/* User Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-gray-900">{user?.username || 'Not available'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email || 'Not available'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Authentication Mode</label>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {isDemoMode ? 'Demo Mode' : 'AWS Cognito'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* AWS Configuration */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AWS Amplify / Cognito Configuration</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  To configure AWS Cognito authentication, update your <code className="bg-blue-100 px-1 rounded">.env</code> file with the following values:
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">AWS Region</label>
              <code className="mt-1 block p-3 bg-gray-100 rounded text-sm text-gray-900">
                VITE_AWS_REGION={import.meta.env.VITE_AWS_REGION || 'us-east-1'}
              </code>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cognito User Pool ID</label>
              <code className="mt-1 block p-3 bg-gray-100 rounded text-sm text-gray-900">
                VITE_COGNITO_USER_POOL_ID={import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX'}
              </code>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cognito App Client ID</label>
              <code className="mt-1 block p-3 bg-gray-100 rounded text-sm text-gray-900">
                VITE_COGNITO_APP_CLIENT_ID={import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx'}
              </code>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">How to get these values:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Log in to the AWS Management Console</li>
              <li>Navigate to Amazon Cognito service</li>
              <li>Select your User Pool (or create a new one)</li>
              <li>Copy the User Pool ID from the pool overview</li>
              <li>Go to "App integration" → "App clients" and copy the Client ID</li>
              <li>Update your <code className="bg-gray-200 px-1 rounded">.env</code> file with these values</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">API Base URL</label>
            <code className="mt-1 block p-3 bg-gray-100 rounded text-sm text-gray-900">
              VITE_REACT_APP_API_BASE={
                import.meta.env.VITE_REACT_APP_API_BASE || 'https://api.example.com'
              }
            </code>
          </div>
          <p className="text-sm text-gray-600">
            Update this value to point to your actual backend API endpoint. The current value is a placeholder for demonstration purposes.
          </p>
        </div>
      </div>

      {/* Deployment */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deploy to AWS Amplify</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Follow these steps to deploy this application to AWS Amplify:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-2">
            <li>Push your code to a Git repository (GitHub, GitLab, or Bitbucket)</li>
            <li>Log in to the AWS Amplify Console</li>
            <li>Click "New app" → "Host web app"</li>
            <li>Connect your Git repository</li>
            <li>Configure build settings (Amplify will auto-detect Vite)</li>
            <li>Add environment variables in the Amplify Console</li>
            <li>Deploy your application</li>
          </ol>
          <a
            href="https://docs.amplify.aws/guides/hosting/git-based-deployments/q/platform/js/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Amplify Deployment Guide
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;

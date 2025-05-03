'use client';

import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="mt-1 text-sm text-gray-500">Here's what's happening with your account.</p>
              </div>
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            {/* Credits Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Available Credits</h2>
              <div className="flex items-baseline">
                <p className="text-4xl font-bold text-indigo-600">{user.credits}</p>
                <span className="ml-2 text-gray-500">credits</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use your credits to generate AI content
              </p>
            </div>
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Account Created</p>
                    <p className="text-sm text-gray-500">Welcome to AI Writing Assistant!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Upcoming Features */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Content Generation</h3>
                <p className="mt-1 text-sm text-gray-500">Generate high-quality content with AI</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Content History</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage your generated content</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Credit Purchase</h3>
                <p className="mt-1 text-sm text-gray-500">Buy more credits to continue generating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
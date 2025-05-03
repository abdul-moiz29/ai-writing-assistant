'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { validateLoginForm, ValidationError } from '../../utils/validation';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.debug('[Login] useEffect - user:', user);
    if (user) {
      console.debug('[Login] User is logged in, navigating to /dashboard', user);
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    console.debug('[Login] Page mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setApiError('');
    setLoading(true);

    // Validate form
    const validationResult = validateLoginForm(email, password);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      if (error.response) {
        // Handle specific API errors
        switch (error.response.status) {
          case 401:
            setApiError('Invalid email or password');
            break;
          case 404:
            setApiError('User not found');
            break;
          case 500:
            setApiError('Server error. Please try again later');
            break;
          default:
            setApiError('An error occurred. Please try again');
        }
      } else {
        setApiError('Network error. Please check your connection');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(apiError || errors.length > 0) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {apiError || errors[0].message}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  getFieldError('password') ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-sm text-center">
            <a
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 
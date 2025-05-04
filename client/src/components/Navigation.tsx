'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                AI Writing Assistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          {/* User Info, Credits, and Purchase Button */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-blue-700 text-base">{user.credits} Credits</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                Purchase Credits
              </button>
              <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 group cursor-pointer focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base group-hover:bg-blue-400 transition">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-base font-medium text-gray-700 group-hover:text-blue-700 transition">{user.name}</span>
                  <svg className="w-4 h-4 text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-t-lg transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </a>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-b-lg transition"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* End User Info */}
          {!user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 
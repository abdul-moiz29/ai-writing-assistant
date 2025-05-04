'use client';

import React from 'react';
import TextGeneration from '../../components/TextGeneration';
import { useAuth } from '../../context/AuthContext';
import { redirect } from 'next/navigation';

export default function GeneratePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <TextGeneration />
    </div>
  );
} 
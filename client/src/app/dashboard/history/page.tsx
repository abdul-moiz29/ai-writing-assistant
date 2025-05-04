'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';

interface Generation {
  _id: string;
  prompt: string;
  result: string;
  wordLimit?: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/ai/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setGenerations(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Content History</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content generated yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start generating content to see it here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {generations.map((generation) => (
              <div key={generation._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {new Date(generation.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {generation.wordLimit && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                      {generation.wordLimit} words
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prompt</h3>
                    <p className="mt-1 text-gray-900">{generation.prompt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Generated Content</h3>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{generation.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 
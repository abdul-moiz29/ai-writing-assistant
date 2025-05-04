'use client';

import { CreditPackages } from '@/components/CreditPackages';
import { Chat } from '@/components/Chat';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get('payment');
  const [activeTab, setActiveTab] = useState<'chat' | 'credits'>('chat');

  useEffect(() => {
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Credits have been added to your account.');
    } else if (paymentStatus === 'cancel') {
      toast.error('Payment cancelled. Please try again if you wish to purchase credits.');
    }
  }, [paymentStatus]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'credits'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Purchase Credits
            </button>
          </div>
                </div>
              </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <Chat />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Purchase Credits</h2>
              <CreditPackages />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
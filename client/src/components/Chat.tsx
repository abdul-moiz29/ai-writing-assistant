'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Generation {
  _id: string;
  prompt: string;
  result: string;
  wordLimit?: number;
  createdAt: string;
}

export function Chat() {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordLimit, setWordLimit] = useState<number | ''>('');
  const [history, setHistory] = useState<Generation[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<Generation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState<number>(user?.credits || 0);

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/ai/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.generations || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update credits when user changes
  useEffect(() => {
    setCredits(user?.credits || 0);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (credits <= 0) {
      toast.error('You have no credits left. Please purchase more credits to continue.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
    ]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: userMessage,
          wordLimit: wordLimit || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.result, timestamp: new Date().toISOString() },
      ]);
      setCredits(data.remainingCredits);
      if (setUser) setUser((u: any) => ({ ...u, credits: data.remainingCredits }));

      // Refetch history
      const res = await fetch('http://localhost:5000/api/ai/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const hist = await res.json();
        setHistory(hist.generations || []);
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast.error('Failed to generate content. Please try again.');
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error while generating your content. Please try again.' 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (gen: Generation) => {
    setSelectedHistory(gen);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedHistory(null);
  };

  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/ai/history/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
      setSelectedHistory(null);
      toast.success('History cleared successfully');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white/80 border-r border-gray-200 flex flex-col shadow-lg h-full">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-700">History</span>
          <button
            onClick={handleClearHistory}
            className="text-xs text-red-500 hover:underline"
            title="Clear all history"
          >
            Clear
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">No history yet</div>
          ) : (
            history.map((gen) => (
              <div
                key={gen._id}
                className={`cursor-pointer rounded-lg px-3 py-2 transition border hover:bg-blue-50 ${
                  selectedHistory?._id === gen._id ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"
                }`}
                onClick={() => handleHistoryClick(gen)}
                title={gen.prompt}
              >
                <div className="truncate text-sm font-medium text-gray-700">{gen.prompt}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(gen.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleNewChat}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            New Chat
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        

        {/* Chat/Content Area */}
        <div className="flex-1 flex flex-col justify-between bg-gradient-to-br from-white to-blue-50 overflow-hidden">
          {selectedHistory ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
              <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Prompt</div>
                  <div className="font-semibold text-gray-800 mb-2">{selectedHistory.prompt}</div>
                  <div className="text-xs text-gray-400 mb-1 mt-4">Generated Content</div>
                  <div className="whitespace-pre-wrap text-gray-700 bg-blue-50 rounded p-4 mt-1">
                    {selectedHistory.result}
                  </div>
                  {selectedHistory.wordLimit && (
                    <div className="mt-4 text-xs text-blue-600">Word Limit: {selectedHistory.wordLimit}</div>
                  )}
                  <div className="mt-4 text-xs text-gray-400">{new Date(selectedHistory.createdAt).toLocaleString()}</div>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setSelectedHistory(null)}
                >
                  Back to Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to AI Writing Assistant</h2>
                    <p className="text-gray-600 mb-8">Start a conversation by typing your message below</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-6 py-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                            : 'bg-white text-gray-800 border border-blue-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-base">{message.content}</p>
                        <div className="text-xs text-gray-400 mt-2 text-right">
                          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-blue-100 rounded-2xl px-6 py-4 shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input Area */}
              <div className="bg-white/90 border-t border-blue-100 px-8 py-4 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex space-x-4 items-center max-w-3xl mx-auto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value ? parseInt(e.target.value) : "")}
                    placeholder="Word limit"
                    className="w-32 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
                    min="1"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`px-8 py-3 rounded-2xl font-semibold text-lg shadow transition-all duration-200 ${
                      isLoading || !input.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                    }`}
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 
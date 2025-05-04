"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white flex items-center space-x-3 ${type === "success" ? "bg-green-600" : "bg-red-500"}`}
      style={{ animation: "fadeIn 0.3s" }}>
      <span>{type === "success" ? "✓" : "!"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white text-lg font-bold">×</button>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: none; }}`}</style>
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [credits] = useState(user?.credits || 0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showFloatingToast = (msg: string, type: "success" | "error") => {
    setToastType(type);
    setSuccess(type === "success" ? msg : "");
    setError(type === "error" ? msg : "");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name.trim()) {
      showFloatingToast("Name is required", "error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFloatingToast(data.error || "Failed to update name", "error");
      } else {
        showFloatingToast("Name updated successfully!", "success");
        if (setUser) setUser((u: any) => ({ ...u, name: data.name }));
      }
    } catch (err) {
      showFloatingToast("Failed to update name", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!newPassword || newPassword.length < 6) {
      showFloatingToast("New password must be at least 6 characters", "error");
      return;
    }
    if (!currentPassword) {
      showFloatingToast("Current password is required to change password", "error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFloatingToast(data.error || "Failed to update password", "error");
      } else {
        showFloatingToast("Password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      showFloatingToast("Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12">
      {showToast && (
        <Toast
          message={success || error}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-10 animate-fadeIn">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">Profile Settings</h2>
        {/* User Summary Card */}
        <div className="flex items-center space-x-6 mb-10 p-6 rounded-xl bg-blue-50 border border-blue-100 shadow">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse-slow"></div>
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-3xl relative z-10">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-lg font-semibold text-gray-800">{user?.name}</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
              <span className="text-gray-500">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-blue-700 font-medium">{user?.credits} Credits</span>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />
        {/* Change Name Section */}
        <form onSubmit={handleNameChange} className="mb-10 space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Change Name</span>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
            required
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-base shadow transition-all duration-200 ${
              loading || name === user?.name
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
            }`}
            disabled={loading || name === user?.name}
          >
            {loading ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"></span> : "Update Name"}
          </button>
        </form>
        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />
        {/* Change Password Section */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            <span>Change Password</span>
          </div>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Current password"
            disabled={loading}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="New password (min 6 chars)"
            disabled={loading}
            minLength={6}
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-base shadow transition-all duration-200 ${
              loading || !currentPassword || !newPassword
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
            }`}
            disabled={loading || !currentPassword || !newPassword}
          >
            {loading ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"></span> : "Update Password"}
          </button>
        </form>
      </div>
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-pulse-slow { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
} 
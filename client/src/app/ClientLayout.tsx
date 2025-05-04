'use client';

import { AuthProvider } from "../context/AuthContext";
import Navigation from '../components/Navigation';

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-400 flex-shrink-0">
      © {new Date().getFullYear()} AI Writing Assistant. All rights reserved.
    </footer>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
} 
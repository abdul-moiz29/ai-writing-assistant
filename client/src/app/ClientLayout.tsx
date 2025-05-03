'use client';

import { AuthProvider } from "../context/AuthContext";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </AuthProvider>
  );
} 
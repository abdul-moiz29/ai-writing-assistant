import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Writing Assistant",
  description: "A SaaS-style AI Writing Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

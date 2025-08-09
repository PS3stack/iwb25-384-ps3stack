import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '../components/layout/sidebar';
import { Header } from '../components/layout/header';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Election Management System',
  description: 'Comprehensive election management and monitoring system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/survey-core/defaultV2.min.css" 
        />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
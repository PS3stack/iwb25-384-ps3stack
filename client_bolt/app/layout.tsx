import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import { TenantProvider } from '@/context/tenant-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SP3 Vote Core - Election & Census System',
  description: 'Multi-tenant election and census management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TenantProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
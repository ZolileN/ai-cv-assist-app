import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'TalentSignal - AI Career Positioning Intelligence',
  description: 'Connect candidates with recruiters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

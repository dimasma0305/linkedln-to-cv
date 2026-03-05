import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkedIn to CV Converter',
  description: 'Convert your LinkedIn data export into a professional CV',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 
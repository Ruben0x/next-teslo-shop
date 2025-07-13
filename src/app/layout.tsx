import type { Metadata } from 'next';
import './globals.css';
import { geistMono, geistSans, monserratAlternative } from '@/config';

export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop'
  },
  description: 'Una tienda virtual de productos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monserratAlternative.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

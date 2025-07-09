import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans, monserratAlternative } from "@/config";



export const metadata: Metadata = {
  title: "Teslo | Shop",
  description: "Una tienda virtual de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monserratAlternative} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

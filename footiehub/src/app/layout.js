import { Geist, Geist_Mono } from "next/font/google";
import Header from '../app/components/Header';
import Sidebar from '../app/components/Sidebar';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FootieHub",
  description: "To prove who's the best",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className ="flex flex-1">
            <Sidebar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

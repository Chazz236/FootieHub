import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'FootieHub',
  description: 'Soccer Statistics and Analysis Hub',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`font-sans antialiased`}
      >
        <div className='flex flex-col min-h-screen'>
          <Header />
          <div className='flex flex-1'>
            <Sidebar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
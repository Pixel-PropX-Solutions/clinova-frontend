import { AuthProvider } from '@/context/auth';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import ClinovaThemeProvider from '@/providers/theme-provider';
import './globals.css';

const inter = Inter({
   subsets: ['latin'],
   variable: '--font-inter',
});

export const metadata: Metadata = {
   title: 'Clinova | Smart Clinic Management',
   description:
      'Clinova is a premium clinic management platform designed for modern healthcare professionals.',
};

import QueryProvider from '@/providers/query-provider';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang='en'>
         <body className={`${inter.variable} antialiased`}>
            <ClinovaThemeProvider>
               <div className='orbit-bg'>
                  <div className='orbit-circle orbit-1' />
                  <div className='orbit-circle orbit-2' />
               </div>
               <ToastContainer
                  position='bottom-right'
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme='light'
               />
               <QueryProvider>
                  <AuthProvider>{children}</AuthProvider>
               </QueryProvider>
            </ClinovaThemeProvider>
         </body>
      </html>
   );
}

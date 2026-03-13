import { AuthProvider } from '@/context/auth';
import { Container } from '@mui/material';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ToastContainer } from 'react-toastify';

const geistSans = localFont({
   src: './fonts/GeistVF.woff',
   variable: '--font-geist-sans',
   weight: '100 900',
});
const geistMono = localFont({
   src: './fonts/GeistMonoVF.woff',
   variable: '--font-geist-mono',
   weight: '100 900',
});

export const metadata: Metadata = {
   title: "OMKARY'S CLINIC",
   description:
      "OMKARY'S CLINIC is a simple application that provides a simple solution to the problem of creating and managing your applications with a variety of  technologies ",
};

import QueryProvider from '@/providers/query-provider';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang='en'>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div>
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
            </div>
         </body>
      </html>
   );
}

import { AuthProvider } from '@/context/auth';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import ClinovaThemeProvider from '@/providers/theme-provider';
import './globals.css';
import localFont from 'next/font/local';
import QueryProvider from '@/providers/query-provider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = localFont({
   src: [
      {
         path: './fonts/Inter.ttf',
         style: 'normal',
         weight: '100 900',
      },
      {
         path: './fonts/Inter_Italics.ttf',
         style: 'italic',
         weight: '100 900',
      },
   ],
   variable: '--font-inter',
   display: 'swap',
});

const ibmPlexSans = localFont({
   src: [
      {
         path: './fonts/IBM_Plex_Sans.ttf',
         style: 'normal',
         weight: '100 900',
      },
      {
         path: './fonts/IBM_Plex_Sans_Italics.ttf',
         style: 'italic',
         weight: '100 900',
      },
   ],
   variable: '--font-plex',
   display: 'swap',
});

const sora = localFont({
   src: './fonts/Sora.ttf',
   variable: '--font-sora',
   display: 'swap',
});

const geistSans = localFont({
   src: './fonts/GeistVF.woff',
   variable: '--font-geist-sans',
   display: 'swap',
   weight: '100 900',
});

const geistMono = localFont({
   src: './fonts/GeistMonoVF.woff',
   variable: '--font-geist-mono',
   display: 'swap',
   weight: '100 900',
});

export const metadata: Metadata = {
   title: 'Clinova | Smart Clinic Management',
   description:
      'Clinova is a premium clinic management platform designed for modern healthcare professionals.',
};


export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang='en' className={cn("font-sans", geist.variable)}>
         <body
            className={`${inter.variable} ${ibmPlexSans.variable} ${sora.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
         >
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

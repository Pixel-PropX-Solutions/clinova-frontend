'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';
import { CircularProgress, Box } from '@mui/material';

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const router = useRouter();
   const pathname = usePathname();
   const token = useAuthStore((state) => state.token);
   const role = useAuthStore((state) => state.role);
   const logout = useAuthStore((state) => state.logout);
   const setAuth = useAuthStore((state) => state.setAuth);

   const [isInitializing, setIsInitializing] = useState(true);

   useEffect(() => {
      const initializeAuth = async () => {
         try {
            // Attempt to via HTTP-only refresh cookie
            const { data } = await apiClient.post('/auth/refresh');
            setAuth(data.access_token, role || 'admin', undefined, undefined);
         } catch (error) {
            // If refresh fails and we have no valid token, ensure we're logged out
            if (!token) {
               logout();
            }
         } finally {
            setIsInitializing(false);
         }
      };

      initializeAuth();
   }, []);

   useEffect(() => {
      if (isInitializing) return;

      if (!token) {
         if (
            pathname !== '/' &&
            
            !pathname.startsWith('/forgot-password')
         ) {
            router.push('/');
         }
      } else {
         if (pathname === '/') {
            if (role === 'admin') router.push('/admin');
            else router.push('/dashboard');
         }
      }
   }, [token, pathname, isInitializing, role, router]);

   if (isInitializing) {
      return (
         <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='100vh'>
            <CircularProgress />
         </Box>
      );
   }

   return <>{children}</>;
};

export { AuthProvider };

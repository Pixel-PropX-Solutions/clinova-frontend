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
      let cancelled = false;

      const initializeAuth = async () => {
         try {
            // Attempt to refresh via HTTP-only refresh cookie
            const { data } = await apiClient.post('/auth/refresh');
            if (!cancelled) {
               const currentRole = useAuthStore.getState().role;
               setAuth(data.access_token, currentRole || 'admin', undefined, undefined);
            }
         } catch (error) {
            // If refresh fails and we have no valid token, ensure we're logged out
            if (!cancelled) {
               const currentToken = useAuthStore.getState().token;
               if (!currentToken) {
                  logout();
               }
            }
         } finally {
            if (!cancelled) {
               setIsInitializing(false);
            }
         }
      };

      initializeAuth();

      return () => {
         cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [setAuth, logout]);

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

'use client';

import React from 'react';
import {
   Box,
   Backdrop,
   Drawer,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Typography,
   AppBar,
   Toolbar,
   IconButton,
   useTheme,
   Button,
   CircularProgress,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useLogoutMutation } from '@/hooks/api/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { BookTemplateIcon, HospitalIcon, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

const drawerWidth = 240;

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { mutate: logout, isPending } = useLogoutMutation();
   const theme = useTheme();
   const router = useRouter();
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const [pendingPath, setPendingPath] = React.useState<string | null>(null);
   const [isNavigating, startNavigation] = React.useTransition();

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const handleNavigate = React.useCallback(
      (path: string) => {
         if (path === pathname) {
            setMobileOpen(false);
            return;
         }

         setPendingPath(path);
         setMobileOpen(false);
         startNavigation(() => {
            router.push(path);
         });
      },
      [pathname, router],
   );

   React.useEffect(() => {
      if (pendingPath && pathname === pendingPath) {
         setPendingPath(null);
      }
   }, [pathname, pendingPath]);
   const menuItems = [
      { text: 'Clinics', icon: <HospitalIcon size={20} />, path: '/admin' },
      { text: 'Templates', icon: <BookTemplateIcon />, path: '/admin/templates' },
      // { text: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
   ];

   const drawer = (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F172A', color: 'white' }}>
         <Toolbar sx={{ px: 3, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{
                  width: 35,
                  height: 35,
                  bgcolor: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
               }}>
                  <Image src="/logo.png" alt="Clinova" width={25} height={25} />
               </Box>
               <Typography
                  variant='h6'
                  noWrap
                  component='div'
                  fontWeight='700'
                  sx={{ color: 'white', letterSpacing: '-0.5px' }}>
                  Clinova
               </Typography>
            </Box>
         </Toolbar>
         <List sx={{ px: 2, flexGrow: 1 }}>
            {menuItems.map((item) => {
               const isActive = pathname === item.path;
               return (
                  <ListItem disablePadding key={item.text} sx={{ mb: 1 }}>
                     <ListItemButton
                        onClick={() => handleNavigate(item.path)}
                        sx={{
                           borderRadius: '10px',
                           py: 1.2,
                           px: 2,
                           transition: 'all 0.3s',
                           background: isActive ? 'linear-gradient(135deg, #2F5FA5 0%, #5CC6C4 100%)' : 'transparent',
                           '&:hover': {
                              bgcolor: isActive ? '' : 'rgba(255, 255, 255, 0.05)',
                           },
                        }}>
                        <ListItemIcon
                           sx={{
                              color: isActive ? 'white' : '#64748B',
                              minWidth: 40,
                           }}>
                           {item.icon}
                        </ListItemIcon>
                        <ListItemText
                           primary={item.text}
                           primaryTypographyProps={{
                              fontSize: '14px',
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? 'white' : '#94A3B8'
                           }}
                        />
                     </ListItemButton>
                  </ListItem>
               );
            })}
         </List>
         <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Button
               fullWidth
               onClick={() => logout()}
               startIcon={<LogOut size={18} />}
               sx={{
                  color: '#94A3B8',
                  justifyContent: 'flex-start',
                  px: 2,
                  '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' }
               }}>
               Logout
            </Button>
         </Box>
      </Box>
   );

   return (
      <Box
         sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
         }}>
         <Backdrop
            open={isNavigating}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2000 }}>
            <CircularProgress color='inherit' />
         </Backdrop>
         <AppBar
            position='fixed'
            sx={{
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               ml: { sm: `${drawerWidth}px` },
               bgcolor: 'background.paper',
               color: 'text.primary',
               boxShadow: 1,
            }}>
            <Toolbar>
               <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}>
                  <Menu />
               </IconButton>
               <Box sx={{ flexGrow: 1 }} />
               <Button
                  color='inherit'
                  onClick={() => logout()}
                  disabled={isPending}
                  startIcon={<LogOut />}>
                  Logout
               </Button>{' '}
            </Toolbar>
         </AppBar>
         <Box
            component='nav'
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label='mailbox folders'>
            <Drawer
               variant='temporary'
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{ keepMounted: true }}
               sx={{
                  'display': { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': {
                     boxSizing: 'border-box',
                     width: drawerWidth,
                  },
               }}>
               {drawer}
            </Drawer>
            <Drawer
               variant='permanent'
               sx={{
                  'display': { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': {
                     boxSizing: 'border-box',
                     width: drawerWidth,
                     borderRight: '1px solid',
                     borderColor: 'divider',
                  },
               }}
               open>
               {drawer}
            </Drawer>
         </Box>
         <Box
            component='main'
            sx={{
               flexGrow: 1,
               p: 3,
               width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}>
            <Toolbar />
            {children}
         </Box>
      </Box>
   );
}

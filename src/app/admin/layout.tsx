'use client';

import React from 'react';
import {
   Box,
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
} from '@mui/material';
import { LocalHospital, Logout, Menu, Article } from '@mui/icons-material';
import { useLogoutMutation } from '@/hooks/api/useAuth';
import { useRouter, usePathname } from 'next/navigation';

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

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const drawer = (
      <div>
         <Toolbar>
            <Typography
               variant='h6'
               noWrap
               component='div'
               fontWeight='bold'>
               SaaS Admin
            </Typography>
         </Toolbar>
         <List>
            <ListItem
               disablePadding
               sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
               <ListItemButton
                  selected={pathname === '/admin'}
                  onClick={() => router.push('/admin')}>
                  <ListItemIcon>
                     <LocalHospital
                        color={pathname === '/admin' ? 'primary' : 'inherit'}
                     />
                  </ListItemIcon>
                  <ListItemText primary='Clinics' />
               </ListItemButton>
            </ListItem>
            <ListItem
               disablePadding
               sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
               <ListItemButton
                  selected={pathname === '/admin/templates'}
                  onClick={() => router.push('/admin/templates')}>
                  <ListItemIcon>
                     <Article
                        color={
                           pathname === '/admin/templates' ? 'primary' : (
                              'inherit'
                           )
                        }
                     />
                  </ListItemIcon>
                  <ListItemText primary='Templates' />
               </ListItemButton>
            </ListItem>
         </List>
      </div>
   );

   return (
      <Box
         sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
         }}>
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
                  startIcon={<Logout />}>
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

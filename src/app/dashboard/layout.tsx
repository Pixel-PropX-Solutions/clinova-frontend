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
   Button,
} from '@mui/material';
import {
   Dashboard as DashboardIcon,
   People,
   Assignment,
   Receipt,
   MedicalServices,
   Logout,
   Menu,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 240;

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { logout } = useAuthStore();
   const router = useRouter();
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = React.useState(false);

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      {
         text: 'OPD',
         icon: <Assignment />,
         path: '/dashboard/patients',
      },
      {
         text: 'Patient List',
         icon: <People />,
         path: '/dashboard/patients/list',
      },
      {
         text: 'Settings',
         icon: <Receipt />,
         path: '/dashboard/settings',
      },
   ];

   const drawer = (
      <div>
         <Toolbar>
            <Typography
               variant='h6'
               noWrap
               component='div'
               fontWeight='bold'
               color='primary'>
               Clinic Portal
            </Typography>
         </Toolbar>
         <List>
            {menuItems.map((item) => (
               <ListItem
                  disablePadding
                  key={item.text}
                  sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
                  <ListItemButton
                     selected={pathname === item.path}
                     onClick={() => {
                        router.push(item.path);
                        setMobileOpen(false);
                     }}
                     sx={{ borderRadius: 2 }}>
                     <ListItemIcon
                        sx={{
                           color:
                              pathname === item.path ?
                                 'primary.main'
                              :  'inherit',
                        }}>
                        {item.icon}
                     </ListItemIcon>
                     <ListItemText primary={item.text} />
                  </ListItemButton>
               </ListItem>
            ))}
         </List>
      </div>
   );

   return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
         <AppBar
            position='fixed'
            sx={{
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               ml: { sm: `${drawerWidth}px` },
               bgcolor: 'background.paper',
               color: 'text.primary',
               boxShadow: 'none',
               borderBottom: '1px solid',
               borderColor: 'divider',
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
                  color='error'
                  onClick={() => logout()}
                  startIcon={<Logout />}>
                  Logout
               </Button>
            </Toolbar>
         </AppBar>
         <Box
            component='nav'
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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

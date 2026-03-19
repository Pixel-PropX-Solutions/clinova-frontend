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
   Avatar,
   InputBase,
   Select,
   MenuItem,
   FormControl,
} from '@mui/material';
import {
   LayoutDashboard,
   Users,
   Settings,
   LogOut,
   Menu as MenuIcon,
   Search,
   Bell,
   ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import BackDropLoading from '@/container/BackdropLoader';
import UserProfile from '@/container/UserProfile';
import LogoutConfirmDialog from '@/container/LogoutConfirmDialog';

const drawerWidth = 260;

const normalizePath = (path: string) => {
   if (!path) return '/';

   const normalized = path.replace(/\/+$/, '');
   return normalized || '/';
};

const isMenuItemActive = (currentPath: string, itemPath: string) => {
   const normalizedCurrentPath = normalizePath(currentPath);
   const normalizedItemPath = normalizePath(itemPath);

   if (normalizedItemPath === '/dashboard') {
      return normalizedCurrentPath === normalizedItemPath;
   }

   return (
      normalizedCurrentPath === normalizedItemPath ||
      normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
   );
};

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { logout } = useAuthStore();
   const router = useRouter();
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
   const [clinic, setClinic] = React.useState('main-clinic');
   const [pendingPath, setPendingPath] = React.useState<string | null>(null);
   const [isNavigating, startNavigation] = React.useTransition();

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const handleOpenLogoutDialog = () => {
      setLogoutDialogOpen(true);
   };

   const handleCloseLogoutDialog = () => {
      setLogoutDialogOpen(false);
   };

   const handleConfirmLogout = () => {
      setLogoutDialogOpen(false);
      logout();
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
      { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { text: 'Patients', icon: <Users size={20} />, path: '/dashboard/patients' },
      // { text: 'Appointments', icon: <Calendar size={20} />, path: '/dashboard/appointments' },
      // { text: 'Prescriptions', icon: <FileText size={20} />, path: '/dashboard/prescriptions' },
      // { text: 'Billing', icon: <Receipt size={20} />, path: '/dashboard/billing' },
      // { text: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
      { text: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
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
               const isActive = isMenuItemActive(pathname, item.path);
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
               onClick={handleOpenLogoutDialog}
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
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F6FAFF' }}>
         <BackDropLoading isLoading={isNavigating} />
         <LogoutConfirmDialog
            open={logoutDialogOpen}
            onClose={handleCloseLogoutDialog}
            onConfirm={handleConfirmLogout}
            roleLabel='user'
         />
         <AppBar
            position='fixed'
            sx={{
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               ml: { sm: `${drawerWidth}px` },
               bgcolor: 'white',
               px: { xs: 3, sm: 6 },
               color: 'text.primary',
               boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
               borderBottom: '1px solid #E3EEF7',
            }}>
            <Toolbar sx={{ px: { xs: 1, sm: 4 }, gap: { xs: 1, sm: 2 } }}>
               <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  onClick={handleDrawerToggle}
                  sx={{ mr: { xs: 0, sm: 2 }, display: { sm: 'none' } }}>
                  <MenuIcon />
               </IconButton>

               <Box sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  bgcolor: '#F6FAFF',
                  px: 2,
                  py: 0.5,
                  borderRadius: '10px',
                  width: { md: 200, lg: 300 },
                  border: '1px solid #E3EEF7',
                  transition: 'width 0.3s'
               }}>
                  <Search size={18} color="#64748B" />
                  <InputBase
                     placeholder="Search..."
                     sx={{ ml: 1, flex: 1, fontSize: '14px' }}
                  />
               </Box>

               <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton sx={{ color: '#64748B' }}>
                     <Search size={20} />
                  </IconButton>
               </Box>

               <Box sx={{ flexGrow: 1 }} />

               <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
                  <IconButton sx={{
                     bgcolor: { xs: 'transparent', sm: '#F6FAFF' },
                     border: { xs: 'none', sm: '1px solid #E3EEF7' },
                     borderRadius: '10px'
                  }}>
                     <Bell size={20} color="#64748B" />
                  </IconButton>

                  <UserProfile />
               </Box>
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
                     border: 'none',
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
                     border: 'none',
                     boxShadow: '4px 0 20px rgba(15, 23, 42, 0.05)',
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
               p: { xs: 2, sm: 4 },
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               minHeight: '100vh',
            }}>
            <Toolbar />
            {children}
         </Box>
      </Box>
   );
}

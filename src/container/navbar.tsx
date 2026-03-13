'use client';

import React, { useState } from 'react';
import {
   AppBar,
   Toolbar,
   Typography,
   Button,
   Box,
   IconButton,
   Drawer,
   List,
   ListItem,
   ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { MenuIcon } from 'lucide-react';
import { useLogoutMutation } from '@/hooks/api/useAuth';

const Navbar = () => {
   const [mobileOpen, setMobileOpen] = useState(false);
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const logoutMutation = useLogoutMutation();

   const navLinks = [
      { name: 'Home', href: '/home' },
      { name: 'OPD', href: '/opd' },
      { name: 'OPD/View', href: '/view' },
   ];

   const drawer = (
      <Box
         minWidth={200}
         onClick={handleDrawerToggle}
         sx={{ textAlign: 'center' }}>
         <Typography
            variant='h6'
            sx={{ my: 2 }}>
            Omkary's Clinic
         </Typography>
         <List>
            {navLinks.map((link) => (
               <ListItem key={link.name}>
                  <Link
                     href={link.href}
                     passHref
                     style={{ textDecoration: 'none', width: '100%' }}>
                     <ListItemText
                        primary={link.name}
                        sx={{
                           textAlign: 'center',
                           textDecoration: 'none',
                           color: 'inherit',
                        }}
                     />
                  </Link>
               </ListItem>
            ))}
            <ListItem>
               <Button
                  fullWidth
                  variant='outlined'
                  color='error'
                  onClick={() => {
                     handleDrawerToggle();
                     logoutMutation.mutate();
                  }}
                  disabled={logoutMutation.isPending}>
                  Logout
               </Button>
            </ListItem>
         </List>
      </Box>
   );

   return (
      <AppBar
         position='static'
         color='inherit'>
         <Toolbar>
            {/* Logo */}
            <Box
               display='flex'
               alignItems='center'
               gap={1}
               sx={{ flexGrow: 1 }}>
               <Image
                  src='/logo.png'
                  alt='Logo'
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
               />
               <Typography
                  variant='h6'
                  sx={{ flexGrow: 1 }}>
                  <Link
                     href='/'
                     style={{ textDecoration: 'none', color: 'inherit' }}>
                     Omkary's Clinic
                  </Link>
               </Typography>
            </Box>

            {
               isMobile ?
                  // Mobile Menu
                  <>
                     <IconButton
                        color='inherit'
                        edge='start'
                        onClick={handleDrawerToggle}>
                        <MenuIcon />
                     </IconButton>
                     <Drawer
                        anchor='left'
                        open={mobileOpen}
                        onClose={handleDrawerToggle}>
                        {drawer}
                     </Drawer>
                  </>
                  // Desktop Menu
               :  <Box
                     display='flex'
                     gap={2}
                     alignItems='center'>
                     {navLinks.map((link) => (
                        <Link
                           href={link.href}
                           key={link.name}
                           passHref>
                           <Button sx={{ color: 'black' }}>{link.name}</Button>
                        </Link>
                     ))}
                     <Button
                        sx={{
                           color: 'black',
                           ml: 2,
                           border: '1px solid black',
                        }}
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}>
                        Logout
                     </Button>
                  </Box>

            }
         </Toolbar>{' '}
      </AppBar>
   );
};

export default Navbar;

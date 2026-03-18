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
          sx={{ 
             width: 280, 
             p: 3, 
             display: 'flex', 
             flexDirection: 'column', 
             height: '100%',
             bgcolor: 'white'
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, px: 1 }}>
             <Image
                src='/logo.png'
                alt='Logo'
                width={32}
                height={32}
                style={{ borderRadius: '50%' }}
             />
             <Typography variant="h6" fontWeight="800" color="primary">Clinova</Typography>
          </Box>
          
          <List sx={{ flexGrow: 1 }}>
             {navLinks.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
                   <Link
                      href={link.href}
                      passHref
                      style={{ textDecoration: 'none', width: '100%' }}>
                      <Button
                         fullWidth
                         onClick={handleDrawerToggle}
                         sx={{
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 2,
                            borderRadius: '12px',
                            color: '#475569',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#F1F5F9', color: 'primary.main' }
                         }}>
                         {link.name}
                      </Button>
                   </Link>
                </ListItem>
             ))}
          </List>

          <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
             <Button
                fullWidth
                variant='outlined'
                color='error'
                onClick={() => {
                   handleDrawerToggle();
                   logoutMutation.mutate();
                }}
                disabled={logoutMutation.isPending}
                sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}>
                Logout
             </Button>
          </Box>
       </Box>
    );
 
    return (
       <AppBar
          position='sticky'
          elevation={0}
          sx={{ 
             bgcolor: 'white', 
             borderBottom: '1px solid #E3EEF7',
             zIndex: (theme) => theme.zIndex.drawer + 1
          }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
             {/* Logo */}
             <Box
                display='flex'
                alignItems='center'
                gap={1.5}>
                <Image
                   src='/logo.png'
                   alt='Logo'
                   width={isMobile ? 32 : 40}
                   height={isMobile ? 32 : 40}
                   style={{ borderRadius: '50%' }}
                />
                <Typography
                   variant={isMobile ? 'h6' : 'h5'}
                   fontWeight="800"
                   color="primary">
                   <Link
                      href='/'
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      Clinova
                   </Link>
                </Typography>
             </Box>
 
             {
                isMobile ?
                   // Mobile Menu
                   <>
                      <IconButton
                         color='inherit'
                         edge='end'
                         onClick={handleDrawerToggle}
                         sx={{ color: '#475569' }}>
                         <MenuIcon />
                      </IconButton>
                      <Drawer
                         anchor='left'
                         open={mobileOpen}
                         onClose={handleDrawerToggle}
                         PaperProps={{ sx: { border: 'none', boxShadow: '20px 0 40px rgba(0,0,0,0.05)' } }}>
                         {drawer}
                      </Drawer>
                   </>
                   // Desktop Menu
                   : <Box
                      display='flex'
                      gap={1}
                      alignItems='center'>
                      {navLinks.map((link) => (
                         <Link
                            href={link.href}
                            key={link.name}
                            passHref>
                            <Button 
                               sx={{ 
                                  color: '#475569', 
                                  fontWeight: 600, 
                                  px: 2, 
                                  borderRadius: '8px',
                                  '&:hover': { bgcolor: '#F1F5F9', color: 'primary.main' }
                               }}>
                               {link.name}
                            </Button>
                         </Link>
                      ))}
                      <Button
                         variant="outlined"
                         color="error"
                         onClick={() => logoutMutation.mutate()}
                         disabled={logoutMutation.isPending}
                         sx={{ 
                            ml: 2, 
                            borderRadius: '10px', 
                            fontWeight: 700,
                            px: 3
                         }}>
                         Logout
                      </Button>
                   </Box>
 
             }
          </Toolbar>
       </AppBar>
    );
};

export default Navbar;

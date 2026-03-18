'use client';

import React, { useState } from 'react';
import {
   TextField,
   Button,
   Typography,
   Box,
   Grid,
   useTheme,
   CircularProgress,
   InputAdornment,
   Checkbox,
   FormControlLabel,
   Link,
} from '@mui/material';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuthMutation } from '@/hooks/api/useAuth';
import Image from 'next/image';

const LoginPage = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const theme = useTheme();
   const { mutate: login, isPending } = useAuthMutation();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (email && password) {
         login({ email, password });
      }
   };

   return (
      <Grid container component='main' sx={{ height: '100vh', overflow: 'hidden' }}>
          <Grid
             item
             xs={false}
             sm={5}
             md={6}
             lg={7}
             sx={{
                background: 'linear-gradient(135deg, #2F5FA5 0%, #5CC6C4 100%)',
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: 'white',
                p: 6,
             }}>
             <Box sx={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%', 
                overflow: 'hidden',
                top: 0,
                left: 0,
                pointerEvents: 'none'
             }}>
                <Box sx={{ 
                   position: 'absolute', 
                   width: 600, 
                   height: 600, 
                   borderRadius: '50%', 
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                   top: '-10%',
                   right: '-10%'
                }} />
                <Box sx={{ 
                   position: 'absolute', 
                   width: 400, 
                   height: 400, 
                   borderRadius: '50%', 
                   border: '1px solid rgba(255, 255, 255, 0.05)',
                   bottom: '10%',
                   left: '-5%'
                }} />
             </Box>
 
             <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Box sx={{ 
                   width: 80, 
                   height: 80, 
                   bgcolor: 'white', 
                   borderRadius: '20px', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   mx: 'auto',
                   mb: 4,
                   boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                }}>
                   <Image src="/logo.png" alt="Clinova" width={60} height={60} />
                </Box>
                <Typography variant="h2" fontWeight="700" gutterBottom>
                   Clinova
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 450, mx: 'auto' }}>
                   Smart Clinic Management Platform for modern healthcare.
                </Typography>
                
                <Box sx={{ mt: 8, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                   <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Sparkles size={20} style={{ marginBottom: 8 }} />
                      <Typography variant="body2" fontWeight="600">AI Analytics</Typography>
                   </Box>
                   <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Sparkles size={20} style={{ marginBottom: 8 }} />
                      <Typography variant="body2" fontWeight="600">HIPAA Ready</Typography>
                   </Box>
                </Box>
             </Box>
          </Grid>
 
          {/* Right Side: Login Form */}
          <Grid
             item
             xs={12}
             sm={7}
             md={6}
             lg={5}
             sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: { xs: 'white', sm: '#F6FAFF' },
             }}>
             <Box
                sx={{
                   width: '100%',
                   maxWidth: 420,
                   p: { xs: 4, sm: 5 },
                   m: { xs: 0, sm: 3 },
                   bgcolor: 'white',
                   borderRadius: { xs: 0, sm: '24px' },
                   boxShadow: { xs: 'none', sm: '0 10px 40px rgba(15, 23, 42, 0.05)' },
                   border: { xs: 'none', sm: '1px solid #E3EEF7' },
                }}>
               <Typography variant='h4' fontWeight='700' mb={1} color="primary">
                  Welcome Back
               </Typography>
               <Typography variant='body1' color='text.secondary' mb={4}>
                  Please enter your details to sign in
               </Typography>

               <Box component='form' noValidate onSubmit={handleSubmit}>
                  <TextField
                     margin='normal'
                     required
                     fullWidth
                     id='email'
                     label='Email Address'
                     name='email'
                     autoComplete='email'
                     autoFocus
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position="start">
                              <Mail size={18} color="#64748B" />
                           </InputAdornment>
                        ),
                     }}
                  />
                  <TextField
                     margin='normal'
                     required
                     fullWidth
                     name='password'
                     label='Password'
                     type='password'
                     id='password'
                     autoComplete='current-password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position="start">
                              <Lock size={18} color="#64748B" />
                           </InputAdornment>
                        ),
                     }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 3 }}>
                     <FormControlLabel
                        control={<Checkbox value="remember" color="primary" sx={{ borderRadius: '4px' }} />}
                        label={<Typography variant="body2" color="textSecondary">Remember me</Typography>}
                     />
                     <Link href="#" variant="body2" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                        Forgot password?
                     </Link>
                  </Box>

                  <Button
                     type='submit'
                     fullWidth
                     variant='contained'
                     disabled={isPending || !email || !password}
                     sx={{ 
                        height: 52, 
                        fontSize: '16px',
                        mb: 3
                     }}>
                     {isPending ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                  </Button>

                  <Typography variant='body2' color='text.secondary' align='center'>
                     Don&apos;t have an account?{' '}
                     <Link href="#" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                        Contact Support
                     </Link>
                  </Typography>
               </Box>
            </Box>
         </Grid>
      </Grid>
   );
};

export default LoginPage;

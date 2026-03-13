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
} from '@mui/material';
import { useAuthMutation } from '@/hooks/api/useAuth';

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
      <Grid
         container
         component='main'
         sx={{ height: '98vh' }}>
         <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
               backgroundImage: "url('/bg.jpg')",
               backgroundRepeat: 'no-repeat',
               backgroundColor: (t) =>
                  t.palette.mode === 'light' ?
                     t.palette.grey[50]
                  :  t.palette.grey[900],
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            }}
         />
         <Grid
            item
            xs={12}
            sm={8}
            md={5}
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            <Box
               sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  padding: 4,
                  width: '100%',
                  maxWidth: 400,
                  boxShadow: theme.shadows[3],
               }}>
               <Typography
                  component='h1'
                  variant='h5'
                  fontWeight='bold'
                  mb={2}>
                  Clinic Management SaaS
               </Typography>
               <Typography
                  component='h2'
                  variant='h6'
                  color='text.secondary'
                  mb={3}>
                  Login to your account
               </Typography>
               <Box
                  component='form'
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1, width: '100%' }}>
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
                     variant='outlined'
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
                     variant='outlined'
                  />
                  <Button
                     type='submit'
                     fullWidth
                     variant='contained'
                     disabled={isPending || !email || !password}
                     sx={{ mt: 4, mb: 2, height: 48 }}>
                     {isPending ?
                        <CircularProgress size={24} />
                     :  'Sign In'}
                  </Button>
                  <Typography
                     variant='body2'
                     color='text.secondary'
                     align='center'>
                     Enter your credentials to access the portal.
                  </Typography>
               </Box>
            </Box>
         </Grid>
      </Grid>
   );
};

export default LoginPage;

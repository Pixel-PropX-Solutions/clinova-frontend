'use client';

import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Paper,
   Grid,
   TextField,
   Button,
   Avatar,
   IconButton,
   Tabs,
   Tab,
   CircularProgress,
   Card,
   CardContent,
   Divider,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
   Stack,
} from '@mui/material';
import {
   CloudUpload,
   PhotoCamera,
   Save,
   Lock,
   Business,
   Description,
   Visibility,
} from '@mui/icons-material';
import {
   useClinicProfile,
   useUpdateProfile,
   useUploadLogo,
   useChangePassword,
   useSetDefaultTemplate,
} from '@/hooks/api/useSettings';
import { useTemplates } from '@/hooks/api/useTemplates';
import { toast } from 'react-toastify';

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
   return (
      <div
         role='tabpanel'
         hidden={value !== index}
         id={`settings-tabpanel-${index}`}
         aria-labelledby={`settings-tab-${index}`}
         {...other}>
         {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
   );
}

export default function SettingsPage() {
   const [tabValue, setTabValue] = useState(0);
   const { data: clinic, isLoading: isClinicLoading } = useClinicProfile();
   const { data: templates } = useTemplates();

   const updateProfile = useUpdateProfile();
   const uploadLogo = useUploadLogo();
   const changePassword = useChangePassword();
   const setDefaultTemplate = useSetDefaultTemplate();

   const [profileState, setProfileState] = useState({
      name: '',
      phone: '',
      address: '',
   });

   const [passwordState, setPasswordState] = useState({
      current_password: '',
      new_password: '',
      confirm_password: '',
   });

   const [previewTemplate, setPreviewTemplate] = useState<any>(null);

   useEffect(() => {
      if (clinic) {
         setProfileState({
            name: clinic.name || '',
            phone: clinic.phone || '',
            address: clinic.address || '',
         });

         // Auto-select default template for preview if not already set
         if (templates && !previewTemplate) {
            const defaultT = templates.find(
               (t: any) => t._id === clinic.default_template_id,
            );
            if (defaultT) setPreviewTemplate(defaultT);
         }
      }
   }, [clinic, templates]);

   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
   };

   const handleProfileSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateProfile.mutate(profileState);
   };

   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         uploadLogo.mutate(e.target.files[0]);
      }
   };

   const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordState.new_password !== passwordState.confirm_password) {
         toast.error('New passwords do not match');
         return;
      }
      changePassword.mutate(
         {
            current_password: passwordState.current_password,
            new_password: passwordState.new_password,
         },
         {
            onSuccess: () => {
               setPasswordState({
                  current_password: '',
                  new_password: '',
                  confirm_password: '',
               });
            },
         },
      );
   };

   if (isClinicLoading) {
      return (
         <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='80vh'>
            <CircularProgress />
         </Box>
      );
   }

   return (
      <Box
         sx={{
            pb: 8,
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
         }}>
         <Box sx={{ mb: 4 }}>
            <Typography
               variant='h4'
               fontWeight='800'
               sx={{
                  color: 'primary.dark',
                  mb: 0.5,
               }}>
               Settings
            </Typography>
            <Typography
               variant='body1'
               color='text.secondary'>
               Manage your clinic profile, customize PDF exports, and security.
            </Typography>
         </Box>

         <Paper
            elevation={0}
            sx={{
               width: '100%',
               borderRadius: 4,
               border: '1px solid',
               borderColor: 'divider',
               overflow: 'hidden',
               bgcolor: 'background.paper',
            }}>
            <Box
               sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
               }}>
               <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                     'px': 2,
                     '& .MuiTab-root': {
                        'py': 2,
                        'minHeight': 64,
                        'fontSize': '0.9rem',
                        'fontWeight': 600,
                        'textTransform': 'none',
                        'color': 'text.secondary',
                        '&.Mui-selected': {
                           color: 'primary.main',
                        },
                     },
                     '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                     },
                  }}>
                  <Tab
                     icon={<Business sx={{ mr: 1, fontSize: 20 }} />}
                     iconPosition='start'
                     label='Clinic Profile'
                  />
                  <Tab
                     icon={<Description sx={{ mr: 1, fontSize: 20 }} />}
                     iconPosition='start'
                     label='PDF Templates'
                  />
                  <Tab
                     icon={<Lock sx={{ mr: 1, fontSize: 20 }} />}
                     iconPosition='start'
                     label='Security'
                  />
               </Tabs>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
               {/* Tab 0: Clinic Profile */}
               <TabPanel
                  value={tabValue}
                  index={0}>
                  <Grid
                     container
                     spacing={4}>
                     <Grid
                        item
                        xs={12}
                        md={4}>
                        <Box
                           sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 2,
                           }}>
                           <Box sx={{ position: 'relative', mb: 3 }}>
                              <Avatar
                                 src={clinic?.logo_url}
                                 sx={{
                                    width: 140,
                                    height: 140,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    border: '4px solid white',
                                    fontSize: '2.5rem',
                                    bgcolor: 'primary.light',
                                 }}>
                                 {clinic?.name?.charAt(0)}
                              </Avatar>
                              <input
                                 accept='image/*'
                                 style={{ display: 'none' }}
                                 id='logo-button-file'
                                 type='file'
                                 onChange={handleLogoChange}
                              />
                              <label htmlFor='logo-button-file'>
                                 <IconButton
                                    color='primary'
                                    component='span'
                                    sx={{
                                       'position': 'absolute',
                                       'bottom': 5,
                                       'right': 5,
                                       'bgcolor': 'white',
                                       'boxShadow':
                                          '0 2px 8px rgba(0,0,0,0.15)',
                                       '&:hover': { bgcolor: 'grey.50' },
                                       'width': 36,
                                       'height': 36,
                                    }}>
                                    <PhotoCamera sx={{ fontSize: 20 }} />
                                 </IconButton>
                              </label>
                           </Box>
                           <Typography
                              variant='subtitle1'
                              fontWeight='700'
                              gutterBottom>
                              Clinic Logo
                           </Typography>
                           <Typography
                              variant='caption'
                              color='text.secondary'
                              textAlign='center'>
                              Max 2MB. Jpeg, Png or WebP.
                           </Typography>
                           {uploadLogo.isPending && (
                              <CircularProgress
                                 size={20}
                                 sx={{ mt: 2 }}
                              />
                           )}
                        </Box>
                     </Grid>

                     <Grid
                        item
                        xs={12}
                        md={8}>
                        <form onSubmit={handleProfileSubmit}>
                           <Stack spacing={3}>
                              <TextField
                                 label='Clinic Name'
                                 fullWidth
                                 value={profileState.name}
                                 onChange={(e) =>
                                    setProfileState({
                                       ...profileState,
                                       name: e.target.value,
                                    })
                                 }
                                 required
                              />
                              <Grid
                                 container
                                 spacing={2}>
                                 <Grid
                                    item
                                    xs={12}
                                    md={6}>
                                    <TextField
                                       label='Phone Number'
                                       fullWidth
                                       value={profileState.phone}
                                       onChange={(e) =>
                                          setProfileState({
                                             ...profileState,
                                             phone: e.target.value,
                                          })
                                       }
                                    />
                                 </Grid>
                                 <Grid
                                    item
                                    xs={12}
                                    md={6}>
                                    <TextField
                                       label='Admin Email'
                                       fullWidth
                                       value={clinic?.email}
                                       disabled
                                       helperText='Email cannot be changed'
                                    />
                                 </Grid>
                              </Grid>
                              <TextField
                                 label='Full Address'
                                 fullWidth
                                 multiline
                                 rows={3}
                                 value={profileState.address}
                                 onChange={(e) =>
                                    setProfileState({
                                       ...profileState,
                                       address: e.target.value,
                                    })
                                 }
                              />
                              <Box
                                 display='flex'
                                 justifyContent='flex-end'>
                                 <Button
                                    type='submit'
                                    variant='contained'
                                    startIcon={<Save />}
                                    disabled={updateProfile.isPending}
                                    sx={{
                                       px: 4,
                                       py: 1.2,
                                       borderRadius: 2,
                                       textTransform: 'none',
                                    }}>
                                    Save Changes
                                 </Button>
                              </Box>
                           </Stack>
                        </form>
                     </Grid>
                  </Grid>
               </TabPanel>

               {/* Tab 1: PDF Templates */}
               <TabPanel
                  value={tabValue}
                  index={1}>
                  <Grid
                     container sx={{}}
                     spacing={3}>
                     <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ minWidth: 0 }}>
                        <Box sx={{ mb: 3 }}>
                           <Typography
                              variant='h6'
                              fontWeight='700'>
                              Export Templates
                           </Typography>
                           <Typography
                              variant='body2'
                              color='text.secondary'>
                              Themes for your medical reports and prescriptions.
                           </Typography>
                        </Box>

                        <Stack
                           spacing={2}
                           sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                           {templates?.map((t: any) => {
                              const isDefault =
                                 clinic?.default_template_id === t._id;
                              const isPreviewing =
                                 previewTemplate?._id === t._id;

                              return (
                                 <Card
                                    key={t._id}
                                    elevation={0}
                                    onClick={() => setPreviewTemplate(t)}
                                    sx={{
                                       'cursor': 'pointer',
                                       'borderRadius': 3,
                                       'border': '2px solid',
                                       'borderColor':
                                          isPreviewing ? 'primary.main' : (
                                             'divider'
                                          ),
                                       'bgcolor':
                                          isPreviewing ? 'primary.50' : (
                                             'background.paper'
                                          ),
                                       'transition': 'all 0.15s ease',
                                       '&:hover': {
                                          borderColor:
                                             isPreviewing ? 'primary.main' : (
                                                'primary.light'
                                             ),
                                          bgcolor:
                                             isPreviewing ? 'primary.50' : (
                                                'grey.50'
                                             ),
                                       },
                                    }}>
                                    <CardContent
                                       sx={{
                                          'p': 2,
                                          '&:last-child': { pb: 2 },
                                       }}>
                                       <Box
                                          sx={{
                                             display: 'flex',
                                             justifyContent: 'space-between',
                                             alignItems: 'center',
                                          }}>
                                          <Box>
                                             <Typography
                                                variant='subtitle2'
                                                fontWeight='700'
                                                color={
                                                   isPreviewing ? 'primary.dark'
                                                      : 'text.primary'
                                                }>
                                                {t.template_name}
                                             </Typography>
                                             <Box
                                                sx={{
                                                   display: 'flex',
                                                   gap: 1,
                                                   mt: 0.5,
                                                }}>
                                                {t.is_global && (
                                                   <Typography
                                                      variant='caption'
                                                      sx={{
                                                         bgcolor: 'grey.100',
                                                         color: 'text.secondary',
                                                         px: 1,
                                                         borderRadius: 0.5,
                                                      }}>
                                                      Global
                                                   </Typography>
                                                )}
                                                {isDefault && (
                                                   <Typography
                                                      variant='caption'
                                                      sx={{
                                                         bgcolor: 'success.50',
                                                         color: 'success.dark',
                                                         px: 1,
                                                         borderRadius: 0.5,
                                                         fontWeight: 700,
                                                      }}>
                                                      Active
                                                   </Typography>
                                                )}
                                             </Box>
                                          </Box>
                                          {!isDefault && isPreviewing && (
                                             <Button
                                                size='small'
                                                variant='contained'
                                                sx={{
                                                   borderRadius: 1.5,
                                                   py: 0.4,
                                                   fontSize: '0.7rem',
                                                   textTransform: 'none',
                                                }}
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   setDefaultTemplate.mutate(
                                                      t._id,
                                                   );
                                                }}
                                                disabled={
                                                   setDefaultTemplate.isPending
                                                }>
                                                Use This
                                             </Button>
                                          )}
                                       </Box>
                                    </CardContent>
                                 </Card>
                              );
                           })}
                        </Stack>
                     </Grid>

                     <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{ minWidth: 0 }}>
                        <Box
                           sx={{
                              bgcolor: 'grey.100',
                              borderRadius: 4,
                              border: '1px solid',
                              borderColor: 'divider',
                              height: { xs: 420, md: 800 },
                              display: 'flex',
                              //  height: '100%', minHeight: '100%',
                              flexDirection: 'column',
                              overflow: 'hidden',
                           }}>
                           <Box
                              sx={{
                                 px: 2,
                                 py: 1.5,
                                 bgcolor: 'background.paper',
                                 borderBottom: '1px solid',
                                 borderColor: 'divider',
                                 display: 'flex',
                                 justifyContent: 'space-between',
                              }}>
                              <Typography
                                 variant='caption'
                                 fontWeight='700'
                                 color='text.secondary'>
                                 LIVE PREVIEW
                              </Typography>
                              {previewTemplate && (
                                 <Typography
                                    variant='caption'
                                    color='primary.main'
                                    fontWeight='600'>
                                    {previewTemplate.template_name}
                                 </Typography>
                              )}
                           </Box>

                           <Box
                              sx={{
                                 flexGrow: 1,
                                 display: 'flex',
                                  height: '100%',
                                 justifyContent: 'center',
                                 alignItems: 'flex-start',
                                 overflow: 'auto',
                                 bgcolor: '#f4f6f8',
                                 p: { xs: 1.5, md: 3 },
                              }}>
                              {previewTemplate ?
                                 <Paper
                                    elevation={10}
                                    sx={{
                                       width: '100%',
                                        height: '100%',
                                       minHeight: '100%',
                                       bgcolor: '#fff',
                                       borderRadius: 2,
                                       overflow: 'hidden',
                                    }}>
                                    <iframe
                                       title={`template-preview-${previewTemplate._id}`}
                                       srcDoc={previewTemplate.html_content}
                                       style={{
                                          width: '100%',
                                          height: '100%',
                                          minHeight: '100%',
                                          border: 'none',
                                          display: 'block',
                                          background: '#fff',
                                       }}
                                    />
                                 </Paper>
                                 : null}
                           </Box>
                        </Box>
                     </Grid>
                  </Grid>
               </TabPanel>

               {/* Tab 2: Security */}
               <TabPanel
                  value={tabValue}
                  index={2}>
                  <Box sx={{ maxWidth: 500 }}>
                     <Typography
                        variant='h6'
                        fontWeight='700'
                        gutterBottom>
                        Update Password
                     </Typography>
                     <Typography
                        variant='body2'
                        color='text.secondary'
                        mb={4}>
                        Regularly changing your password helps protect your
                        clinic data.
                     </Typography>

                     <form onSubmit={handlePasswordSubmit}>
                        <Stack spacing={3}>
                           <TextField
                              label='Current Password'
                              type='password'
                              fullWidth
                              value={passwordState.current_password}
                              onChange={(e) =>
                                 setPasswordState({
                                    ...passwordState,
                                    current_password: e.target.value,
                                 })
                              }
                              required
                           />
                           <Divider />
                           <TextField
                              label='New Password'
                              type='password'
                              fullWidth
                              value={passwordState.new_password}
                              onChange={(e) =>
                                 setPasswordState({
                                    ...passwordState,
                                    new_password: e.target.value,
                                 })
                              }
                              required
                           />
                           <TextField
                              label='Confirm New Password'
                              type='password'
                              fullWidth
                              value={passwordState.confirm_password}
                              onChange={(e) =>
                                 setPasswordState({
                                    ...passwordState,
                                    confirm_password: e.target.value,
                                 })
                              }
                              required
                           />
                           <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              disabled={changePassword.isPending}
                              sx={{
                                 py: 1.2,
                                 borderRadius: 2,
                                 textTransform: 'none',
                              }}>
                              Update Password
                           </Button>
                        </Stack>
                     </form>
                  </Box>
               </TabPanel>
            </Box>
         </Paper>
      </Box>
   );
}

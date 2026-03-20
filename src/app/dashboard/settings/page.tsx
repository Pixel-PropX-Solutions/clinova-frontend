'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
   Chip,
   useTheme,
   useMediaQuery,
} from '@mui/material';
import {
   Camera,
   Save,
   Lock,
   Building,
   FileText,
   UploadCloud,
   CheckCircle2,
   Eye,
} from 'lucide-react';
import {
   useClinicProfile,
   useUpdateProfile,
   useUploadLogo,
   useChangePassword,
   useSetDefaultTemplate,
   useAddClinicDoctor,
} from '@/hooks/api/useSettings';
import { useTemplates } from '@/hooks/api/useTemplates';
import { toast } from 'react-toastify';
import Doctors from '@/container/Doctors';

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
         {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
      </div>
   );
}

export default function SettingsPage() {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
   const previewContainerRef = useRef<HTMLDivElement | null>(null);
   const [previewFrameSize, setPreviewFrameSize] = useState({ width: 1024, height: 1320 });
   const [previewScale, setPreviewScale] = useState(1);
   const scaledPreviewWidth = previewFrameSize.width * previewScale;
   const scaledPreviewHeight = previewFrameSize.height * previewScale;

   const recalculatePreviewScale = useCallback(() => {
      const container = previewContainerRef.current;
      if (!container) return;

      const widthScale = container.clientWidth / previewFrameSize.width;
      const heightScale = container.clientHeight / previewFrameSize.height;
      const nextScale = Math.min(1, widthScale, heightScale);

      if (Number.isFinite(nextScale) && nextScale > 0) {
         setPreviewScale(nextScale);
      }
   }, [previewFrameSize.height, previewFrameSize.width]);

   useEffect(() => {
      recalculatePreviewScale();
   }, [recalculatePreviewScale, previewTemplate]);

   useEffect(() => {
      if (tabValue === 1) {
         recalculatePreviewScale();
      }
   }, [tabValue, recalculatePreviewScale]);

   useEffect(() => {
      const container = previewContainerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
         recalculatePreviewScale();
      });

      observer.observe(container);
      return () => observer.disconnect();
   }, [recalculatePreviewScale]);

   const handlePreviewLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
      const iframe = event.currentTarget;
      const doc = iframe.contentDocument;
      if (!doc) return;

      const root = doc.documentElement;
      const body = doc.body;

      const contentWidth = Math.max(
         root?.scrollWidth || 0,
         root?.offsetWidth || 0,
         body?.scrollWidth || 0,
         body?.offsetWidth || 0,
      );
      const contentHeight = Math.max(
         root?.scrollHeight || 0,
         root?.offsetHeight || 0,
         body?.scrollHeight || 0,
         body?.offsetHeight || 0,
      );

      if (contentWidth > 0 && contentHeight > 0) {
         setPreviewFrameSize({ width: contentWidth, height: contentHeight });
      }
   };

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
   }, [clinic, templates, previewTemplate]);

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
            <CircularProgress thickness={4} />
         </Box>
      );
   }

   return (
      <Box sx={{ mx: 'auto' }}>
         <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography variant='h4' fontWeight='800' color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
               Clinic Settings
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
               Manage your clinic identity, customize prescriptions, and configure security.
            </Typography>
         </Box>

         <Card sx={{ borderRadius: { xs: '16px', sm: '24px' }, boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', }}>
            <Box sx={{ borderBottom: '1px solid #E3EEF7', bgcolor: '#F8FAFC' }}>
               <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons={isMobile ? "auto" : false}
                  sx={{
                     'px': { xs: 1, sm: 3 },
                     '& .MuiTab-root': {
                        'py': { xs: 2, sm: 2.5 },
                        'minHeight': { xs: 60, sm: 72 },
                        'fontSize': { xs: '13px', sm: '15px' },
                        'fontWeight': 600,
                        'textTransform': 'none',
                        'color': '#64748B',
                        '&.Mui-selected': { color: 'primary.main' },
                        'transition': 'all 0.2s',
                        'display': 'flex',
                        'flexDirection': 'row',
                        'alignItems': 'center',
                        'gap': 1,
                        'minWidth': { xs: 'auto', sm: 160 }
                     },
                     '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                  }}>
                  <Tab icon={isMobile ? undefined : <Building size={16} />} iconPosition='start' label='Profile' />
                  <Tab icon={isMobile ? undefined : <FileText size={16} />} iconPosition='start' label='Templates' />
                  <Tab icon={isMobile ? undefined : <Lock size={16} />} iconPosition='start' label='Security' />
               </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 4, md: 5 } }}>
               {/* Tab 0: Clinic Profile */}
               <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={{ xs: 4, md: 6 }}>
                     <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 1, md: 2 } }}>
                           <Box sx={{ position: 'relative', mb: 3 }}>
                              <Avatar
                                 src={clinic?.logo_url}
                                 sx={{
                                    width: { xs: 120, md: 160 },
                                    height: { xs: 120, md: 160 },
                                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
                                    border: '1px solid #E3EEF7',
                                    fontSize: { xs: '2rem', md: '3rem' },
                                    fontWeight: '800',
                                    color: 'white'
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
                                       'boxShadow': '0 4px 12px rgba(0,0,0,0.1)',
                                       '&:hover': { bgcolor: '#F1F5F9', transform: 'scale(1.1)' },
                                       'width': { xs: 36, md: 44 },
                                       'height': { xs: 36, md: 44 },
                                       'transition': 'all 0.2s',
                                       'border': '1px solid #E3EEF7',
                                    }}>
                                    <Camera size={20} />
                                 </IconButton>
                              </label>
                           </Box>
                           <Typography variant='h6' fontWeight='700' gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                              Clinic Logo
                           </Typography>
                           <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ px: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                              Upload your official clinic logo. This will appear on all prescriptions and receipts.
                           </Typography>
                           {uploadLogo.isPending && <CircularProgress size={24} sx={{ mt: 3 }} />}
                        </Box>
                     </Grid>

                     <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
                        <form onSubmit={handleProfileSubmit}>
                           <Stack spacing={{ xs: 3, md: 4 }}>
                              <Typography variant="subtitle2" color="primary" fontWeight="700" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                                 Information Details
                              </Typography>

                              <TextField
                                 label='Clinic Name'
                                 fullWidth
                                 value={profileState.name}
                                 onChange={(e) => setProfileState({ ...profileState, name: e.target.value })}
                                 required
                              />

                              <Grid container justifyContent={'space-between'}>
                                 <Grid item xs={12} sm={5.9}>
                                    <TextField
                                       label='Public Phone Number'
                                       fullWidth
                                       value={profileState.phone}
                                       onChange={(e) => setProfileState({ ...profileState, phone: e.target.value })}
                                    />
                                 </Grid>
                                 <Grid item xs={12} sm={5.9} sx={{ mt: { xs: 3, sm: 0 } }}>
                                    <TextField
                                       label='Administrative Email'
                                       fullWidth
                                       value={clinic?.email}
                                       disabled
                                       helperText='Registered email cannot be changed'
                                    />
                                 </Grid>
                              </Grid>

                              <TextField
                                 label='Full Clinic Address'
                                 fullWidth
                                 multiline
                                 rows={isMobile ? 3 : 4}
                                 value={profileState.address}
                                 onChange={(e) => setProfileState({ ...profileState, address: e.target.value })}
                              />
                              <Doctors/>

                              <Box display='flex' justifyContent='flex-end' pt={2}>
                                 <Button
                                    type='submit'
                                    variant='contained'
                                    fullWidth={isMobile}
                                    startIcon={<Save size={20} />}
                                    disabled={updateProfile.isPending}
                                    sx={{ px: 5, height: 52, borderRadius: '12px', fontSize: '16px' }}>
                                    {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
                                 </Button>
                              </Box>
                           </Stack>
                        </form>
                     </Grid>
                  </Grid>
               </TabPanel>

               {/* Tab 1: PDF Templates */}
               <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={{ xs: 3, md: 4 }}>
                     <Grid item xs={12} md={4}>
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                           <Typography variant='h6' fontWeight='700' sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                              Design Templates
                           </Typography>
                           <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                              Select a visual style for your PDF exports.
                           </Typography>
                        </Box>

                        <Stack spacing={2} sx={{ maxHeight: { xs: 300, md: 600 }, overflowY: 'auto', pr: 1 }}>
                           {templates?.map((t: any) => {
                              const isDefault = clinic?.default_template_id === t._id;
                              const isPreviewing = previewTemplate?._id === t._id;

                              return (
                                 <Card
                                    key={t._id}
                                    elevation={0}
                                    onClick={() => setPreviewTemplate(t)}
                                    sx={{
                                       'cursor': 'pointer',
                                       'borderRadius': '16px',
                                       'border': '2px solid',
                                       'borderColor': isPreviewing ? 'primary.main' : '#E2E8F0',
                                       'bgcolor': isPreviewing ? '#F0F9FF' : 'white',
                                       'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                       '&:hover': {
                                          borderColor: isPreviewing ? 'primary.main' : '#CBD5E1',
                                          transform: 'translateY(-2px)'
                                       },
                                    }}>
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
                                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Box>
                                             <Typography variant='subtitle1' fontWeight='700' color={isPreviewing ? 'primary.main' : '#0F172A'} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                {t.template_name}
                                             </Typography>
                                             <Stack direction="row" spacing={1} mt={1}>
                                                {t.is_global && (
                                                   <Chip label="System" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 700, bgcolor: '#F1F5F9' }} />
                                                )}
                                                {isDefault && (
                                                   <Chip
                                                      icon={<CheckCircle2 size={10} color="#166534" />}
                                                      label="Active"
                                                      size="small"
                                                      sx={{ height: 18, fontSize: '9px', fontWeight: 700, bgcolor: '#DCFCE7', color: '#166534' }}
                                                   />
                                                )}
                                             </Stack>
                                          </Box>
                                          {!isDefault && isPreviewing && (
                                             <Button
                                                size='small'
                                                variant='contained'
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   setDefaultTemplate.mutate(t._id);
                                                }}
                                                disabled={setDefaultTemplate.isPending}
                                                sx={{ borderRadius: '8px', textTransform: 'none', px: 1.5, fontSize: '0.75rem' }}>
                                                Set Default
                                             </Button>
                                          )}
                                       </Box>
                                    </CardContent>
                                 </Card>
                              );
                           })}
                        </Stack>
                     </Grid>

                     <Grid item xs={12} md={8}>
                        <Box sx={{
                           bgcolor: '#F1F5F9',
                           borderRadius: '24px',
                           border: '1px solid #E2E8F0',
                           height: { xs: 400, sm: 560, md: 720, lg: 820 },
                           display: 'flex',
                           flexDirection: 'column',
                           overflow: 'hidden'
                        }}>
                           <Box sx={{
                              px: 2,
                              py: 1.5,
                              bgcolor: 'white',
                              borderBottom: '1px solid #E2E8F0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                           }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                 <Eye size={14} color="#64748B" />
                                 <Typography variant='caption' fontWeight='700' color='#64748B' sx={{ letterSpacing: '1px', fontSize: '9px' }}>
                                    PREVIEW MODE
                                 </Typography>
                              </Stack>
                              {previewTemplate && (
                                 <Typography variant='subtitle2' color='primary' fontWeight='800' sx={{ fontSize: '0.8rem' }}>
                                    {previewTemplate.template_name}
                                 </Typography>
                              )}
                           </Box>

                           <Box
                              ref={previewContainerRef}
                              sx={{
                                 flexGrow: 1,
                                 p: { xs: 1, sm: 3 },
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 bgcolor: '#E2E8F0',
                                 overflow: 'hidden',
                              }}>
                              {previewTemplate ? (
                                 isMobile ? (
                                    <Box
                                       sx={{
                                          width: `min(100%, ${scaledPreviewWidth}px)`,
                                          height: `min(100%, ${scaledPreviewHeight}px)`,
                                          position: 'relative',
                                          overflow: 'hidden',
                                       }}>
                                       <Paper
                                          elevation={4}
                                          sx={{
                                             width: previewFrameSize.width,
                                             height: previewFrameSize.height,
                                             position: 'absolute',
                                             top: 0,
                                             left: '50%',
                                             borderRadius: '8px',
                                             overflow: 'hidden',
                                             backgroundColor: 'white',
                                             transform: `translateX(-50%) scale(${previewScale})`,
                                             transformOrigin: 'top center',
                                          }}>
                                          <iframe
                                             title={`template-preview-${previewTemplate._id}`}
                                             srcDoc={previewTemplate.html_content}
                                             onLoad={handlePreviewLoad}
                                             style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: 'white' }}
                                          />
                                       </Paper>
                                    </Box>
                                 ) : (
                                    <Paper
                                       elevation={4}
                                       sx={{
                                          width: '100%',
                                          height: '100%',
                                          borderRadius: '8px',
                                          overflow: 'hidden',
                                          backgroundColor: 'white',
                                       }}>
                                       <iframe
                                          title={`template-preview-${previewTemplate._id}`}
                                          srcDoc={previewTemplate.html_content}
                                          style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: 'white' }}
                                       />
                                    </Paper>
                                 )
                              ) : (
                                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                                    <FileText size={48} />
                                    <Typography mt={2} variant="body2">Select a template</Typography>
                                 </Box>
                              )}
                           </Box>
                        </Box>
                     </Grid>
                  </Grid>
               </TabPanel>

               {/* Tab 2: Security */}
               <TabPanel value={tabValue} index={2}>
                  <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                     <Typography variant='h6' fontWeight='700' gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                        Security & Credentials
                     </Typography>
                     <Typography variant='body2' color='text.secondary' mb={{ xs: 3, md: 5 }} sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        Secure your account by maintaining a strong password. We recommend changing it every 90 days.
                     </Typography>

                     <form onSubmit={handlePasswordSubmit}>
                        <Stack spacing={{ xs: 3, md: 4 }}>
                           <TextField
                              label='Current Access Password'
                              type='password'
                              fullWidth
                              value={passwordState.current_password}
                              onChange={(e) => setPasswordState({ ...passwordState, current_password: e.target.value })}
                              required
                           />

                           <Divider>
                              <Chip label="NEW CREDENTIALS" size="small" sx={{ fontSize: '9px', fontWeight: 700, bgcolor: '#F8FAFC' }} />
                           </Divider>

                           <Stack spacing={3}>
                              <TextField
                                 label='New Secure Password'
                                 type='password'
                                 fullWidth
                                 value={passwordState.new_password}
                                 onChange={(e) => setPasswordState({ ...passwordState, new_password: e.target.value })}
                                 required
                              />
                              <TextField
                                 label='Verify New Password'
                                 type='password'
                                 fullWidth
                                 value={passwordState.confirm_password}
                                 onChange={(e) => setPasswordState({ ...passwordState, confirm_password: e.target.value })}
                                 required
                              />
                           </Stack>

                           <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              fullWidth={isMobile}
                              disabled={changePassword.isPending}
                              sx={{ py: 2, mt: 2, borderRadius: '12px', fontSize: '16px', fontWeight: '700' }}>
                              {changePassword.isPending ? 'Updating...' : 'Update Credentials'}
                           </Button>
                        </Stack>
                     </form>
                  </Box>
               </TabPanel>
            </Box>
         </Card>
      </Box>
   );
}

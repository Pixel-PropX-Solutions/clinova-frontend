'use client';

import React, { useState } from 'react';
import {
   Box,
   Button,
   Typography,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   CircularProgress,
   IconButton,
   Avatar,
   Grid,
   Divider,
   Stack,
   Card,
   Chip,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { 
   Plus, 
   Eye, 
   ShieldAlert, 
   CheckCircle2, 
   Camera, 
   TrendingUp, 
   Users, 
   IndianRupee,
   Building2,
   Phone,
   Mail,
   MapPin,
   ChevronRight,
   Calendar1Icon,
} from 'lucide-react';
import { useClinics, useCreateClinic, useUpdateClinic, useClinicStats, useUploadClinicLogo } from '@/hooks/api/useClinics';
import { toast } from 'react-toastify';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
   LineChart,
   Line,
   AreaChart,
   Area,
} from 'recharts';
import { format } from 'date-fns';

export default function ClinicsPage() {
   const { data: clinics, isLoading } = useClinics();
   const createClinic = useCreateClinic();
   const updateClinic = useUpdateClinic();
   const uploadLogo = useUploadClinicLogo();

   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

   const [open, setOpen] = useState(false);
   const [detailsOpen, setDetailsOpen] = useState(false);
   const [selectedClinic, setSelectedClinic] = useState<any>(null);
   
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      logo_url: '',
      plan: 'premium',
   });

   const handleClose = () => {
      setOpen(false);
      setSelectedClinic(null);
   };

   const handleDetailsClose = () => {
      setDetailsOpen(false);
      setSelectedClinic(null);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, clinicId?: string) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         if (clinicId) {
            uploadLogo.mutate({ id: clinicId, file });
         } else {
            toast.info("Please create the clinic first, then upload the logo from details.");
         }
      }
   };

   const handleCreate = () => {
      createClinic.mutate(formData, {
         onSuccess: () => {
            handleClose();
            setFormData({
               name: '',
               phone: '',
               email: '',
               address: '',
               logo_url: '',
               plan: 'premium',
            });
         },
      });
   };

   const handleToggleStatus = (clinic: any) => {
      updateClinic.mutate({
         id: clinic._id,
         data: { is_active: !clinic.is_active }
      });
   };

   return (
      <Box maxWidth="xl" mx="auto">
         <Box
            display='flex'
            justifyContent='space-between'
            alignItems='flex-start'
            mb={{ xs: 3, md: 5 }}
            flexWrap="wrap"
            gap={3}>
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
               <Typography
                  variant='h4'
                  fontWeight='800'
                  color="primary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                  Clinic Governance
               </Typography>
               <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  High-level orchestration of multi-clinic operations and subscription tiers.
               </Typography>
            </Box>
            <Button
               variant='contained'
               fullWidth={false}
               startIcon={<Plus size={18} />}
               onClick={() => setOpen(true)}
               sx={{ 
                  borderRadius: '12px', 
                  height: 48, 
                  px: 3,
                  width: { xs: '100%', sm: 'auto' }
               }}>
               Provision New Clinic
            </Button>
         </Box>

         {isLoading ?
            <Box display="flex" justifyContent="center" py={10}>
               <CircularProgress thickness={4} />
            </Box>
         :  <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', overflow: 'hidden', border: '1px solid #E3EEF7' }}>
               <TableContainer>
                  <Table>
                      <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                         <TableRow>
                            <TableCell sx={{ fontWeight: '700', color: '#64748B', py: 2 }}>FACILITY</TableCell>
                            {!isTablet && <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>INFRASTRUCTURE</TableCell>}
                            {!isMobile && <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>LOCATION</TableCell>}
                            <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>TIER</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>STATUS</TableCell>
                            <TableCell align='right' sx={{ fontWeight: '700', color: '#64748B' }}>ACTIONS</TableCell>
                         </TableRow>
                      </TableHead>
                      <TableBody>
                         {Array.isArray(clinics) && clinics.length > 0 ?
                            clinics.map((clinic: any) => (
                               <TableRow key={clinic._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell>
                                     <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar 
                                           src={clinic.logo_url} 
                                           sx={{ 
                                              bgcolor: '#F1F5F9', 
                                              color: '#2F5FA5', 
                                              fontWeight: 'bold',
                                              width: { xs: 32, sm: 40 },
                                              height: { xs: 32, sm: 40 },
                                              fontSize: { xs: '0.9rem', sm: '1rem' }
                                           }}>
                                           {clinic.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                           <Typography variant='subtitle2' fontWeight='700' color="#0F172A" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                              {clinic.name}
                                           </Typography>
                                           {isTablet && <Typography variant="caption" color="textSecondary">{clinic.phone}</Typography>}
                                        </Box>
                                     </Stack>
                                  </TableCell>
                                  {!isTablet && <TableCell>
                                     <Typography variant="body2" color="#0F172A" fontWeight="600">{clinic.email}</Typography>
                                     <Typography variant="caption" color="textSecondary">{clinic.phone}</Typography>
                                  </TableCell>}
                                  {!isMobile && <TableCell>
                                     <Typography variant="body2" color="#475569" sx={{ maxWidth: 200 }} noWrap title={clinic.address}>
                                        {clinic.address}
                                     </Typography>
                                  </TableCell>}
                                  <TableCell>
                                     <Chip 
                                        label={clinic.plan} 
                                        size="small" 
                                        sx={{ 
                                           textTransform: 'uppercase', 
                                           fontWeight: 800, 
                                           fontSize: '9px',
                                           bgcolor: clinic.plan === 'premium' ? '#F0F7FF' : '#F1F5F9',
                                           color: clinic.plan === 'premium' ? '#2F5FA5' : '#64748B',
                                           height: 20
                                        }} 
                                     />
                                  </TableCell>
                                 <TableCell>
                                    {clinic.is_active ? 
                                       <Chip 
                                          icon={<CheckCircle2 size={12} />} 
                                          label="Operational" 
                                          size="small" 
                                          sx={{ bgcolor: '#DCFCE7', color: '#166534', fontWeight: 700, fontSize: '11px' }} 
                                       /> : 
                                       <Chip 
                                          icon={<ShieldAlert size={12} />} 
                                          label="Restricted" 
                                          size="small" 
                                          sx={{ bgcolor: '#FEF2F2', color: '#991B1B', fontWeight: 700, fontSize: '11px' }} 
                                       />
                                    }
                                 </TableCell>
                                 <TableCell align='right'>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                       <IconButton 
                                          color="primary" 
                                          size="small"
                                          onClick={() => {
                                             setSelectedClinic(clinic);
                                             setDetailsOpen(true);
                                          }}
                                          sx={{ bgcolor: '#F1F5F9' }}
                                       >
                                          <Eye size={16} />
                                       </IconButton>
                                       <IconButton 
                                          color={clinic.is_active ? "error" : "success"}
                                          size="small"
                                          onClick={() => handleToggleStatus(clinic)}
                                          title={clinic.is_active ? "Restrict Clinic" : "Restore Clinic"}
                                          sx={{ bgcolor: clinic.is_active ? '#FEF2F2' : '#F0FDF4' }}
                                       >
                                          {clinic.is_active ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                                       </IconButton>
                                    </Stack>
                                 </TableCell>
                              </TableRow>
                           ))
                        :  <TableRow>
                              <TableCell colSpan={6} align='center' sx={{ py: 10 }}>
                                 <Box sx={{ opacity: 0.2, mb: 2 }}>
                                    <Building2 size={64} />
                                 </Box>
                                 <Typography variant='h6' color='text.secondary' fontWeight="700">No Clinics Operational</Typography>
                                 <Typography variant='body2' color='text.secondary'>Initiate your first clinic deployment to begin operations.</Typography>
                              </TableCell>
                           </TableRow>
                        }
                     </TableBody>
                  </Table>
               </TableContainer>
            </Card>
         }

         {/* Provisioning Dialog */}
          <Dialog
             open={open}
             onClose={handleClose}
             fullWidth
             maxWidth='sm'
             fullScreen={isMobile}
             PaperProps={{ sx: { borderRadius: isMobile ? 0 : '24px', p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>Provision New Clinic Instance</DialogTitle>
            <DialogContent>
               <Typography variant="body2" color="textSecondary" mb={3}>Deploy a fresh Clinova instance for a new medical facility. All default parameters will be initialized.</Typography>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        autoFocus
                        name='name'
                        label='Facility Designation'
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        name='email'
                        label='Administrative Email'
                        type='email'
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{ sx: { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        name='phone'
                        label='Primary Contact Vector'
                        fullWidth
                        value={formData.phone}
                        onChange={handleChange}
                        InputProps={{ sx: { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        name='address'
                        label='Geospatial Coordinates / Address'
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        InputProps={{ sx: { borderRadius: '12px' } }}
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
               <Button onClick={handleClose} sx={{ color: '#64748B', fontWeight: 700 }}>Cancel</Button>
               <Button
                  onClick={handleCreate}
                  variant='contained'
                  disabled={createClinic.isPending}
                  sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}>
                  {createClinic.isPending ? <CircularProgress size={24} color="inherit" /> : 'Deploy Instance'}
               </Button>
            </DialogActions>
         </Dialog>

         {/* Insights Dialog */}
         <ClinicDetailsDialog 
            open={detailsOpen} 
            onClose={handleDetailsClose} 
            clinic={selectedClinic} 
            onLogoUpload={handleLogoUpload}
            isUploading={uploadLogo.isPending}
         />
      </Box>
   );
}

 function ClinicDetailsDialog({ open, onClose, clinic, onLogoUpload, isUploading }: any) {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const { data: stats, isLoading } = useClinicStats(clinic?._id);
 
   if (!clinic) return null;
 
   return (
      <Dialog 
         open={open} 
         onClose={onClose} 
         fullWidth 
         maxWidth='md' 
         fullScreen={isMobile}
         PaperProps={{ sx: { borderRadius: { xs: 0, sm: '30px' }, p: { xs: 0, sm: 1 } } }}
      >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0, pt: { xs: 3, sm: 2 } }}>
             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems="center" textAlign={{ xs: 'center', sm: 'left' }} sx={{ width: '100%' }}>
                <Box position="relative">
                   <Avatar src={clinic?.logo_url} sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', border: '4px solid white', mx: 'auto' }}>
                      {clinic?.name?.charAt(0)}
                   </Avatar>
                   <label htmlFor="logo-upload-details">
                      <input
                         accept="image/*"
                         style={{ display: 'none' }}
                         id="logo-upload-details"
                         type="file"
                         onChange={(e) => onLogoUpload(e, clinic._id)}
                      />
                      <IconButton
                         size="small"
                         component="span"
                         sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: isMobile ? 'calc(50% - 35px)' : 0,
                            bgcolor: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: '#F8FAFC' }
                         }}
                      >
                         <Camera size={14} />
                      </IconButton>
                   </label>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                   <Typography variant={isMobile ? "h6" : "h5"} fontWeight="800" color="#0F172A">{clinic.name}</Typography>
                   <Typography variant="body2" color="text.secondary" fontWeight="600">{clinic.email}</Typography>
                   <Chip 
                      label={clinic.plan} 
                      size="small" 
                      sx={{ mt: 1, textTransform: 'uppercase', fontSize: '10px', fontWeight: 800, bgcolor: '#F0F7FF', color: '#2F5FA5' }} 
                   />
                </Box>
             </Stack>
             {isUploading && <CircularProgress size={20} />}
          </DialogTitle>
         <DialogContent sx={{ mt: { xs: 2, sm: 4 } }}>
            {isLoading ? (
               <Box display="flex" justifyContent="center" p={10}><CircularProgress thickness={4} /></Box>
            ) : (
               <Grid container spacing={{ xs: 2, sm: 4 }}>
                  {/* Performance Indicators */}
                  <Grid item xs={12} sm={4}>
                     <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: '20px', bgcolor: '#F8FAFC', border: '1px solid #E3EEF7' }}>
                        <Users size={20} color="#2F5FA5" style={{ marginBottom: '8px' }} />
                        <Typography variant="h4" fontWeight="800" color="#2F5FA5" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>{stats?.summary?.total_patients || 0}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700">PATIENTS</Typography>
                     </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                     <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: '20px', bgcolor: '#F8FAFC', border: '1px solid #E3EEF7' }}>
                        <TrendingUp size={20} color="#5CC6C4" style={{ marginBottom: '8px' }} />
                        <Typography variant="h5" fontWeight="800" color="#5CC6C4" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{stats?.summary?.total_visits || 0}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700">VISITS</Typography>
                     </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                     <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: '20px', bgcolor: '#F8FAFC', border: '1px solid #E3EEF7' }}>
                        <Calendar1Icon size={20} color="#F59E0B" style={{ marginBottom: '8px' }} />
                        <Typography variant="h5" fontWeight="800" color="#92400E" sx={{ minHeight: { xs: '30px', sm: '36px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                           {stats?.summary?.last_use ? format(new Date(stats.summary.last_use), 'MMM dd') : 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700">ACTIVITY</Typography>
                     </Card>
                  </Grid>
 
                  {/* Revenue Visualization */}
                  <Grid item xs={12}>
                     <Typography variant="subtitle1" fontWeight="800" color="#0F172A" mb={3}>Fiscal Trajectory (₹)</Typography>
                     <Box sx={{ height: { xs: 200, sm: 250 } }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={stats?.charts?.revenue || []}>
                              <defs>
                                 <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2F5FA5" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#2F5FA5" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                              <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                              <Area type="monotone" dataKey="revenue" stroke="#2F5FA5" strokeWidth={3} fill="url(#colorAdminRev)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </Box>
                  </Grid>
 
                  {/* Infrastructure Metadata */}
                  <Grid item xs={12}>
                     <Divider sx={{ my: 1, borderColor: '#F1F5F9' }} />
                     <Typography variant="subtitle1" fontWeight="800" color="#0F172A" my={3}>Infrastructure Metadata</Typography>
                     <Grid container spacing={{ xs: 2, sm: 4 }}>
                        <Grid item xs={12} sm={6}>
                           <Stack direction="row" spacing={2}>
                              <Box sx={{ p: 1, bgcolor: '#F1F5F9', borderRadius: '10px' }}><MapPin size={18} color="#64748B" /></Box>
                              <Box>
                                 <Typography variant="caption" color="text.secondary" fontWeight="700">ADDRESS</Typography>
                                 <Typography variant="body2" fontWeight="600" color="#1E293B">{clinic.address || 'N/A'}</Typography>
                              </Box>
                           </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                           <Stack direction="row" spacing={2}>
                              <Box sx={{ p: 1, bgcolor: '#F1F5F9', borderRadius: '10px' }}><Phone size={18} color="#64748B" /></Box>
                              <Box>
                                 <Typography variant="caption" color="text.secondary" fontWeight="700">PHONE</Typography>
                                 <Typography variant="body2" fontWeight="600" color="#1E293B">{clinic.phone || 'N/A'}</Typography>
                              </Box>
                           </Stack>
                        </Grid>
                     </Grid>
                  </Grid>
               </Grid>
            )}
         </DialogContent>
         <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '12px', px: 4, fontWeight: 700, borderColor: '#E3EEF7', width: { xs: '100%', sm: 'auto' } }}>Dismiss</Button>
         </DialogActions>
      </Dialog>
   );
}

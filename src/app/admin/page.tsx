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
} from '@mui/material';
import { Add, Visibility, Block, CheckCircle, PhotoCamera, TrendingUp, PeopleOutline, AttachMoney } from '@mui/icons-material';
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
} from 'recharts';
import { format } from 'date-fns';

export default function ClinicsPage() {
   const { data: clinics, isLoading } = useClinics();
   const createClinic = useCreateClinic();
   const updateClinic = useUpdateClinic();
   const uploadLogo = useUploadClinicLogo();

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
            // For new clinic, we'll need to store the file or upload first
            // For now, let's keep it simple and only allow logo upload for existing clinics
            // or just use the URL for new ones as before.
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
      <Box>
         <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={4}>
            <Typography
               variant='h4'
               fontWeight='bold'>
               Manage Clinics
            </Typography>
            <Button
               variant='contained'
               startIcon={<Add />}
               onClick={() => setOpen(true)}>
               Add Clinic
            </Button>
         </Box>

         {isLoading ?
            <CircularProgress />
         :  <TableContainer
               component={Paper}
               elevation={2}
               sx={{ borderRadius: 2 }}>
               <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                     <TableRow>
                        <TableCell>
                           <b>Name</b>
                        </TableCell>
                        <TableCell>
                           <b>Email</b>
                        </TableCell>
                        <TableCell>
                           <b>Phone</b>
                        </TableCell>
                        <TableCell>
                           <b>Address</b>
                        </TableCell>
                        <TableCell>
                           <b>Plan</b>
                        </TableCell>
                        <TableCell>
                           <b>Status</b>
                        </TableCell>
                        <TableCell align='right'>
                           <b>Actions</b>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {Array.isArray(clinics) && clinics.length > 0 ?
                        clinics.map((clinic: any) => (
                           <TableRow key={clinic._id}>
                              <TableCell>{clinic.name}</TableCell>
                              <TableCell>{clinic.email}</TableCell>
                              <TableCell>{clinic.phone}</TableCell>
                              <TableCell>{clinic.address}</TableCell>
                              <TableCell sx={{ textTransform: 'capitalize' }}>
                                 {clinic.plan}
                              </TableCell>
                              <TableCell>
                                 {clinic.is_active ? 
                                    <Typography color="success.main" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                       <CheckCircle fontSize="small" /> Active
                                    </Typography> : 
                                    <Typography color="error.main" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                       <Block fontSize="small" /> Restricted
                                    </Typography>
                                 }
                              </TableCell>
                              <TableCell align='right'>
                                 <IconButton 
                                    color="primary" 
                                    size="small"
                                    onClick={() => {
                                       setSelectedClinic(clinic);
                                       setDetailsOpen(true);
                                    }}
                                 >
                                    <Visibility fontSize="small" />
                                 </IconButton>
                                 <IconButton 
                                    color={clinic.is_active ? "error" : "success"}
                                    size="small"
                                    onClick={() => handleToggleStatus(clinic)}
                                    title={clinic.is_active ? "Restrict Account" : "Activate Account"}
                                 >
                                    {clinic.is_active ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))
                     :  <TableRow>
                           <TableCell
                              colSpan={7}
                              align='center'>
                              No clinics found.
                           </TableCell>
                        </TableRow>
                     }
                  </TableBody>
               </Table>
            </TableContainer>
         }

         {/* Add Clinic Dialog */}
         <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='sm'>
            <DialogTitle>Add New Clinic</DialogTitle>
            <DialogContent dividers>
               <TextField
                  autoFocus
                  margin='dense'
                  name='name'
                  label='Clinic Name'
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
               />
               <TextField
                  margin='dense'
                  name='email'
                  label='Email Address'
                  type='email'
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
               />
               <TextField
                  margin='dense'
                  name='phone'
                  label='Phone Number'
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
               />
               <TextField
                  margin='dense'
                  name='address'
                  label='Address'
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
               />
               <TextField
                  margin='dense'
                  name='logo_url'
                  label='Logo URL'
                  fullWidth
                  value={formData.logo_url}
                  onChange={handleChange}
                  helperText='Direct link to clinic logo image'
               />
               <TextField
                  margin='dense'
                  name='plan'
                  label='Subscription Plan'
                  fullWidth
                  value={formData.plan}
                  onChange={handleChange}
                  helperText='e.g., standard, premium'
               />
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleClose}
                  color='inherit'>
                  Cancel
               </Button>
               <Button
                  onClick={handleCreate}
                  variant='contained'
                  disabled={createClinic.isPending}>
                  {createClinic.isPending ?
                     <CircularProgress size={24} />
                  :  'Create'}
               </Button>
            </DialogActions>
         </Dialog>

         {/* Clinic Details Dialog */}
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
   const { data: stats, isLoading } = useClinicStats(clinic?._id);

   if (!clinic) return null;

   return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap={2}>
               <Box position="relative">
                  <Avatar src={clinic?.logo_url} sx={{ width: 50, height: 50 }}>
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
                           bottom: -5,
                           right: -5,
                           bgcolor: 'white',
                           boxShadow: 1,
                           '&:hover': { bgcolor: 'grey.100' }
                        }}
                     >
                        <PhotoCamera sx={{ fontSize: 14 }} />
                     </IconButton>
                  </label>
               </Box>
               <Box>
                  <Typography variant="h6">{clinic.name} Profile</Typography>
                  <Typography variant="caption" color="text.secondary">{clinic.email}</Typography>
               </Box>
            </Box>
            {isUploading && <CircularProgress size={20} />}
         </DialogTitle>
         <DialogContent dividers>
            {isLoading ? (
               <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
            ) : (
               <Grid container spacing={3}>
                  {/* Summary Cards */}
                  <Grid item xs={12} sm={4}>
                     <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <PeopleOutline color="primary" sx={{ mb: 1 }} />
                        <Typography variant="h6">{stats?.summary?.total_patients || 0}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Patients</Typography>
                     </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <TrendingUp color="secondary" sx={{ mb: 1 }} />
                        <Typography variant="h6">{stats?.summary?.total_visits || 0}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Visits</Typography>
                     </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <AttachMoney color="success" sx={{ mb: 1 }} />
                        <Typography variant="h6">
                           {stats?.summary?.last_use ? format(new Date(stats.summary.last_use), 'MMM dd, yyyy') : 'Never'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Last Activity</Typography>
                     </Paper>
                  </Grid>

                  {/* Revenue Chart */}
                  <Grid item xs={12} md={6}>
                     <Typography variant="subtitle2" fontWeight="bold" mb={1}>Revenue Trend (₹)</Typography>
                     <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={stats?.charts?.revenue || []}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} />
                              <Tooltip />
                              <Bar dataKey="revenue" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </Box>
                  </Grid>

                  {/* Patients Chart */}
                  <Grid item xs={12} md={6}>
                     <Typography variant="subtitle2" fontWeight="bold" mb={1}>Patient Growth</Typography>
                     <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={stats?.charts?.patients || []}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} />
                              <Tooltip />
                              <Line type="monotone" dataKey="count" stroke="#f50057" strokeWidth={2} />
                           </LineChart>
                        </ResponsiveContainer>
                     </Box>
                  </Grid>

                  {/* Details List */}
                  <Grid item xs={12}>
                     <Divider sx={{ my: 1 }} />
                     <Typography variant="subtitle2" fontWeight="bold" mb={2}>Clinic Details</Typography>
                     <Grid container spacing={2}>
                        <Grid item xs={6}>
                           <Typography variant="caption" color="text.secondary">Address</Typography>
                           <Typography variant="body2">{clinic.address || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" color="text.secondary">Phone</Typography>
                           <Typography variant="body2">{clinic.phone || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" color="text.secondary">Plan</Typography>
                           <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{clinic.plan}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" color="text.secondary">Account Status</Typography>
                           <Typography variant="body2" color={clinic.is_active ? 'success.main' : 'error.main'}>
                              {clinic.is_active ? 'Active' : 'Restricted'}
                           </Typography>
                        </Grid>
                     </Grid>
                  </Grid>
               </Grid>
            )}
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose}>Close</Button>
         </DialogActions>
      </Dialog>
   );
}

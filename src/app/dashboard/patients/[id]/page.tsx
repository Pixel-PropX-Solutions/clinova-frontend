'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
   Box,
   Backdrop,
   Typography,
   Paper,
   Grid,
   CircularProgress,
   Chip,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Button,
   Divider,
   Avatar,
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Stack,
   Card,
   useTheme,
   useMediaQuery,
} from '@mui/material';
import {
   ChevronLeft,
   Phone,
   User,
   Calendar,
   MapPin,
   CreditCard,
   Stethoscope,
   Printer,
   Trash2,
   TrendingUp,
   Wallet,
   History,
} from 'lucide-react';
import { usePatientProfile } from '@/hooks/api/usePatients';
import { useDeleteVisit } from '@/hooks/api/useVisits';
import { generatePDF } from '@/hooks/api/usePDF';
import { format } from 'date-fns';
import { useClinicProfile } from '@/hooks/api/useSettings';
import BackDropLoading from '@/container/BackdropLoader';

export default function PatientProfilePage() {
   const params = useParams();
   const router = useRouter();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
   const [isNavigating, startNavigation] = React.useTransition();
   const patientId = params?.id as string;
   const { data: clinic } = useClinicProfile();
   const { data, isLoading } = usePatientProfile(patientId);
   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
   const [visitToDelete, setVisitToDelete] = React.useState<string | null>(null);
   const deleteVisitMutation = useDeleteVisit();

   const handleDeleteClick = (visitId: string) => {
      setVisitToDelete(visitId);
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (visitToDelete) {
         await deleteVisitMutation.mutateAsync(visitToDelete);
         setDeleteDialogOpen(false);
         setVisitToDelete(null);
      }
   };

   const handlePrintParchi = (visitId: string) => {
      generatePDF(visitId, clinic?.default_template_id, `parchi_${visitId}.pdf`);
   };

   const handleNavigateBack = () => {
      startNavigation(() => {
         router.push('/dashboard/patients');
      });
   };

   if (isLoading) {
      return (
         <Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
            <CircularProgress thickness={4} />
         </Box>
      );
   }

   if (!data || !data.patient) {
      return (
         <Box textAlign='center' mt={10} sx={{ p: 4 }}>
            <Backdrop
               open={isNavigating}
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2000 }}>
               <CircularProgress color='inherit' />
            </Backdrop>
            <Box sx={{ bgcolor: '#F1F5F9', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
               <User size={40} color="#94A3B8" />
            </Box>
            <Typography variant='h5' fontWeight="700" gutterBottom>Patient Not Found</Typography>
            <Typography color='text.secondary' mb={4}>The patient you are looking for does not exist or has been removed.</Typography>
            <Button
               variant='contained'
               startIcon={<ChevronLeft size={18} />}
               onClick={handleNavigateBack}
               disabled={isNavigating}
               sx={{ borderRadius: '12px', px: 4 }}>
               Back to Directory
            </Button>
         </Box>
      );
   }

   const { patient, visits, total_fees, total_visits } = data;

   return (
      <Box maxWidth='xl' mx='auto'>
         <BackDropLoading isLoading={isNavigating} />

         {/* Navigation */}
         <Button
            startIcon={<ChevronLeft size={18} />}
            onClick={handleNavigateBack}
            disabled={isNavigating}
            sx={{ mb: 3, color: '#64748B', fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}>
            Back to Patient Directory
         </Button>

         {/* Patient Header Card */}
         <Card sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            mb: 4,
            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)',
            border: '1px solid #E3EEF7',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
         }}>
            <Grid container spacing={{ xs: 3, md: 4 }} alignItems='center'>
               <Grid item xs={12} sm="auto" sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Avatar
                     sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        background: 'linear-gradient(135deg, #2F5FA5 0%, #5CC6C4 100%)',
                        fontSize: { xs: 28, sm: 36 },
                        fontWeight: '800',
                        boxShadow: '0 10px 20px rgba(47, 95, 165, 0.2)',
                        border: '4px solid white'
                     }}>
                     {patient.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
               </Grid>
               <Grid item xs={12} sm>
                  <Stack
                     direction={{ xs: 'column', sm: 'row' }}
                     spacing={2}
                     alignItems={{ xs: 'center', sm: 'center' }}
                     textAlign={{ xs: 'center', sm: 'left' }}
                  >
                     <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight='800' color="#0F172A">
                        {patient.name?.charAt(0)?.toUpperCase() + patient.name?.slice(1)}
                     </Typography>
                     {/* <Chip
                        label={`ID: ${patientId.substring(0, 8).toUpperCase()}`}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, borderRadius: '6px' }}
                     /> */}
                  </Stack>

                  <Grid container spacing={isMobile ? 1.5 : 3} mt={isMobile ? 1 : 1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                     <Grid item>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <Phone size={16} color="#64748B" />
                           <Typography variant='body1' fontWeight="600" color="#475569">{patient.phone}</Typography>
                        </Stack>
                     </Grid>
                     <Grid item>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <User size={16} color="#64748B" />
                           <Typography variant='body1' fontWeight="600" color="#475569">{patient.age} Yrs • {patient.gender}</Typography>
                        </Stack>
                     </Grid>
                     {patient.address && (
                        <Grid item xs={12} sm="auto">
                           <Stack direction="row" spacing={1} alignItems="center" flexWrap={'wrap'} justifyContent={{ xs: 'center', sm: 'flex-start', }}>
                              {!isMobile && <MapPin size={16} color="#64748B" />}
                              <Typography variant='body1' fontWeight="600" color="#475569">{patient.address}</Typography>
                           </Stack>
                        </Grid>
                     )}
                     <Grid item>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <Calendar size={16} color="#64748B" />
                           <Typography variant='body1' fontWeight="600" color="#475569">
                              Registered: {patient.first_visit_date ? format(new Date(patient.first_visit_date), 'dd MMM yyyy') : 'N/A'}
                           </Typography>
                        </Stack>
                     </Grid>
                  </Grid>
               </Grid>
               <Grid item xs={12} md="auto">
                  <Button
                     variant="contained"
                     fullWidth={isMobile}
                     startIcon={<Printer size={18} />}
                     sx={{ borderRadius: '12px', px: 3, height: 48 }}
                  >
                     Export Summary
                  </Button>
               </Grid>
            </Grid>
         </Card>

         {/* Insights Row */}
         <Grid container spacing={3} mb={5}>
            <Grid item xs={12} sm={4}>
               <Card sx={{ p: 3, borderRadius: '20px', borderLeft: '6px solid #2F5FA5', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                     <Box>
                        <Typography variant="h3" fontWeight="800" color="#2F5FA5">{total_visits}</Typography>
                        <Typography variant="body2" color="textSecondary" fontWeight="600">Total Encounters</Typography>
                     </Box>
                     <Box sx={{ p: 1.5, bgcolor: '#F0F7FF', borderRadius: '12px' }}>
                        <History size={24} color="#2F5FA5" />
                     </Box>
                  </Stack>
               </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
               <Card sx={{ p: 3, borderRadius: '20px', borderLeft: '6px solid #22C55E', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                     <Box>
                        <Typography variant="h3" fontWeight="800" color="#166534">₹{total_fees.toLocaleString()}</Typography>
                        <Typography variant="body2" color="textSecondary" fontWeight="600">Total Billables</Typography>
                     </Box>
                     <Box sx={{ p: 1.5, bgcolor: '#F0FDF4', borderRadius: '12px' }}>
                        <Wallet size={24} color="#166534" />
                     </Box>
                  </Stack>
               </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
               <Card sx={{ p: 3, borderRadius: '20px', borderLeft: '6px solid #F59E0B', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                     <Box>
                        <Typography variant="h3" fontWeight="800" color="#92400E">
                           {patient.last_visit_date ? format(new Date(patient.last_visit_date), 'dd MMM') : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" fontWeight="600">Most Recent Visit</Typography>
                     </Box>
                     <Box sx={{ p: 1.5, bgcolor: '#FFFBEB', borderRadius: '12px' }}>
                        <TrendingUp size={24} color="#92400E" />
                     </Box>
                  </Stack>
               </Card>
            </Grid>
         </Grid>

         {/* Visit History Section */}
         <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            sx={{ mb: 3 }}
         >
            <Typography variant='h5' fontWeight='800' color="#0F172A">
               Visit History
            </Typography>
            <Chip
               icon={<History size={14} />}
               label={`${visits?.length || 0} Records Found`}
               sx={{ fontWeight: 700, bgcolor: '#F1F5F9', color: '#64748B' }}
            />
         </Stack>

         {!isMobile ? (
            <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', overflow: 'hidden', border: '1px solid #E3EEF7' }}>
               <TableContainer>
                  <Table>
                     <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B', py: 2 }}>#</TableCell>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>VISIT DATE</TableCell>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>CLINICIAN</TableCell>
                           {!isTablet && <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>SPECIALTY</TableCell>}
                           <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>PRIMARY DIAGNOSIS</TableCell>
                           {!isTablet && <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>METHOD</TableCell>}
                           <TableCell align='right' sx={{ fontWeight: '700', color: '#64748B' }}>FEES</TableCell>
                           <TableCell align='right' sx={{ fontWeight: '700', color: '#64748B' }}>ACTIONS</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {visits && visits.length > 0 ?
                           visits.map((visit: any, index: number) => (
                              <TableRow key={visit.visit_id || index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                 <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>{visits.length - index}</TableCell>
                                 <TableCell>
                                    <Typography variant="body2" fontWeight="700" color="#0F172A">
                                       {visit.visited_at ? format(new Date(visit.visited_at), 'dd MMM yyyy') : 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                       {visit.visited_at ? format(new Date(visit.visited_at), 'hh:mm a') : ''}
                                    </Typography>
                                 </TableCell>
                                 <TableCell>
                                    <Typography variant="body2" fontWeight="600">Dr. {visit.dr_name || '-'}</Typography>
                                 </TableCell>
                                 {!isTablet && (
                                    <TableCell>
                                       <Chip
                                          label={visit.specialization || 'General'}
                                          size="small"
                                          sx={{ bgcolor: '#F1F5F9', fontSize: '11px', fontWeight: 600 }}
                                       />
                                    </TableCell>
                                 )}
                                 <TableCell sx={{ maxWidth: 200 }}>
                                    <Typography variant="body2" color="#475569" noWrap title={visit.disease || visit.diagnosis}>
                                       {visit.disease || visit.diagnosis || '-'}
                                    </Typography>
                                 </TableCell>
                                 {!isTablet && (
                                    <TableCell>
                                       <Stack direction="row" spacing={1} alignItems="center">
                                          {visit.payment_method === 'UPI' || visit.payment_method === 'Card' ? <CreditCard size={14} /> : <Wallet size={14} />}
                                          <Typography variant="body2" fontWeight="600">{visit.payment_method || 'Cash'}</Typography>
                                       </Stack>
                                    </TableCell>
                                 )}
                                 <TableCell align='right'>
                                    <Typography fontWeight='800' color="#0F172A" sx={{ fontSize: '1rem' }}>₹{visit.fees?.toLocaleString() || 0}</Typography>
                                 </TableCell>
                                 <TableCell align='right'>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                       <IconButton
                                          size='small'
                                          color='primary'
                                          onClick={() => handlePrintParchi(visit.visit_id)}
                                          sx={{ bgcolor: '#F0F7FF', '&:hover': { bgcolor: '#E0F2FE' } }}>
                                          <Printer size={16} />
                                       </IconButton>
                                       <IconButton
                                          size='small'
                                          color='error'
                                          onClick={() => handleDeleteClick(visit.visit_id)}
                                          sx={{ bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}>
                                          <Trash2 size={16} />
                                       </IconButton>
                                    </Stack>
                                 </TableCell>
                              </TableRow>
                           ))
                           : <TableRow>
                              <TableCell colSpan={8} align='center' sx={{ py: 10 }}>
                                 <Box sx={{ opacity: 0.2, mb: 2 }}>
                                    <Stethoscope size={64} />
                                 </Box>
                                 <Typography variant="h6" color='text.secondary' fontWeight="700">No Historical Records</Typography>
                                 <Typography variant="body2" color='text.secondary'>This patient has no registered visits yet.</Typography>
                              </TableCell>
                           </TableRow>
                        }
                     </TableBody>
                  </Table>
               </TableContainer>
            </Card>
         ) : (
            <Box>
               {visits && visits.length > 0 ? (
                  visits.map((visit: any, index: number) => (
                     <Card key={visit.visit_id || index} sx={{
                        p: 2.5,
                        mb: 2,
                        borderRadius: '20px',
                        border: '1px solid #E3EEF7',
                        boxShadow: '0 4px 15px rgba(15, 23, 42, 0.03)',
                        transition: 'transform 0.2s',
                        '&:active': { transform: 'scale(0.98)' }
                     }}>
                        <Stack spacing={2}>
                           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                 <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                    <Box sx={{
                                       width: 24,
                                       height: 24,
                                       borderRadius: '6px',
                                       bgcolor: '#F1F5F9',
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       fontSize: '11px',
                                       fontWeight: 700,
                                       color: '#64748B'
                                    }}>
                                       {visits.length - index}
                                    </Box>
                                    <Typography variant="body1" fontWeight="800" color="#0F172A">
                                       {visit.visited_at ? format(new Date(visit.visited_at), 'dd MMM yyyy') : 'N/A'}
                                    </Typography>
                                 </Stack>
                                 <Typography variant="caption" color="textSecondary" sx={{ ml: 4, display: 'block' }}>
                                    {visit.visited_at ? format(new Date(visit.visited_at), 'hh:mm a') : ''}
                                 </Typography>
                              </Box>
                              <Typography variant="h6" fontWeight="900" color="primary.main">
                                 ₹{visit.fees?.toLocaleString() || 0}
                              </Typography>
                           </Stack>

                           <Divider sx={{ borderStyle: 'dashed' }} />

                           <Grid container >
                              <Grid item xs={12}>
                                 <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '14px', fontWeight: 700 }}>
                                       {visit.dr_name?.charAt(0) || 'D'}
                                    </Avatar>
                                    <Box>
                                       <Typography variant="caption" color="textSecondary">Clinician</Typography>
                                       <Typography variant="body2" fontWeight="700">Dr. {visit.dr_name || '-'}</Typography>
                                    </Box>
                                 </Stack>
                              </Grid>

                              <Grid item xs={12}>
                                 <Box sx={{ bgcolor: '#F8FAFC', p: 1.5, borderRadius: '12px', mt: 1.5 }}>
                                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>Primary Diagnosis</Typography>
                                    <Typography variant="body2" color="#475569" fontWeight="600">
                                       {visit.disease || visit.diagnosis || 'No diagnosis recorded'}
                                    </Typography>
                                 </Box>
                              </Grid>

                              <Grid item xs={6} sx={{ mt: 1.5 }}>
                                 <Typography variant="caption" color="textSecondary" display="block" gutterBottom>Payment Method</Typography>
                                 <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ p: 0.5, bgcolor: '#F1F5F9', borderRadius: '6px', display: 'flex' }}>
                                       {visit.payment_method === 'UPI' || visit.payment_method === 'Card' ? <CreditCard size={14} /> : <Wallet size={14} />}
                                    </Box>
                                    <Typography variant="body2" fontWeight="700">{visit.payment_method || 'Cash'}</Typography>
                                 </Stack>
                              </Grid>

                              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1.5 }}>
                                 <Stack direction="row" spacing={1.5}>
                                    <IconButton
                                       onClick={() => handlePrintParchi(visit.visit_id)}
                                       sx={{ bgcolor: '#F0F7FF', color: 'primary.main', '&:hover': { bgcolor: '#E0F2FE' } }}>
                                       <Printer size={18} />
                                    </IconButton>
                                    <IconButton
                                       onClick={() => handleDeleteClick(visit.visit_id)}
                                       sx={{ bgcolor: '#FEF2F2', color: 'error.main', '&:hover': { bgcolor: '#FEE2E2' } }}>
                                       <Trash2 size={18} />
                                    </IconButton>
                                 </Stack>
                              </Grid>
                           </Grid>
                        </Stack>
                     </Card>
                  ))
               ) : (
                  <Card sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '1px solid #E3EEF7' }}>
                     <Box sx={{ opacity: 0.2, mb: 2 }}>
                        <Stethoscope size={48} />
                     </Box>
                     <Typography variant="h6" fontWeight="700">No Historical Records</Typography>
                     <Typography variant="body2" color='text.secondary'>This patient has no registered visits yet.</Typography>
                  </Card>
               )}
            </Box>
         )}

         {/* Delete Dialog */}
         <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
            <DialogContent>
               <DialogContentText sx={{ color: '#64748B' }}>
                  Are you sure you want to permanently delete this visit record? This clinical data will be lost and your analytics will be recalculated.
               </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
               <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700, color: '#64748B' }}>Cancel</Button>
               <Button
                  onClick={handleConfirmDelete}
                  color='error'
                  variant='contained'
                  disabled={deleteVisitMutation.isPending}
                  sx={{ borderRadius: '10px', px: 3, fontWeight: 700 }}>
                  {deleteVisitMutation.isPending ? 'Processing...' : 'Delete Record'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}

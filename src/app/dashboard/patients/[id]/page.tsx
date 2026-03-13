'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
   Box,
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
} from '@mui/material';
import {
   ArrowBack,
   Phone,
   Person,
   CalendarMonth,
   LocationOn,
   CurrencyRupee,
   MedicalServices,
   Print,
   Delete,
} from '@mui/icons-material';
import { usePatientProfile } from '@/hooks/api/usePatients';
import { useDeleteVisit } from '@/hooks/api/useVisits';
import { generatePDF } from '@/hooks/api/usePDF';
import { format } from 'date-fns';
import { useClinicProfile } from '@/hooks/api/useSettings';

export default function PatientProfilePage() {
   const params = useParams();
   const router = useRouter();
   const patientId = params?.id as string;
   const { data: clinic, isLoading: isClinicLoading } = useClinicProfile();
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
      console.log(visitId)
      generatePDF(visitId, clinic?.default_template_id, `parchi_${visitId}.pdf`);
   };

   if (isLoading) {
      return (
         <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            minHeight='60vh'>
            <CircularProgress />
         </Box>
      );
   }

   if (!data || !data.patient) {
      return (
         <Box
            textAlign='center'
            mt={10}>
            <Typography
               variant='h5'
               color='text.secondary'>
               Patient not found.
            </Typography>
            <Button
               sx={{ mt: 2 }}
               variant='outlined'
               startIcon={<ArrowBack />}
               onClick={() => router.push('/dashboard/patients/list')}>
               Back to List
            </Button>
         </Box>
      );
   }

   const { patient, visits, total_fees, total_visits } = data;

   return (
      <Box
         maxWidth='xl'
         mx='auto'>
         {/* Header */}
         <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/dashboard/patients/list')}
            sx={{ mb: 2 }}>
            Back to Patient List
         </Button>

         {/* Patient Info Card */}
         <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Grid
               container
               spacing={3}
               alignItems='center'>
               <Grid item>
                  <Avatar
                     sx={{
                        width: 72,
                        height: 72,
                        bgcolor: 'primary.main',
                        fontSize: 28,
                     }}>
                     {patient.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
               </Grid>
               <Grid
                  item
                  xs>
                  <Typography
                     variant='h4'
                     fontWeight='bold'>
                     {patient.name}
                  </Typography>
                  <Box
                     display='flex'
                     gap={3}
                     mt={1}
                     flexWrap='wrap'>
                     <Box
                        display='flex'
                        alignItems='center'
                        gap={0.5}>
                        <Phone
                           fontSize='small'
                           color='action'
                        />
                        <Typography
                           variant='body2'
                           color='text.secondary'>
                           {patient.phone}
                        </Typography>
                     </Box>
                     <Box
                        display='flex'
                        alignItems='center'
                        gap={0.5}>
                        <Person
                           fontSize='small'
                           color='action'
                        />
                        <Typography
                           variant='body2'
                           color='text.secondary'>
                           {patient.age} Yrs / {patient.gender}
                        </Typography>
                     </Box>
                     {patient.address && (
                        <Box
                           display='flex'
                           alignItems='center'
                           gap={0.5}>
                           <LocationOn
                              fontSize='small'
                              color='action'
                           />
                           <Typography
                              variant='body2'
                              color='text.secondary'>
                              {patient.address}
                           </Typography>
                        </Box>
                     )}
                     <Box
                        display='flex'
                        alignItems='center'
                        gap={0.5}>
                        <CalendarMonth
                           fontSize='small'
                           color='action'
                        />
                        <Typography
                           variant='body2'
                           color='text.secondary'>
                           Registered:{' '}
                           {patient.first_visit_date ?
                              format(
                                 new Date(patient.first_visit_date),
                                 'dd MMM yyyy',
                              )
                              : 'N/A'}
                        </Typography>
                     </Box>
                  </Box>
               </Grid>
            </Grid>
         </Paper>

         {/* Stats Row */}
         <Grid
            container
            spacing={2}
            mb={3}>
            <Grid
               item
               xs={12}
               sm={4}>
               <Paper
                  elevation={1}
                  sx={{
                     p: 2.5,
                     borderRadius: 2,
                     textAlign: 'center',
                     borderLeft: '4px solid',
                     borderColor: 'primary.main',
                  }}>
                  <Typography
                     variant='h3'
                     fontWeight='bold'
                     color='primary.main'>
                     {total_visits}
                  </Typography>
                  <Typography
                     variant='body2'
                     color='text.secondary'>
                     Total Visits
                  </Typography>
               </Paper>
            </Grid>
            <Grid
               item
               xs={12}
               sm={4}>
               <Paper
                  elevation={1}
                  sx={{
                     p: 2.5,
                     borderRadius: 2,
                     textAlign: 'center',
                     borderLeft: '4px solid',
                     borderColor: 'success.main',
                  }}>
                  <Typography
                     variant='h3'
                     fontWeight='bold'
                     color='success.main'>
                     ₹{total_fees.toLocaleString()}
                  </Typography>
                  <Typography
                     variant='body2'
                     color='text.secondary'>
                     Total Fees Paid
                  </Typography>
               </Paper>
            </Grid>
            <Grid
               item
               xs={12}
               sm={4}>
               <Paper
                  elevation={1}
                  sx={{
                     p: 2.5,
                     borderRadius: 2,
                     textAlign: 'center',
                     borderLeft: '4px solid',
                     borderColor: 'warning.main',
                  }}>
                  <Typography
                     variant='h3'
                     fontWeight='bold'
                     color='warning.main'>
                     {patient.last_visit_date ?
                        format(new Date(patient.last_visit_date), 'dd MMM')
                        : 'N/A'}
                  </Typography>
                  <Typography
                     variant='body2'
                     color='text.secondary'>
                     Last Visit
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         {/* Visits Table */}
         <Typography
            variant='h5'
            fontWeight='bold'
            mb={2}>
            Visit History
         </Typography>
         <Paper
            elevation={2}
            sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
               <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                     <TableRow>
                        <TableCell>
                           <b>#</b>
                        </TableCell>
                        <TableCell>
                           <b>Date</b>
                        </TableCell>
                        <TableCell>
                           <b>Doctor</b>
                        </TableCell>
                        <TableCell>
                           <b>Specialization</b>
                        </TableCell>
                        <TableCell>
                           <b>Disease / Diagnosis</b>
                        </TableCell>
                        <TableCell>
                           <b>Payment</b>
                        </TableCell>
                        <TableCell align='right'>
                           <b>Fees</b>
                        </TableCell>
                        <TableCell align='right'>
                           <b>Actions</b>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {visits && visits.length > 0 ?
                        visits.map((visit: any, index: number) => (
                           <TableRow
                              key={visit._id || visit.visit_id || `${visit.created_at || 'visit'}-${index}`}
                              hover>
                              <TableCell>{visits.length - index}</TableCell>
                              <TableCell>
                                 {visit.visited_at ?
                                    format(
                                       new Date(visit.visited_at),
                                       'dd MMM yyyy, hh:mm a',
                                    )
                                    : visit.created_at ?
                                       format(
                                          new Date(visit.created_at),
                                          'dd MMM yyyy, hh:mm a',
                                       )
                                       : 'N/A'}
                              </TableCell>
                              <TableCell>{visit.dr_name || '-'}</TableCell>
                              <TableCell>
                                 {visit.specialization || '-'}
                              </TableCell>
                              <TableCell>
                                 {visit.disease || visit.diagnosis || '-'}
                              </TableCell>
                              <TableCell>
                                 <Chip
                                    label={visit.payment_method || 'Cash'}
                                    size='small'
                                    variant='outlined'
                                    color={
                                       visit.payment_method === 'UPI' ?
                                          'secondary'
                                          : visit.payment_method === 'Card' ?
                                             'info'
                                             : 'default'
                                    }
                                 />
                              </TableCell>
                              <TableCell align='right'>
                                 <Typography fontWeight='bold'>
                                    ₹{visit.fees?.toLocaleString() || 0}
                                 </Typography>
                              </TableCell>
                              <TableCell align='right'>
                                 <Box
                                    display='flex'
                                    justifyContent='flex-end'
                                    gap={0.5}>
                                    <IconButton
                                       size='small'
                                       color='primary'
                                       onClick={() =>
                                          handlePrintParchi(visit.visit_id)
                                       }
                                       title='Print Parchi'>
                                       <Print fontSize='small' />
                                    </IconButton>
                                    <IconButton
                                       size='small'
                                       color='error'
                                       onClick={() =>
                                          handleDeleteClick(visit.visit_id)
                                       }
                                       title='Delete Visit'>
                                       <Delete fontSize='small' />
                                    </IconButton>
                                 </Box>
                              </TableCell>
                           </TableRow>
                        ))
                        : <TableRow>
                           <TableCell
                              colSpan={7}
                              align='center'
                              sx={{ py: 4 }}>
                              <MedicalServices
                                 sx={{ fontSize: 48, color: 'grey.300', mb: 1 }}
                              />
                              <Typography color='text.secondary'>
                                 No visits recorded yet for this patient.
                              </Typography>
                           </TableCell>
                        </TableRow>
                     }
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Are you sure you want to delete this visit record? This action
                  cannot be undone and will update the patient&apos;s visit history.
               </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
               <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
               <Button
                  onClick={handleConfirmDelete}
                  color='error'
                  variant='contained'
                  disabled={deleteVisitMutation.isPending}>
                  {deleteVisitMutation.isPending ? 'Deleting...' : 'Delete'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}

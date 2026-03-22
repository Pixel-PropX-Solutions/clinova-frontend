'use client';

import React, { useState } from 'react';
import {
   Box,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TablePagination,
   TableSortLabel,
   CircularProgress,
   Chip,
   Avatar,
   IconButton,
   TextField,
   InputAdornment,
   Card,
   Stack,
   Button,
   useTheme,
   useMediaQuery,
} from '@mui/material';
import {
   Search,
   Filter,
   ChevronRight,
   User,
   Calendar,
   MapPin,
   PlusCircle,
} from 'lucide-react';
import { usePatientsList } from '@/hooks/api/usePatients';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import BackDropLoading from '@/container/BackdropLoader';

export default function PatientListPage() {
   const router = useRouter();
   const theme = useTheme(); // Added
   const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Added
   const isTablet = useMediaQuery(theme.breakpoints.down('md')); // Added
   const [isNavigating, startNavigation] = React.useTransition();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [orderBy, setOrderBy] = useState('_id');
   const [order, setOrder] = useState<'asc' | 'desc'>('desc');
   const [searchQuery, setSearchQuery] = useState('');

   const { data, isLoading } = usePatientsList(
      page + 1,
      rowsPerPage,
      orderBy,
      order === 'desc',
   );

   const handleRequestSort = (property: string) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const handleNavigate = (path: string) => {
      startNavigation(() => {
         router.push(path);
      });
   };

   return (
      <Box maxWidth='xl' mx='auto'>
         <BackDropLoading isLoading={isNavigating} />

         <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
               <Typography variant='h4' fontWeight='800' color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                  Patient Directory
               </Typography>
               <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  Manage and view all registered patients in the system.
               </Typography>
            </Box>

            <Box sx={{ 
               display: 'flex', 
               gap: { xs: 1.5, sm: 2 }, 
               alignItems: 'center',
               width: { xs: '100%', md: 'auto' },
               flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
               <TextField
                  placeholder="Search patients..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Search size={18} color="#64748B" />
                        </InputAdornment>
                     ),
                     sx: {
                        borderRadius: '12px',
                        width: { xs: '100%', sm: '250px', md: '300px' },
                        bgcolor: 'white',
                        '& fieldset': { borderColor: '#E3EEF7' }
                     }
                  }}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
               />
               <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
                  <Button
                     variant='contained'
                     fullWidth
                     startIcon={<PlusCircle size={18} />}
                     onClick={() => handleNavigate('/dashboard/patients/new')}
                     disabled={isNavigating}
                     sx={{ borderRadius: '12px', height: 48, px: 3, whiteSpace: 'nowrap' }}
                  >
                     New Patient
                  </Button>
               </Stack>
            </Box>
         </Box>

         <Card sx={{ borderRadius: { xs: '16px', sm: '24px' }, boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 100px)' }}>
               <Table stickyHeader aria-label="patient list table">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: '700', color: '#64748B', py: { xs: 1.5, sm: 2 } }}>
                           <TableSortLabel
                              active={orderBy === 'name'}
                              direction={orderBy === 'name' ? order : 'asc'}
                              onClick={() => handleRequestSort('name')}>
                              PATIENT
                           </TableSortLabel>
                        </TableCell>
                        {!isMobile && (
                           <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: '700', color: '#64748B' }}>
                              CONTACT
                           </TableCell>
                        )}
                        {!isTablet && (
                           <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: '700', color: '#64748B' }}>
                              AGE / GENDER
                           </TableCell>
                        )}
                        <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: '700', color: '#64748B' }} align="center">
                           VISITS
                        </TableCell>
                        {!isMobile && (
                           <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: '700', color: '#64748B' }}>
                              LAST VISIT
                           </TableCell>
                        )}
                        <TableCell sx={{ bgcolor: '#F8FAFC' }} />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell colSpan={6} align='center' sx={{ py: 10 }}>
                              <CircularProgress size={40} thickness={4} />
                              <Typography variant="body2" color="textSecondary" mt={2}>Loading patients...</Typography>
                           </TableCell>
                        </TableRow>
                     ) : data?.items && data.items.length > 0 ? (
                        data.items.map((row: any) => (
                           <TableRow
                              hover
                              key={row._id}
                              onClick={() => handleNavigate(`/dashboard/patients/${row._id}`)}
                              sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                           >
                              <TableCell>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                                    <Avatar 
                                       sx={{ 
                                          bgcolor: '#F1F5F9', 
                                          color: '#2F5FA5', 
                                          fontWeight: 'bold',
                                          width: { xs: 32, sm: 40 },
                                          height: { xs: 32, sm: 40 },
                                          fontSize: { xs: '0.9rem', sm: '1rem' }
                                       }}>
                                       {row.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                       <Typography variant='subtitle2' fontWeight='700' color="#0F172A" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                          {row.name}
                                       </Typography>
                                       {row.phone && isMobile && (
                                          <Typography variant='caption' color='text.secondary'>
                                             {row.phone}
                                          </Typography>
                                       )}
                                       {row.address && !isMobile && (
                                          <Typography variant='caption' color='text.secondary' display='flex' alignItems="center" gap={0.5} noWrap sx={{ maxWidth: { sm: 150, md: 250 } }}>
                                             <MapPin size={10} /> {row.address}
                                          </Typography>
                                       )}
                                    </Box>
                                 </Box>
                              </TableCell>
                              {!isMobile && (
                                 <TableCell>
                                    <Typography variant="body2" color="textPrimary" fontWeight="500">
                                       {row.phone}
                                    </Typography>
                                 </TableCell>
                              )}
                              {!isTablet && (
                                 <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                       <Chip
                                          label={row.gender}
                                          size="small"
                                          sx={{
                                             fontSize: '10px',
                                             fontWeight: '700',
                                             height: 18,
                                             bgcolor: row.gender === 'Male' ? '#E0F2FE' : '#FCE7F3',
                                             color: row.gender === 'Male' ? '#0369A1' : '#BE185D'
                                          }}
                                       />
                                       <Typography variant="body2" color="textSecondary">
                                          {row.age} Y
                                       </Typography>
                                    </Stack>
                                 </TableCell>
                              )}

                              <TableCell align="center">
                                 <Chip
                                    label={row.visit_count}
                                    size='small'
                                    sx={{
                                       fontWeight: 'bold',
                                       minWidth: '28px',
                                       height: 20,
                                       fontSize: '11px',
                                       bgcolor: row.visit_count > 5 ? '#FEF3C7' : '#DCFCE7',
                                       color: row.visit_count > 5 ? '#92400E' : '#166534'
                                    }}
                                 />
                              </TableCell>
                              {!isMobile && (
                                 <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                       <Calendar size={14} color="#64748B" />
                                       <Typography variant="body2" color="textPrimary">
                                          {row.last_visit_date ? format(new Date(row.last_visit_date), 'dd MMM yyyy') : 'N/A'}
                                       </Typography>
                                    </Box>
                                 </TableCell>
                              )}
                              <TableCell align="right">
                                 <IconButton size="small">
                                    <ChevronRight size={18} color="#94A3B8" />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={6} align='center' sx={{ py: 10 }}>
                              <Box sx={{ opacity: 0.5, mb: 2 }} display='flex' justifyContent='center'>
                                 <User size={48} />
                              </Box>
                              <Typography variant='h6' color='text.secondary'>
                                 No Patients Found
                              </Typography>
                              <Typography variant='body2' color='text.secondary'>
                                 Try adjusting your search filters or register a new patient.
                              </Typography>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
            <TablePagination
               rowsPerPageOptions={[10, 25, 50]}
               component='div'
               count={data?.total || 0}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
               sx={{ borderTop: '1px solid #F1F5F9' }}
            />
         </Card>
      </Box>
   );
}

'use client';

import React, { useState } from 'react';
import {
   Box,
   Typography,
   Paper,
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
} from '@mui/material';
import { usePatientsList } from '@/hooks/api/usePatients';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function PatientListPage() {
   const router = useRouter();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [orderBy, setOrderBy] = useState('_id');
   const [order, setOrder] = useState<'asc' | 'desc'>('desc');

   const { data, isLoading } = usePatientsList(
      page + 1, // API usually expects 1-indexed pages
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

   return (
      <Box
         maxWidth='xl'
         mx='auto'>
         <Typography
            variant='h4'
            fontWeight='bold'
            mb={4}>
            Patient List
         </Typography>

         <Paper
            elevation={2}
            sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
               <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby='tableTitle'>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                     <TableRow>
                        <TableCell>
                           <TableSortLabel
                              active={orderBy === 'name'}
                              direction={orderBy === 'name' ? order : 'asc'}
                              onClick={() => handleRequestSort('name')}>
                              <b>Name</b>
                           </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                              active={orderBy === 'phone'}
                              direction={orderBy === 'phone' ? order : 'asc'}
                              onClick={() => handleRequestSort('phone')}>
                              <b>Mobile</b>
                           </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                              active={orderBy === 'age'}
                              direction={orderBy === 'age' ? order : 'asc'}
                              onClick={() => handleRequestSort('age')}>
                              <b>Age / Sex</b>
                           </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                              active={orderBy === 'visit_count'}
                              direction={
                                 orderBy === 'visit_count' ? order : 'asc'
                              }
                              onClick={() => handleRequestSort('visit_count')}>
                              <b>Total Visits</b>
                           </TableSortLabel>
                        </TableCell>
                        <TableCell>
                           <TableSortLabel
                              active={orderBy === 'last_visit_date'}
                              direction={
                                 orderBy === 'last_visit_date' ? order : 'asc'
                              }
                              onClick={() =>
                                 handleRequestSort('last_visit_date')
                              }>
                              <b>Last Visit</b>
                           </TableSortLabel>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {isLoading ?
                        <TableRow>
                           <TableCell
                              colSpan={5}
                              align='center'
                              sx={{ py: 5 }}>
                              <CircularProgress />
                           </TableCell>
                        </TableRow>
                     : data?.items && data.items.length > 0 ?
                        data.items.map((row: any) => (
                           <TableRow
                              hover
                              tabIndex={-1}
                              key={row._id}
                              sx={{ cursor: 'pointer' }}
                              onClick={() =>
                                 router.push(`/dashboard/patients/${row._id}`)
                              }>
                              <TableCell
                                 component='th'
                                 scope='row'>
                                 <b>{row.name}</b>
                                 {row.address && (
                                    <Typography
                                       variant='caption'
                                       color='text.secondary'
                                       display='block'>
                                       {row.address}
                                    </Typography>
                                 )}
                              </TableCell>
                              <TableCell>{row.phone}</TableCell>
                              <TableCell>
                                 {row.age} Yrs / {row.gender}
                              </TableCell>

                              <TableCell>
                                 <Chip
                                    label={`${row.visit_count} Visit(s)`}
                                    size='small'
                                    color={
                                       row.visit_count > 1 ?
                                          'primary'
                                       :  'default'
                                    }
                                    variant={
                                       row.visit_count > 1 ?
                                          'filled'
                                       :  'outlined'
                                    }
                                 />
                              </TableCell>
                              <TableCell>
                                 {row.last_visit_date ?
                                    format(
                                       new Date(row.last_visit_date),
                                       'dd MMM yyyy, hh:mm a',
                                    )
                                 :  'N/A'}
                              </TableCell>
                           </TableRow>
                        ))
                     :  <TableRow>
                           <TableCell
                              colSpan={5}
                              align='center'
                              sx={{ py: 3 }}>
                              <Typography
                                 variant='body1'
                                 color='text.secondary'>
                                 No patients found in the system yet.
                              </Typography>
                           </TableCell>
                        </TableRow>
                     }
                  </TableBody>
               </Table>
            </TableContainer>
            <TablePagination
               rowsPerPageOptions={[5, 10, 25, 50]}
               component='div'
               count={data?.total || 0}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
            />
         </Paper>
      </Box>
   );
}

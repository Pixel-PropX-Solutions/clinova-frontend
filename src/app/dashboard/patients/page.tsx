'use client';

import React, { useState, useEffect } from 'react';
import {
   Box,
   Button,
   Typography,
   Paper,
   TextField,
   Grid,
   CircularProgress,
   MenuItem,
   Select,
   InputLabel,
   FormControl,
} from '@mui/material';
import { useSearchPatient, useCreatePatient } from '@/hooks/api/usePatients';
import { useCreateVisit } from '@/hooks/api/useVisits';
import { useTemplates } from '@/hooks/api/useTemplates';
import { useClinicProfile } from '@/hooks/api/useSettings';
import { generatePDF } from '@/hooks/api/usePDF';

export default function PatientsPage() {
   const [formState, setFormState] = useState({
      name: '',
      age: '',
      address: '',
      gender: 'Male',
      mobile: '',
      fees: '',
      doctor: '',
      specialization: '',
      payment_method: 'Cash',
      template_id: '',
   });

   const [queryPhone, setQueryPhone] = useState('');
   const [patientId, setPatientId] = useState<string | null>(null);

   const { data: templates } = useTemplates();
   const { data: clinic } = useClinicProfile();
   const {
      data: patientData,
      isLoading: isSearching,
      refetch,
   } = useSearchPatient(queryPhone);
   const createPatient = useCreatePatient();
   const createVisit = useCreateVisit();

   // Auto-select clinic default template
   useEffect(() => {
      if (clinic?.default_template_id && !formState.template_id) {
         setFormState((prev) => ({
            ...prev,
            template_id: clinic.default_template_id,
         }));
      }
   }, [clinic, formState.template_id]);

   // Trigger search when mobile length is adequate
   useEffect(() => {
      if (formState.mobile.length >= 10) {
         setQueryPhone(formState.mobile);
      } else {
         setPatientId(null);
         setQueryPhone('');
      }
   }, [formState.mobile]);

   useEffect(() => {
      if (queryPhone.length >= 10) {
         refetch();
      }
   }, [queryPhone, refetch]);

   // Auto-fill form when patient is found
   useEffect(() => {
      if (Array.isArray(patientData) && patientData.length > 0) {
         const p = patientData[0];
         setPatientId(p._id);
         setFormState((prev) => ({
            ...prev,
            name: p.name || '',
            age: p.age?.toString() || '',
            address: p.address || '',
            gender: p.gender || 'Male',
         }));
      } else {
         setPatientId(null);
      }
   }, [patientData]);

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | { name?: string; value: unknown }
      >,
   ) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name as string]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const proceedWithVisit = (pId: string) => {
         createVisit.mutate(
            {
               patient_id: pId,
               fees: Number(formState.fees) || 0,
               dr_name: formState.doctor,
               specialization: formState.specialization,
               payment_method: formState.payment_method,
            },
            {
               onSuccess: (visitData) => {
                  if (formState.template_id && visitData._id) {
                     generatePDF(
                        visitData._id,
                        formState.template_id,
                        `parchi_${visitData._id}.pdf`,
                     );
                  }

                  // Reset form optionally
                  setFormState({
                     name: '',
                     age: '',
                     address: '',
                     gender: 'Male',
                     mobile: '',
                     fees: '',
                     doctor: '',
                     specialization: '',
                     payment_method: 'Cash',
                     template_id: '',
                  });
                  setPatientId(null);
                  setQueryPhone('');
               },
            },
         );
      };

      if (!patientId) {
         // Create Patient first
         createPatient.mutate(
            {
               name: formState.name,
               phone: formState.mobile,
               gender: formState.gender,
               age: parseInt(formState.age, 10) || 0,
               address: formState.address,
            },
            {
               onSuccess: (newPatient) => {
                  proceedWithVisit(newPatient._id || newPatient.id);
               },
            },
         );
      } else {
         // Existing Patient
         proceedWithVisit(patientId);
      }
   };

   return (
      <Box
         maxWidth='lg'
         mx='auto'>
         <Typography
            variant='h4'
            fontWeight='bold'
            mb={1}>
            OPD Patient Registration
         </Typography>
         <Typography
            variant='body1'
            color='text.secondary'
            mb={4}>
            Enter patient details for registration
         </Typography>

         <Paper
            elevation={0}
            component='form'
            onSubmit={handleSubmit}
            sx={{
               p: 4,
               borderRadius: 2,
               border: '1px solid',
               borderColor: 'divider',
            }}>
            <Grid
               container
               spacing={3}>
               {/* Mobile Search - Put first visually for logic flow, but in standard form layout it's flexible */}
               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Mobile'
                     name='mobile'
                     fullWidth
                     required
                     value={formState.mobile}
                     onChange={handleChange}
                     InputProps={{
                        endAdornment: isSearching && (
                           <CircularProgress size={20} />
                        ),
                     }}
                     helperText={
                        patientId ?
                           'Patient found! Details auto-filled.'
                        :  'Enter 10 digit number to search'
                     }
                     FormHelperTextProps={{
                        sx: {
                           color: patientId ? 'success.main' : 'text.secondary',
                        },
                     }}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Name'
                     name='name'
                     fullWidth
                     required
                     value={formState.name}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Age'
                     name='age'
                     type='number'
                     fullWidth
                     required
                     value={formState.age}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <FormControl fullWidth>
                     <InputLabel>Sex</InputLabel>
                     <Select
                        name='gender'
                        value={formState.gender}
                        label='Sex'
                        onChange={handleChange as any}>
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>

               <Grid
                  item
                  xs={12}>
                  <TextField
                     label='Address'
                     name='address'
                     fullWidth
                     value={formState.address}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Fees'
                     name='fees'
                     type='number'
                     fullWidth
                     value={formState.fees}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Select Doctor'
                     name='doctor'
                     fullWidth
                     value={formState.doctor}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <TextField
                     label='Specialization'
                     name='specialization'
                     fullWidth
                     value={formState.specialization}
                     onChange={handleChange}
                  />
               </Grid>

               <Grid
                  item
                  xs={12}
                  md={6}>
                  <FormControl fullWidth>
                     <InputLabel>Payment Method</InputLabel>
                     <Select
                        name='payment_method'
                        value={formState.payment_method}
                        label='Payment Method'
                        onChange={handleChange as any}>
                        <MenuItem value='Cash'>Cash</MenuItem>
                        <MenuItem value='Card'>Card</MenuItem>
                        <MenuItem value='UPI'>UPI / Online</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>

               {/* Template Selection */}
               {templates && templates.length > 0 && (
                  <Grid
                     item
                     xs={12}
                     md={6}>
                     <FormControl fullWidth>
                        <InputLabel>Print Template</InputLabel>
                        <Select
                           name='template_id'
                           value={formState.template_id}
                           label='Print Template'
                           required
                           onChange={handleChange as any}>
                           {templates.map((t: any) => (
                              <MenuItem
                                 key={t._id}
                                 value={t._id}>
                                 {t.template_name}{' '}
                                 {t.is_global ? '(Global)' : ''}
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </Grid>
               )}

               <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='flex-end'
                  mt={2}>
                  <Button
                     type='submit'
                     variant='contained'
                     color='primary'
                     size='large'
                     disabled={createPatient.isPending || createVisit.isPending}
                     sx={{ minWidth: 150 }}>
                     {createPatient.isPending || createVisit.isPending ?
                        <CircularProgress
                           size={24}
                           color='inherit'
                        />
                     :  'PRINT'}
                  </Button>
               </Grid>
            </Grid>
         </Paper>
      </Box>
   );
}

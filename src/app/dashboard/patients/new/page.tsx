'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
   Box,
   Button,
   Typography,
   TextField,
   Grid,
   CircularProgress,
   MenuItem,
   Select,
   InputLabel,
   FormControl,
   InputAdornment,
   Card,
   CardContent,
   Divider,
   Stack,
   useTheme,
   useMediaQuery,
   Autocomplete,
   SelectChangeEvent,
} from '@mui/material';
import {
   User,
   Phone,
   MapPin,
   Calendar as CalendarIcon,
   CreditCard,
   Printer,
   Activity,
   ChevronLeft,
} from 'lucide-react';
import { useSearchPatient, useCreatePatient } from '@/hooks/api/usePatients';
import { useCreateVisit } from '@/hooks/api/useVisits';
import { useClinicProfile } from '@/hooks/api/useSettings';
import { generateAndPrintPDF } from '@/hooks/api/usePDF';
import BackDropLoading from '@/container/BackdropLoader';

export default function PatientsPage() {
   const router = useRouter();
   const theme = useTheme();
   const [isNavigating, startNavigation] = React.useTransition();

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
   const [doctors, setDoctors] = useState<{ fee: number; name: string; specialization?: string }[]>([]);

   const [queryPhone, setQueryPhone] = useState('');
   const [patientId, setPatientId] = useState<string | null>(null);

   const { data: clinic } = useClinicProfile();
   const {
      data: patientData,
      isLoading: isSearching,
      refetch,
   } = useSearchPatient(queryPhone);
   const createPatient = useCreatePatient();
   const createVisit = useCreateVisit();

   const selectedDoctor = doctors.find((d) => d.name === formState.doctor);
   const feeSuggestions = Array.from(
      new Set(
         [
            selectedDoctor?.fee,
            ...doctors.map((d) => d.fee),
         ]
            .filter((fee): fee is number => typeof fee === 'number')
            .map((fee) => String(fee)),
      ),
   );

   // Load doctor list and auto-select clinic default template once
   useEffect(() => {
      if (!clinic) {
         return;
      }

      setDoctors(Array.isArray(clinic.doctors) ? clinic.doctors : []);

      if (clinic.default_template_id) {
         setFormState((prev) => {
            if (prev.template_id) {
               return prev;
            }

            return {
               ...prev,
               template_id: clinic.default_template_id,
            };
         });
      }
   }, [clinic]);

   // Doctor/Fee defaults based on clinic doctor configuration
   useEffect(() => {
      if (!clinic || doctors.length === 0) {
         return;
      }

      if (doctors.length === 1) {
         const onlyDoctor = doctors[0];

         setFormState((prev) => ({
            ...prev,
            doctor: prev.doctor || onlyDoctor.name || '',
            specialization: prev.specialization || onlyDoctor.specialization || '',
            fees:
               prev.fees ||
               (typeof onlyDoctor.fee === 'number' ? String(onlyDoctor.fee) : ''),
         }));
         return;
      }

      const defaultDoctor = doctors[0];

      setFormState((prev) => ({
         ...prev,
         doctor: prev.doctor || defaultDoctor?.name || '',
         specialization: prev.specialization || defaultDoctor?.specialization || '',
         fees:
            prev.fees ||
            (typeof defaultDoctor?.fee === 'number'
               ? String(defaultDoctor.fee)
               : ''),
      }));
   }, [clinic, doctors]);

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

   const handleDoctorSelect = (event: SelectChangeEvent<string>) => {
      const doctorName = event.target.value;
      const doctorDetails = doctors.find((d) => d.name === doctorName);

      setFormState((prev) => ({
         ...prev,
         doctor: doctorName,
         specialization: doctorDetails?.specialization || '',
         fees:
            typeof doctorDetails?.fee === 'number'
               ? String(doctorDetails.fee)
               : prev.fees,
      }));
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
                     generateAndPrintPDF(
                        visitData._id,
                        formState.template_id,
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

   const handleNavigateBack = () => {
      startNavigation(() => {
         router.push('/dashboard/patients');
      });
   };

   return (
      <Box maxWidth='xl' mx='auto'>
         <BackDropLoading isLoading={isNavigating} />

         <Button
            startIcon={<ChevronLeft size={18} />}
            onClick={handleNavigateBack}
            disabled={isNavigating}
            sx={{ mb: 3, color: '#64748B', fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}>
            Back to Patient Directory
         </Button>
         <Box sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography variant='h4' fontWeight='800' color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
               Patient Registration
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
               Complete the form below to register a new patient or update existing records.
            </Typography>
         </Box>

         <Grid container spacing={4}>
            {/* Left Column: Form */}
            <Grid item xs={12} md={8}>
               <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)' }}>
                  <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                     <Box component='form' onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h6" fontWeight="700" mb={2} display="flex" alignItems="center" gap={1}>
                                 <User size={20} color="#2F5FA5" /> Personal Information
                              </Typography>
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <TextField
                                 label='Mobile Number'
                                 name='mobile'
                                 fullWidth
                                 required
                                 value={formState.mobile}
                                 onChange={handleChange}
                                 placeholder="Enter 10-digit number"
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <Phone size={18} color="#64748B" />
                                       </InputAdornment>
                                    ),
                                    endAdornment: isSearching && <CircularProgress size={20} />,
                                 }}
                                 helperText={patientId ? 'Patient found! Auto-filled.' : ''}
                                 FormHelperTextProps={{ sx: { color: 'success.main', fontWeight: 600 } }}
                              />
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <TextField
                                 label='Full Name'
                                 name='name'
                                 fullWidth
                                 required
                                 value={formState.name}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <User size={18} color="#64748B" />
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <TextField
                                 label='Age'
                                 name='age'
                                 type='number'
                                 fullWidth
                                 required
                                 value={formState.age}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <CalendarIcon size={18} color="#64748B" />
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                 <InputLabel>Gender</InputLabel>
                                 <Select
                                    name='gender'
                                    value={formState.gender}
                                    label='Gender'
                                    onChange={handleChange as any}
                                 >
                                    <MenuItem value='Male'>Male</MenuItem>
                                    <MenuItem value='Female'>Female</MenuItem>
                                    <MenuItem value='Other'>Other</MenuItem>
                                 </Select>
                              </FormControl>
                           </Grid>

                           <Grid item xs={12}>
                              <TextField
                                 label='Address'
                                 name='address'
                                 fullWidth
                                 multiline
                                 rows={2}
                                 value={formState.address}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                          <MapPin size={18} color="#64748B" />
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                           </Grid>

                           <Grid item xs={12} sx={{ mt: 2 }}>
                              <Divider sx={{ mb: 2 }}>
                                 <Typography variant="caption" color="textSecondary" fontWeight="600" sx={{ px: 2, bgcolor: 'white' }}>
                                    CONSULTATION DETAILS
                                 </Typography>
                              </Divider>
                           </Grid>

                           <Grid item xs={12} md={6}>
                              {doctors.length <= 1 ? (
                                 <TextField
                                    label='Doctor Name'
                                    name='doctor'
                                    fullWidth
                                    value={formState.doctor}
                                    onChange={handleChange}
                                    helperText={
                                       doctors.length === 1
                                          ? 'Default doctor selected automatically.'
                                          : ''
                                    }
                                    InputProps={{
                                       readOnly: doctors.length === 1,
                                       startAdornment: (
                                          <InputAdornment position="start">
                                             <User size={18} color="#64748B" />
                                          </InputAdornment>
                                       ),
                                    }}
                                 />
                              ) : (
                                 <FormControl fullWidth>
                                    <InputLabel>Doctor Name</InputLabel>
                                    <Select
                                       name='doctor'
                                       value={formState.doctor}
                                       label='Doctor Name'
                                       onChange={handleDoctorSelect}
                                    >
                                       {doctors.map((d, idx) => (
                                          <MenuItem key={idx} value={d.name}>
                                             {d.name}
                                          </MenuItem>
                                       ))}
                                    </Select>
                                 </FormControl>
                              )}
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <TextField
                                 label='Specialization'
                                 name='specialization'
                                 fullWidth
                                 value={formState.specialization}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <Activity size={18} color="#64748B" />
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <Autocomplete
                                 freeSolo
                                 options={feeSuggestions}
                                 value={formState.fees}
                                 onChange={(_, value) => {
                                    setFormState((prev) => ({
                                       ...prev,
                                       fees: typeof value === 'string' ? value : '',
                                    }));
                                 }}
                                 onInputChange={(_, value) => {
                                    setFormState((prev) => ({ ...prev, fees: value }));
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       label='Consultation Fees (₹)'
                                       type='number'
                                       helperText='Select suggested fee or enter custom amount.'
                                       InputProps={{
                                          ...params.InputProps,
                                          startAdornment: (
                                             <InputAdornment position="start">
                                                <Typography color="textSecondary" fontWeight="600">₹</Typography>
                                             </InputAdornment>
                                          ),
                                       }}
                                    />
                                 )}
                              />
                           </Grid>

                           <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                 <InputLabel>Payment Method</InputLabel>
                                 <Select
                                    name='payment_method'
                                    value={formState.payment_method}
                                    label='Payment Method'
                                    onChange={handleChange as any}
                                    startAdornment={
                                       <InputAdornment position="start">
                                          <CreditCard size={18} color="#64748B" />
                                       </InputAdornment>
                                    }
                                 >
                                    <MenuItem value='Cash'>Cash</MenuItem>
                                    <MenuItem value='UPI'>UPI / Online</MenuItem>
                                 </Select>
                              </FormControl>
                           </Grid>

                           <Grid item xs={12}>
                              <Button
                                 type='submit'
                                 variant='contained'
                                 fullWidth
                                 size='large'
                                 disabled={createPatient.isPending || createVisit.isPending}
                                 startIcon={!(createPatient.isPending || createVisit.isPending) && <Printer size={20} />}
                                 sx={{ height: 56, fontSize: '18px', mt: 2 }}
                              >
                                 {createPatient.isPending || createVisit.isPending ?
                                    <CircularProgress size={24} color='inherit' />
                                    : 'Register & Print Slip'}
                              </Button>
                           </Grid>
                        </Grid>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>

            {/* Right Column: Info & Tips */}
            <Grid item xs={12} md={4}>
               <Stack spacing={3}>
                  <Card sx={{ bgcolor: '#0F172A', color: 'white', borderRadius: '24px' }}>
                     <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="700" mb={2}>Quick Guide</Typography>
                        <Stack spacing={2}>
                           <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box sx={{ minWidth: 24, height: 24, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>Enter mobile number to search for existing patients.</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box sx={{ minWidth: 24, height: 24, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>Assign a doctor and specify consultation fees.</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box sx={{ minWidth: 24, height: 24, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</Box>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>Click Register & Print to generate the visit slip.</Typography>
                           </Box>
                        </Stack>
                     </CardContent>
                  </Card>
               </Stack>
            </Grid>
         </Grid>
      </Box>
   );
}

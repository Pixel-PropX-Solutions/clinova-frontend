import { useAddClinicDoctor, useClinicProfile } from '@/hooks/api/useSettings';
import {
    Paper,
    Grid,
    TextField,
    Button,
    Divider,
    Stack,
    Chip,
    Box,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';


const Doctors = () => {
    const { data: clinic } = useClinicProfile();
    const addClinicDoctor = useAddClinicDoctor();
    const [loading, setLoading] = useState(false);

    const [doctorState, setDoctorState] = useState({
        name: '',
        fee: '',
    });


    const handleAddDoctor = () => {
        setLoading(true);

        const doctorName = doctorState.name.trim();
        const doctorFee = Number(doctorState.fee);

        if (!clinic?._id) {
            toast.error('Clinic not found');
            setLoading(false);
            return;
        }

        if (!doctorName) {
            toast.error('Doctor name is required');
            setLoading(false);
            return;
        }

        if (!Number.isFinite(doctorFee) || doctorFee < 0) {
            toast.error('Please enter a valid doctor fee');
            setLoading(false);
            return;
        }

        addClinicDoctor.mutate(
            {
                clinicId: clinic._id,
                doctor: {
                    name: doctorName,
                    fee: doctorFee,
                },
            },
            {
                onSuccess: () => {
                    setDoctorState({ name: '', fee: '' });
                    setLoading(false);
                },
                onError: (error: any) => {
                    setLoading(false);
                }
            },
        );
    };



    return (
        <>
            <Divider>
                <Chip label='Doctors & Fees' size='small' sx={{ fontSize: '10px', fontWeight: 700, bgcolor: '#F8FAFC' }} />
            </Divider>

            <Box>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12} md={5}>
                        <TextField
                            label='Doctor Name'
                            fullWidth
                            value={doctorState.name}
                            onChange={(e) =>
                                setDoctorState((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label='Consultation Fee'
                            fullWidth
                            type='number'
                            inputProps={{ min: 0 }}
                            value={doctorState.fee}
                            onChange={(e) =>
                                setDoctorState((prev) => ({
                                    ...prev,
                                    fee: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            type='button'
                            onClick={handleAddDoctor}
                            variant='outlined'
                            fullWidth
                            disabled={addClinicDoctor.isPending || loading}
                            sx={{ height: 56 }}>
                            {addClinicDoctor.isPending || loading ? 'Adding...' : 'Add Doctor'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Stack spacing={1.5}>
                {(clinic?.doctors || []).length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No doctors added yet. Add doctors one by one with their consultation fees.
                    </Typography>
                ) : (
                    (clinic?.doctors || []).map((doctor: { name: string; fee: number }, index: number) => (
                        <Paper
                            key={`${doctor.name}-${index}`}
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Box display='flex' alignItems='center' gap={2}>
                                <Typography variant='body1' fontWeight='600'>
                                    {index + 1}.
                                </Typography>
                                <Typography variant='body1' fontWeight='600'>
                                    {doctor.name}
                                </Typography>
                            </Box>
                            <Chip
                                label={`₹${doctor.fee}`}
                                size='small'
                                color='primary'
                                variant='outlined'
                            />
                        </Paper>
                    ))
                )}
            </Stack>
        </>
    );
};

export default Doctors;
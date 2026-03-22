import { useAddClinicDoctor, useUpdateClinicDoctor, useDeleteClinicDoctor, useClinicProfile } from '@/hooks/api/useSettings';
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
    IconButton,
} from '@mui/material';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';


const Doctors = () => {
    const { data: clinic } = useClinicProfile();
    const addClinicDoctor = useAddClinicDoctor();
    const updateClinicDoctor = useUpdateClinicDoctor();
    const deleteClinicDoctor = useDeleteClinicDoctor();
    
    const [loading, setLoading] = useState(false);

    // Form state for adding
    const [doctorState, setDoctorState] = useState({
        name: '',
        fee: '',
        specialization: '',
    });

    // Form state for editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editState, setEditState] = useState({
        name: '',
        fee: '',
        specialization: '',
    });

    const handleAddDoctor = () => {
        setLoading(true);

        const doctorName = doctorState.name.trim();
        const doctorFee = Number(doctorState.fee);
        const specialization = doctorState.specialization.trim();

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
                    specialization: specialization || undefined,
                },
            },
            {
                onSuccess: () => {
                    setDoctorState({ name: '', fee: '', specialization: '' });
                    setLoading(false);
                },
                onError: (error: any) => {
                    setLoading(false);
                }
            },
        );
    };

    const handleEditStart = (doctor: any) => {
        if (!doctor.id) {
            toast.error("This doctor cannot be edited because it lacks an ID. Please delete and recreate.");
            return;
        }
        setEditingId(doctor.id);
        setEditState({
            name: doctor.name || '',
            fee: doctor.fee?.toString() || '0',
            specialization: doctor.specialization || '',
        });
    }

    const handleEditCancel = () => {
        setEditingId(null);
        setEditState({ name: '', fee: '', specialization: '' });
    }

    const handleEditSave = () => {
        if (!editingId || !clinic?._id) return;
        setLoading(true);

        const doctorName = editState.name.trim();
        const doctorFee = Number(editState.fee);
        const specialization = editState.specialization.trim();

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
        
        updateClinicDoctor.mutate(
            {
                clinicId: clinic._id,
                doctorId: editingId,
                doctor: {
                    name: doctorName,
                    fee: doctorFee,
                    specialization: specialization || undefined,
                }
            },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setLoading(false);
                },
                onError: () => { setLoading(false); }
            }
        );
    };

    const handleDelete = (doctorId: string) => {
        if (!clinic?._id || !doctorId) return;
        if (confirm("Are you sure you want to delete this doctor?")) {
            deleteClinicDoctor.mutate({
                clinicId: clinic._id,
                doctorId: doctorId
            });
        }
    };

    return (
        <>
            <Divider>
                <Chip label='Doctors & Fees' size='small' sx={{ fontSize: '10px', fontWeight: 700, bgcolor: '#F8FAFC' }} />
            </Divider>

            <Box>
                <Grid container spacing={2} alignItems='flex-start'>
                    <Grid item xs={12} sm={4}>
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
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label='Specialization'
                            fullWidth
                            value={doctorState.specialization}
                            onChange={(e) =>
                                setDoctorState((prev) => ({
                                    ...prev,
                                    specialization: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            label='Fee'
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
                    <Grid item xs={12} sm={3}>
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
                    (clinic?.doctors || []).map((doctor: any, index: number) => (
                        <Paper
                            key={doctor.id || `${doctor.name}-${index}`}
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 2,
                                minHeight: 56,
                            }}>
                            {editingId === doctor.id ? (
                                <Box sx={{ display: 'flex', flexGrow: 1, gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <TextField
                                        size="small"
                                        label="Name"
                                        value={editState.name}
                                        onChange={(e) => setEditState({...editState, name: e.target.value})}
                                        sx={{ minWidth: 150, flexGrow: 1 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Specialization"
                                        value={editState.specialization}
                                        onChange={(e) => setEditState({...editState, specialization: e.target.value})}
                                        sx={{ minWidth: 150, flexGrow: 1 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Fee"
                                        type="number"
                                        value={editState.fee}
                                        onChange={(e) => setEditState({...editState, fee: e.target.value})}
                                        sx={{ width: 100 }}
                                    />
                                    <IconButton size="small" color="success" onClick={handleEditSave} disabled={updateClinicDoctor.isPending || loading} >
                                        <Check size={18} />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={handleEditCancel} >
                                        <X size={18} />
                                    </IconButton>
                                </Box>
                            ) : (
                                <>
                                    <Box display='flex' alignItems='center' gap={2} flexGrow={1}>
                                        <Typography variant='body1' fontWeight='600'>
                                            {index + 1}.
                                        </Typography>
                                        <Box>
                                            <Typography variant='body1' fontWeight='600'>
                                                {doctor.name}
                                            </Typography>
                                            {doctor.specialization && (
                                                <Typography variant='body2' color='text.secondary'>
                                                    {doctor.specialization}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={`₹${doctor.fee}`}
                                            size='small'
                                            color='primary'
                                            variant='outlined'
                                        />
                                        {doctor.id && (
                                            <>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleEditStart(doctor)}
                                                    sx={{ color: '#64748b' }}
                                                >
                                                    <Edit2 size={16} />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDelete(doctor.id)}
                                                    sx={{ color: '#ef4444' }}
                                                    disabled={deleteClinicDoctor.isPending}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Paper>
                    ))
                )}
            </Stack>
        </>
    );
};

export default Doctors;
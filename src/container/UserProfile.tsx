import { useClinicProfile } from "@/hooks/api/useSettings";
import { Avatar, Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";


const UserProfile = () => {

    const { data: clinic, isLoading: isClinicLoading } = useClinicProfile();
    const [profileState, setProfileState] = useState({
        name: '',
        image: '',
    });

    useEffect(() => {
        if (clinic) {
            setProfileState({
                name: clinic.name || '',
                image: clinic.logo_url || '',
            });
        }
    }, [clinic]);

    if (isClinicLoading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            pl: { xs: 1, sm: 2 },
            borderLeft: '1px solid #E3EEF7'
        }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" fontWeight="600" sx={{ whiteSpace: 'nowrap' }}>Dr. {profileState.name}</Typography>
            </Box>
            <Avatar
                src={profileState.image}
                sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    padding: '2px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '2px solid #E3EEF7'
                }}
            />
        </Box>
    );
};

export default UserProfile;
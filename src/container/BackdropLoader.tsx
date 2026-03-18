import { Backdrop, Box, CircularProgress, LinearProgress, Typography } from "@mui/material";

interface Props {
    isLoading: boolean;
    text?: string;
}

const BackDropLoading = (props: Props) => {


    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: 'blur(8px)',
            }}
            open={props.isLoading}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress color="inherit" size={60} thickness={4} />
                {props.text && (
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {props.text}
                    </Typography>
                )}
                <LinearProgress
                    sx={{
                        width: 300,
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                        }
                    }}
                />
            </Box>
        </Backdrop>
    );
};

export default BackDropLoading;
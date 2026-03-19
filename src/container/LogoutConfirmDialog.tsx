'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';

type LogoutConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    roleLabel?: 'user' | 'admin';
};

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    isLoading = false,
    roleLabel = 'user',
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : onClose}
            fullWidth
            maxWidth='xs'
            // fullScreen={isMobile}
            aria-labelledby='logout-confirmation-title'
            aria-describedby='logout-confirmation-description'>
            <DialogTitle id='logout-confirmation-title' sx={{ fontWeight: 700 }}>
                Confirm Logout
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='logout-confirmation-description'>
                    Are you sure you want to logout as {roleLabel}? You will need to sign in
                    again to continue.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={isLoading} variant='text'>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color='error'
                    variant='contained'
                    disabled={isLoading}>
                    {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutConfirmDialog;

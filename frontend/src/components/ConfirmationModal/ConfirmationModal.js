import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmationModal({ isOpen = false, data, title = 'Title', message = 'Message', handleSubmit, handleClose }) {

    const onSubmit = () => {
        if (handleSubmit && data) handleSubmit(data);
    };

    const onClose = () => {
        if (handleClose) handleClose();
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
            Cancel
                    </Button>
                    <Button onClick={() => onSubmit(data)} color="primary">
            OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool,
    data: PropTypes.object,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func
};
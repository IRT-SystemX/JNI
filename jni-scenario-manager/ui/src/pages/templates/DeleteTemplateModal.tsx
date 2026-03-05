import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  setOpen: (value: boolean) => void
  open: boolean
  idToDelete: string
}

export default function DeleteTemplateModal({open, setOpen, idToDelete}: Props) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDelete = async () => {
    console.log("delete:", idToDelete);

    try {

      const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
      const response = await fetch(`http://${baseUrlWorkflowManager}/api/v1/tasks/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }

      setSnackbarMessage('Template deleted successfully!');
      setSnackbarSeverity('success');
      setOpen(false);
    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this template? This action cannot be undone and will permanently remove the template from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

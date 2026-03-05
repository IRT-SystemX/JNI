import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1, // This ensures it's above other modals
}));

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
  setIsConfirmCloseWithoutSave: (value: boolean) => void;
};

export function CloseWithoutSavingModal({ open, setOpen, setIsConfirmCloseWithoutSave }: Props) {
  const handleCancel = () => {
    setIsConfirmCloseWithoutSave(false);
    setOpen(false);
  };

  const handleConfirm = () => {
    setIsConfirmCloseWithoutSave(true);
    setOpen(false);
  };

  return (
    <StyledDialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCancel}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Confirm Closing</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to close the window without saving? Any changes will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="outlined" color="error" onClick={handleConfirm}>
          Close Without Saving
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

function ConfirmDialog({confirmDialog, setConfirmDialog}) {
  return (
    <Dialog 
      open={confirmDialog.isOpen}
      sx={{
        '& .MuiDialog-paper': {
          padding: (theme) => theme.spacing(2),
          position: 'absolute',
          top: (theme) => theme.spacing(5)
        }
      }}
    >
      <DialogTitle>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6">
          {confirmDialog.title}
        </Typography>
        <Typography variant="subtitle2">
          {confirmDialog.subTitle}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <button className='btn btn-secondary' onClick={() => setConfirmDialog(false)}>No</button>
        <button className='btn btn-danger'
        onClick={confirmDialog.onConfirm}>Yes</button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;
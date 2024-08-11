import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';

function KeyUpPopUp({ title, children, openKeyUpPopUp, setopenKeyUpPopUp }) {
  return (
    <Dialog open={openKeyUpPopUp}>
    <DialogTitle style={{
        display:'flex', 
        justifyContent: 'space-between',
        alignItems:'center'
    }}>

        <div>Update your key</div>
        <div className="mb-2">
        <X 
        onClick={() => setopenKeyUpPopUp(false)}
        style={{padding: '4px'}}
        className=" me-2" />
        <span className="align-middle"></span>
         </div>
    </DialogTitle>
    <DialogContent dividers>
       {children}
    </DialogContent>
</Dialog>
  )
}

export default KeyUpPopUp
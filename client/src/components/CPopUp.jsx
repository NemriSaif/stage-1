import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';

function CPopUp({ title, children, CopenPopup, setCopenPopup }) {
  return (
    <Dialog open={CopenPopup}>
        <DialogTitle style={{
            display:'flex', 
            justifyContent: 'space-between',
            alignItems:'center'
        }}>

            <div>Add a new Client</div>
            <div className="mb-2">
            <X 
            onClick={() => setCopenPopup(false)}
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

export default CPopUp
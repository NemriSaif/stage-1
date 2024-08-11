import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';

function ClientUpPopUp({ title, children, ClientUpopenPopup, setClientUpopenPopup }) {
  return (
    <Dialog open={ClientUpopenPopup}>
        <DialogTitle style={{
            display:'flex', 
            justifyContent: 'space-between',
            alignItems:'center'
        }}>

            <div>Update your client</div>
            <div className="mb-2">
            <X 
            onClick={() => setClientUpopenPopup(false)}
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

export default ClientUpPopUp
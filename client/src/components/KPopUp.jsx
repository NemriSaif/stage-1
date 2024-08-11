import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';
function PopUp({ title, children, KopenPopup, setKopenPopup }) {
 
  return (
    <Dialog open={KopenPopup}>
        <DialogTitle style={{
            display:'flex', 
            justifyContent: 'space-between',
            alignItems:'center'
        }}>

            <div>Add a new Key</div>
            <div className="mb-2">
            <X 
            onClick={() => setKopenPopup  (false)}
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

export default PopUp
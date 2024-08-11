import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';

function SearchPopUp({children, openSPopup,setopenSPopup}) {
  return (
    <Dialog open={openSPopup}>
        <DialogTitle style={{
            display:'flex', 
            justifyContent: 'space-between',
            alignItems:'center'
        }}>

            <div>Search </div>
            <div className="mb-2">
            <X 
            onClick={() => setopenSPopup(false)}
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

export default SearchPopUp
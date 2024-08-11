import React, { Children } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { X } from 'react-feather';

function EnvUpPopUp({ title, children, openEnvUpPopUp, setopenEnvUpPopUp }) {
  return (
    <Dialog open={openEnvUpPopUp}>
        <DialogTitle style={{
            display:'flex', 
            justifyContent: 'space-between',
            alignItems:'center'
        }}>

            <div>Add a new Environment</div>
            <div className="mb-2">
            <X 
            onClick={() => setopenEnvUpPopUp(false)}
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

export default EnvUpPopUp
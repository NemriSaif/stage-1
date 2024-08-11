import React, { useState } from "react";
import axios from 'axios'
import {Button, TextField} from '@mui/material';

 
function ClientForm({ refreshData, setCopenPopup}) {

    const [Name, setName] = useState('');
    const [Code, setCode] = useState('');
    const [Contract, setContract] = useState('');
    const [Address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e, setter) => {
        const { name, value } = e.target;
        setter(value);
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true
        }));
    };

    const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!Name) {
        newErrors.Name = 'Name is required';
    } else if (!nameRegex.test(Name)) {
        newErrors.Name = 'Name can only contain letters and spaces';
    }        if (!Code) newErrors.Code = 'Code is required';
        if (!Contract) newErrors.Contract = 'Contract is required';
        if (!Address) newErrors.Address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const Submit = (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            axios.post("http://localhost:3001/Clients/createClient", { Name, Code, Contract, Address })
                .then(result => {
                    console.log(result);
                    // Reset form or navigate away
                    setName('');
                    setCode('');
                    setContract('');
                    setAddress('');
                    setTouched({});
                    refreshData();
                    setCopenPopup(false); 
                })
                .catch(err => {
                    console.error('Error:', err.response ? err.response.data : err.message);
                });
        } else {
            console.log('Form has errors');
        }
    };
  return (
    <form onSubmit={Submit} >
                <div className="mb-2">
                <TextField  size="small"
                label="Name" placeholder="Enter the Name" variant="outlined" fullWidth required
                value={Name}
                onChange={(e) => handleChange(e, setName)}
                onBlur={handleBlur}></TextField>
                {touched.Name && errors.Name && <span className="error-message">{errors.Name}</span>}
                    {/*
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="Enter the name" className="form-control"
                    name="Name"
                    value={Name}
                    onChange={(e) => handleChange(e, setName)}
                    onBlur={handleBlur}/>
                    */}
                </div>
                <div className="mb-2">
                <TextField  size="small"
                label="Code" placeholder="Enter the Code" variant="outlined" fullWidth required
                value={Code}
                onChange={(e) => handleChange(e, setCode)}
                onBlur={handleBlur}></TextField>
                {touched.Code && errors.Code && <span className="error-message">{errors.Code}</span>}
                </div>
                <div className="mb-2">
                    <TextField  size="small"
                    label="Contract" placeholder="Enter the Contract" variant="outlined" fullWidth required
                    value={Contract}
                    onChange={(e) => handleChange(e, setContract)}
                    onBlur={handleBlur}></TextField>
                {touched.Contract && errors.Contract && <span className="error-message">{errors.Contract}</span>}
                </div>
                <div className="mb-2">
                <TextField  size="small"
                    label="Address" placeholder="Enter the Address" variant="outlined" fullWidth required
                    value={Address}
                    onChange={(e) => handleChange(e, setAddress)}
                    onBlur={handleBlur}></TextField>
                    {touched.Address && errors.Address && <span className="error-message">{errors.Address}</span>}
                </div>
                <div style={{ textAlign: 'center' }}>
                <Button type="submit" variant="contained" 
                 color="primary"  className="btn" fullWidth>Submit</Button>
                </div>
                
                </form>
  )
}

export default ClientForm
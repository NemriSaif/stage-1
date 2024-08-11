import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Button, TextField} from '@mui/material';


const validateForm = (Name, URL, Configuration, Type) => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
  
    if (!Name) {
      newErrors.Name = 'Name is required';
    } else if (!nameRegex.test(Name)) {
      newErrors.Name = 'Name can only contain letters and spaces';
    }
    if (!URL) newErrors.URL = 'URL is required';
    if (!Configuration) newErrors.Configuration = 'Configuration is required';
    if (!Type) newErrors.Type = 'Type is required';
    
    return newErrors;
  };

function UpdateKey({ selectedKey, refreshData, setopenKeyUpPopUp }) {
  
    const [Name,setName]= useState('')
    const [URL,setURL]= useState('')
    const [Configuration,setConfiguration]= useState('')
    const [Type,setType]= useState('')
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    useEffect(() => {
        axios.get(`http://localhost:3001/Key/${selectedKey}`)
          .then(result => {console.log(result)
            setName(result.data.Name)
            setURL(result.data.URL)
            setConfiguration(result.data.Configuration)
            setType(result.data.Type)
          })
          .catch(err => console.error(err));
      }, [selectedKey]);

      const handleChange = (e, setter) => {
        const { name, value } = e.target;
        setter(value);
        setTouched(prev => ({...prev, [name]: true}));
      };

      const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({...prev, [name]: true}));
      };

    
      const Update = (e) => {
        e.preventDefault();
        const newErrors = validateForm(Name, URL, Configuration, Type);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
          axios.put("http://localhost:3001/components/updateKey/"+selectedKey, {Name, URL, Configuration, Type})
            .then(result => {
              console.log(result);
              setTouched({});
              refreshData();
              setopenKeyUpPopUp(false);
            })
            .catch(err => console.log(err));
        } else {
          console.log('Form has errors');
        }
      };
  
    return (
    <form onSubmit={Update}>
    <div className="card">
		<div className="card-body">
        <div className="mb-2">
                    <TextField  size="small"
                    label="Name" placeholder="Enter the Name" variant="outlined" fullWidth required
                    value={Name}
                    onChange={(e) => handleChange(e, setName)}
                    onBlur={handleBlur}></TextField>
                     {touched.Name && errors.Name && <span className="error-message">{errors.Name}</span>}
                 
        </div> 
        <div className="mb-2">
        <TextField  size="small"
                    label="URL" placeholder="Enter the URL" variant="outlined" fullWidth required
                    value={URL}
                    onChange={(e) => handleChange(e, setURL)}
                    onBlur={handleBlur}></TextField>
                     {touched.URL && errors.URL && <span className="error-message">{errors.URL}</span>}
                 
        </div>  
        <div className="mb-2">
        <TextField  size="small"
                    label="Configuration" placeholder="Enter the Configuration" variant="outlined" fullWidth required
                    value={Configuration}
                    onChange={(e) => handleChange(e, setConfiguration)}
                    onBlur={handleBlur}></TextField>
                     {touched.Configuration && errors.Configuration && <span className="error-message">{errors.Configuration}</span>}
                 
        </div>
                <div className="mb-2">
                    <TextField  size="small"
                    label="Type" placeholder="Enter the Type" variant="outlined" fullWidth required
                    value={Type}
                    onChange={(e) => handleChange(e, setType)}
                    onBlur={handleBlur}></TextField>
                     {touched.Type && errors.Type && <span className="error-message">{errors.Type}</span>}
                 
        </div>   
        </div>
        <div style={{ textAlign: 'center' }}>
                <Button type="submit" variant="contained" 
                 color="primary"  className="btn" fullWidth>Update</Button>
        </div>
    </div>
</form>
  )
}

export default UpdateKey
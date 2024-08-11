import React, { useState, useEffect } from "react";
import axios from 'axios'
import {Button, TextField} from '@mui/material';

function KeyForm({SelectedEnv, refreshData, setKopenPopup}) {

    const [Name,setName]= useState('')
    const [URL,setURL]= useState('')
    const [Configuration,setConfiguration]= useState('')
    const [Type,setType]= useState('')
    const [EnvironmentId, setEnvironmentId] = useState('')
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

    useEffect(() => {
        console.log('SelectedEnv:', SelectedEnv); // Log the selected environment ID
    }, [SelectedEnv]);
    
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
        }        
        if (!URL) newErrors.URL = 'URL is required';
            if (!Configuration) newErrors.Configuration = 'Configuration is required';
            if (!Type) newErrors.Type = 'Type is required';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const Submit =(e) =>{
            e.preventDefault();
            const isValid = validateForm();
            if (isValid) {
            axios.post("http://localhost:3001/Key/createKey", {Name: Name, URL: URL, Configuration: Configuration, Type: Type, EnvironmentId: SelectedEnv })
            .then(result => {console.log(result)
            refreshData();
            setKopenPopup(false);
            })
            .catch(err => {
                console.error('Error:', err.response ? err.response.data : err.message)});
       
            }else {
                console.log('Form has errors');
            }
        }
  return (
<form onSubmit={Submit}>
    <div className="card">
		<div className="card-body">
        <div className="mb-2">
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="Enter the name" className="form-control"
                     name="Name"
                     value={Name}
                     onChange={(e) => handleChange(e, setName)}
                     onBlur={handleBlur}/>
                     {touched.Name && errors.Name && <span className="error-message">{errors.Name}</span>}
                 
        </div> 
        <div className="mb-2">
                    <label htmlFor="">URL</label>
                    <input type="text" placeholder="Enter the url" className="form-control"
                     name="URL"
                     value={URL}
                     onChange={(e) => handleChange(e, setURL)}
                     onBlur={handleBlur}/>
                     {touched.URL && errors.URL && <span className="error-message">{errors.URL}</span>}
                 
        </div>  
        <div className="mb-2">
                    <label htmlFor="">Configuration</label>
                    <input type="text" placeholder="Enter the configuration of the key" className="form-control"
                     name="Configuration"
                     value={Configuration}
                     onChange={(e) => handleChange(e, setConfiguration)}
                     onBlur={handleBlur}/>
                     {touched.Configuration && errors.Configuration && <span className="error-message">{errors.Configuration}</span>}
                 
        </div>
                <div className="mb-2">
                    <label htmlFor="">Type</label>
                    <input type="text" placeholder="Enter the type of key" className="form-control"
                     name="Type"
                     value={Type}
                     onChange={(e) => handleChange(e, setType)}
                     onBlur={handleBlur}/>
                     {touched.Type && errors.Type && <span className="error-message">{errors.Type}</span>}
                 
        </div>   
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
    </div>
</form>
  )
}

export default KeyForm
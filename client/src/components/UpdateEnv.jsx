import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Button, TextField} from '@mui/material';


function UpdateEnv({SelectedEnv, refreshData, setopenEnvUpPopUp}) {
    
    
    console.log("ID from params:", SelectedEnv);
  
    const [Name,setName]= useState('')
    const [Type,setType]= useState('')
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3001/Environments/${SelectedEnv}`)
          .then(result => {if (result.data) {
            setName(result.data.Name)
            setType(result.data.Type)
          }
          })
          .catch(err => console.error(err));
      }, [SelectedEnv]);

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
        }        
        if (!Type) newErrors.Type = 'Type is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
        };
        const Update =(e) =>{
            e.preventDefault();
            const isValid = validateForm();
        if (isValid) {
            axios.put("http://localhost:3001/components/UpdateEnv/"+SelectedEnv, {Name,Type})
            .then(result => {
              console.log(result);
              setTouched({});
              refreshData();
              setopenEnvUpPopUp(false);
            })
            .catch(err => console.error('Update error:', err))
        }else {
            console.log('Form has errors');
            }
        }

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
                    label="Type" placeholder="Enter the Type" variant="outlined" fullWidth required
                    value={Type}
                    onChange={(e) => handleChange(e, setType)}
                    onBlur={handleBlur}></TextField>
                     {touched.Type && errors.Type && <span className="error-message">{errors.Type}</span>}
                </div>
                <div style={{ textAlign: 'center' }}>
                <Button type="submit" variant="contained" 
                 color="primary"  className="btn" fullWidth>Update</Button>
                </div>

                </div>
            </div>

   </form>
			
		
  )
}

export default UpdateEnv
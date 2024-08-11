import React, { useState } from 'react';
import axios from 'axios';

function SearchForm({setopenSPopup, handleSearch}) {
    const [formData, setFormData] = useState({
        NameE: '',
        TypeE: '',
        NameK: '',
        URL: '',
        Configuration: '',
        TypeK: ''
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const onSubmit = (e) => {
        e.preventDefault();
        handleSearch(formData);
        setopenSPopup(false);
      };
    return (
    <form onSubmit={onSubmit}>
        <div className="card">
			<div className="card-body">
                <h4>Environment Fields</h4>
                <div className="mb-2">
                <label htmlFor="">Name</label>
                    <input type="text" className="form-control"
                     placeholder="Enter the name" 
                     value={formData.NameE}
                     onChange={handleChange} />
                </div>
                <div className="mb-2">
                <label htmlFor="">Type</label>
                    <input type="text" className="form-control" placeholder="Enter the Type" name="TypeE"
                    value={formData.TypeE}
                    onChange={handleChange} />
                </div>
                <h4>Key Fields</h4>
                <div className="mb-2">
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="Enter the name" className="form-control"
                     name="NameK"
                     value={formData.NameK}
                    onChange={handleChange}/>
                 
                </div> 
                <div className="mb-2">
                    <label htmlFor="">URL</label>
                    <input type="text" placeholder="Enter the url" className="form-control"
                     name="URL"
                     value={formData.URL}
                     onChange={handleChange}/>
                 
                </div>  
                <div className="mb-2">
                    <label htmlFor="">Configuration</label>
                    <input type="text" placeholder="Enter the configuration of the key" className="form-control"
                     name="Configuration"
                     value={formData.Configuration}
                     onChange={handleChange}/>
                 
                 </div>
                <div className="mb-2">
                    <label htmlFor="">Type</label>
                    <input type="text" placeholder="Enter the type of key" className="form-control"
                     name="TypeK"
                     value={formData.TypeK}
                    onChange={handleChange}/>
                 </div>   
            </div>
                <button type="submit" className="btn btn-success">Search</button>
         </div>
   </form>
  )
}

export default SearchForm
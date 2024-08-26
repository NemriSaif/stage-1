import './signUp.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/register', { username, email, fullname, phoneNumber, password, birthDay, role })
      .then(result => {
        console.log(result)
        navigate('/')
      })
      .catch(err => console.error)
  }
  return (
    <div className="signup-containerR">
      <div className="card-containerR">
        <div className="left-panelL">
          <h2 className="headingL">Create your account</h2>
          <p className="subheadingL"></p>
        </div>
        <div className="right-panelR">
          <h1 className="headingR">Signup</h1>
          <form onSubmit={handleSubmit} className="form-groupR">
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="Username">
                Enter your Username
              </label>
              <input
                className="form-inputR"
                id="Username"
                placeholder="Username"
                type="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-groupR">
              <label className="form-labelR" htmlFor="email">
                Enter your email adress
              </label>
              <input
                className="form-inputR"
                id="email"
                placeholder="Email adress"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="firstName">
                Enter your Full Name
              </label>
              <input
                className="form-inputR"
                id="firstlastName"
                placeholder="Full Name"
                type="text"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-groupR">
              <label className="form-labelR" htmlFor="PhoneNumber">
                Enter your Phone Number
              </label>
              <input
                className="form-inputR"
                id="PhoneNumber"
                placeholder="Phone Number"
                type="text"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="password">
                Enter your Password
              </label>
              <input
                className="form-inputR"
                id="password"
                placeholder="Password"
                type="password"

                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-groupR">
              <label className="form-labelR" htmlFor="birthDay">
                Enter your Birthday
              </label>
              <input type="date" id="birthDay" name="birthDay" onChange={(e) => setBirthDay(e.target.value)} />
            </div>


            <div className="form-groupR">
              <label className="form-labelR" htmlFor="role">
                Signup as :
              </label>
              <select className="form-inputR" id="role"  value={role} onChange={(e) => setRole(e.target.value)} >
                <option value="">select your role</option>
                <option value="Adminstrator">Adminstrator</option>
                <option value="Analyst">Analyst</option>
                
              </select>
            </div>
          


          <button className="sign-up-btnR" type="submit">
            Signup
          </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default SignUp;

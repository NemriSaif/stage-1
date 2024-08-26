import './signIn.css'; 
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:3001/login', { email, password });
      
      if (result.data.status === '2FA required') {
        setShow2FAPopup(true);
      } else if (result.data.status === 'success') {
        localStorage.setItem('token', result.data.token);
        console.log('Token saved:', localStorage.getItem('token'));
        navigate('/Home');
      } else {
        setError(result.data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error: Unable to login');
    }
  };

  const handle2FAVerification = async () => {
    try {
      const result = await axios.post('http://localhost:3001/verify-2fa', { email, twoFactorAuthToken: twoFactorCode });
      
      if (result.data.status === 'success') {
        localStorage.setItem('token', result.data.token);
        console.log('Token saved:', localStorage.getItem('token'));
        navigate('/Home');
      } else {
        setError('Invalid 2FA code');
      }
    } catch (err) {
      console.error(err);
      setError('Server error: Unable to verify 2FA');
    }
  };

  return (
    <div className="login-container">
      <div className="card-containerL">
        <div className="left-panelL">
          <h2 className="headingL">Connect to</h2>
          <p className="subheadingL">your account</p>
        </div>
        <div className="right-panelL">
          <div>
            <h2>Welcome</h2>
            <div>
              <span>Don't have an account? </span>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          </div>
          <h1 className="headingL">Login</h1>
          <form className="form-groupL" onSubmit={handleSubmit}>
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="username">
                Enter your email address or Username
              </label>
              <input
                className="form-inputL"
                id="username"
                placeholder="Email address"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="password">
                Enter your password
              </label>
              <input
                className="form-inputL"
                id="password"
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="sign-in-btnL" type="submit">
              Connect
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>

      {/* 2FA Popup */}
      {show2FAPopup && (
        <div className="popup">
          <h2>Enter 2FA Code</h2>
          <input
            type="text"
            placeholder="2FA Code"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
          />
          <button onClick={handle2FAVerification}>Verify</button>
          <button onClick={() => setShow2FAPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Login;

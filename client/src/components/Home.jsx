import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./home.css";
import UsersTable from './UsersTable'; // Import the UsersTable component

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Navigate to the login page
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul>
          <li>Home</li>
        </ul>
        <div className="auth-links-container">
          <div className="profile-info" onClick={() => setShowMenu(!showMenu)}>
            <img
              src={userData.profilePic || '/images/profile-pic.png'}
              alt="Profile"
              className="profile-pic"
            />
            <span className="profile-name">{userData.fullname}</span>
          </div>
          {showMenu && (
            <div className="menu">
              <button onClick={handleProfileClick}>Profile</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </header>
      <UsersTable /> {/* Include the UsersTable component */}
      {/* Rest of the code */}
    </section>
  );
};

export default Home;

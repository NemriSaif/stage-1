import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
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
          console.error('Error fetching profile data', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmChange = (e) => {
    setConfirmText(e.target.value);
  };

  const handleConfirmDelete = () => {
    if (confirmText === "i confirm") {
      axios.delete('http://localhost:3001/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        localStorage.removeItem("token");
        window.location.href = '/'; // Redirect to login page
      })
      .catch(err => {
        console.error("Error deleting account", err);
      });
    } else {
      alert("Please type 'i confirm' to proceed.");
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleEditClick = () => {
    navigate('/edit'); // Navigate to the /edit page
  };

  if (!userData) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <ul>
          <li>Profile</li>
        </ul>
      </header>
      <div className="profile-page__container">
        <div className="profile-page__header-section">
          <div className="profile-page__pic">
            {/* Display profile picture from the server */}
            <img src={userData.profilePic || '/images/profile-pic.png'} alt="Profile" />
          </div>
          <div className="profile-page__info">
            <h1>{userData.fullname}</h1>
            <p>@{userData.username}</p> {/* Only display the username with @ */}
            <p>{userData.email}</p>
            <p>{userData.phoneNumber}</p>
            <p>{userData.role}</p> {/* Display role */}
            <p>{new Date(userData.birthDay).toLocaleDateString()}</p> {/* Display birthday */}
          </div>
        </div>
        <div className="profile-page__actions">
          <button className="profile-page__edit-btn" onClick={handleEditClick}>Edit</button> {/* Navigate to edit page */}
          <button className="profile-page__delete-btn" onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>

      {showConfirm && (
        <div className="profile-page__confirm-popup">
          <div className="profile-page__confirm-content">
            <h3>Are you sure you want to delete your account?</h3>
            <p>Type 'i confirm' to completely delete your account</p>
            <input 
              type="text" 
              value={confirmText} 
              onChange={handleConfirmChange} 
              placeholder="Type 'i confirm'" 
            />
            <button onClick={handleConfirmDelete}>Continue</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;

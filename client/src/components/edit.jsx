import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './edit.css';

const Edit = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname: '',
        birthDay: '',
        phoneNumber: '',
        role: '',
    });
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordPopupDisabled, setPasswordPopupDisabled] = useState(true);
    const [profilePic, setProfilePic] = useState('/images/profile-pic.png'); // Initial profile picture path
    const [profilePicFile, setProfilePicFile] = useState(null); // To keep track of the selected file
    const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    fullname: response.data.fullname,
                    birthDay: response.data.birthDay.slice(0, 10),
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role,
                });
                setProfilePic(response.data.profilePic || '/images/profile-pic.png'); // Set profile pic from server
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        // Enable confirm button if all password fields are filled and passwords match
        const { oldPassword, newPassword, confirmPassword } = passwordData;
        setPasswordPopupDisabled(
            !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword
        );
    }, [passwordData]);

    useEffect(() => {
        // Set hasChanges to true if any field in formData or profilePicFile is updated
        setHasChanges(
            Object.values(formData).some(value => value !== '') || profilePicFile !== null
        );
    }, [formData, profilePicFile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setHasChanges(true); // Mark as changed
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setProfilePic(reader.result);
                setProfilePicFile(file);
                setHasChanges(true); // Mark as changed

                // Automatically save the new profile picture
                try {
                    const token = localStorage.getItem('token');
                    const formDataToSend = new FormData();
                    formDataToSend.append('profilePic', file);

                    await axios.post('http://localhost:3001/upload-profile-pic', formDataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } catch (error) {
                    console.error('Error updating profile picture', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/profile', { ...formData, profilePic }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Profile updated successfully!');
            setHasChanges(false); // Reset changes after saving
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/change-password', passwordData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Password updated successfully!');
            setShowPasswordPopup(false);
        } catch (error) {
            console.error('Error changing password', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <section>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <ul>
                    <li>Profile</li>
                </ul>
            </header>
            <div className="profile-container">
                <div className="form-container">
                    <h2>General Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Enter your full name"
                                value={formData.fullname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Birthday</label>
                            <input
                                type="date"
                                name="birthDay"
                                value={formData.birthDay}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                name="role"
                                placeholder="Enter your role"
                                value={formData.role}
                                readOnly
                            />
                        </div>
                        <button
                            type="submit"
                            className={`save-btn ${hasChanges ? 'active' : 'inactive'}`}
                            disabled={!hasChanges}
                        >
                            Save All
                        </button>
                        <button
                            type="button"
                            className="change-password-btn"
                            onClick={() => setShowPasswordPopup(true)}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
                <div className="profile-card">
                    <div className="profile-photo-container">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="profile-photo"
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <h3>{formData.fullname}</h3>
                    <p>@{formData.username}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phoneNumber}</p>
                    <p>{formData.birthDay}</p>
                    <p>{formData.role}</p>
                </div>
            </div>

            {showPasswordPopup && (
                <div className="password-popup">
                    <div className="password-popup-content">
                        <h3>Change Password</h3>
                        <div className="form-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Enter your old password"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="password-popup-actions">
                            <button
                                className={`confirm-button ${passwordPopupDisabled ? 'disabled' : ''}`}
                                onClick={handlePasswordSubmit}
                                disabled={passwordPopupDisabled}
                            >
                                Confirm
                            </button>
                            <button onClick={() => setShowPasswordPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Edit;

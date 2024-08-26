// Modal.js
import React from 'react';
import './modal.css';

const Modal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>User Details</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Full Name:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        <p><strong>Birthday:</strong> {new Date(user.birthDay).toLocaleDateString()}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;

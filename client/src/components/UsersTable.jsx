import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch } from 'react-icons/fi';
import './usersTable.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchFields, setSearchFields] = useState({
    username: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    birthDay: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchFields.username.toLowerCase()) &&
      user.fullname.toLowerCase().includes(searchFields.fullname.toLowerCase()) &&
      user.email.toLowerCase().includes(searchFields.email.toLowerCase()) &&
      user.phoneNumber.toLowerCase().includes(searchFields.phoneNumber.toLowerCase()) &&
      (user.birthDay && new Date(user.birthDay).toLocaleDateString().includes(searchFields.birthDay.toLowerCase())) &&
      user.role.toLowerCase().includes(searchFields.role.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchFields, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < pageNumbers) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    } else if (direction === 'first') {
      setCurrentPage(1);
    } else if (direction === 'last') {
      setCurrentPage(pageNumbers);
    }
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/users/${userToDelete._id}`);
      const updatedUsers = users.filter(user => user._id !== userToDelete._id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setUserToDelete(null); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${editingUser._id}`, editingUser);
      const updatedUsers = users.map(user => user._id === editingUser._id ? editingUser : user);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  const closeModal = () => {
    setEditingUser(null);
    setViewingUser(null);
    setUserToDelete(null); // Close the confirmation modal
    setSearchVisible(false); // Close the search popout
  };

  // Calculate user range display
  const startUserIndex = indexOfFirstUser + 1;
  const endUserIndex = Math.min(indexOfLastUser, filteredUsers.length);

  return (
    <div className="table-wrapper">
      <div className="table-controls">
        <button className="search-button" onClick={() => setSearchVisible(true)}>
          <FiSearch />
        </button>
        <span className="users-count">{`${startUserIndex} - ${endUserIndex} / ${filteredUsers.length}`}</span>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th colSpan="7">
              {/* No search bar here */}
            </th>
          </tr>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Birthday</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{new Date(user.birthDay).toLocaleDateString()}</td>
              <td>{user.role}</td>
              <td className="action-icons">
                <FiEye className="icon view-icon" title="View" onClick={() => handleViewClick(user)} />
                <FiEdit className="icon edit-icon" title="Edit" onClick={() => handleEditClick(user)} />
                <FiTrash2 className="icon delete-icon" title="Delete" onClick={() => handleDeleteClick(user)} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7">
              <div className="pagination">
                <button onClick={() => handlePageChange('first')} disabled={currentPage === 1}>
                  <FiChevronsLeft />
                </button>
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                  <FiChevronLeft />
                </button>
                <span className="page-info">{`${currentPage} / ${pageNumbers}`}</span>
                <button onClick={() => handlePageChange('next')} disabled={currentPage === pageNumbers}>
                  <FiChevronRight />
                </button>
                <button onClick={() => handlePageChange('last')} disabled={currentPage === pageNumbers}>
                  <FiChevronsRight />
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={handleEditChange}
                  disabled
                />
              </label>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullname"
                  value={editingUser.fullname}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editingUser.phoneNumber}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Birthday:
                <input
                  type="date"
                  name="birthDay"
                  value={new Date(editingUser.birthDay).toISOString().substring(0, 10)}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Role:
                <input
                  type="text"
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditChange}
                />
              </label>
              <div className="button-group">
                <button type="submit">Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>User Details</h3>
            <p><strong>Username:</strong> {viewingUser.username}</p>
            <p><strong>Full Name:</strong> {viewingUser.fullname}</p>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Phone Number:</strong> {viewingUser.phoneNumber}</p>
            <p><strong>Birthday:</strong> {new Date(viewingUser.birthDay).toLocaleDateString()}</p>
            <p><strong>Role:</strong> {viewingUser.role}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="button-group">
              <button onClick={confirmDelete}>Delete</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

{/* Search Popout */}
{searchVisible && (
  <div className="search-popout">
    <div className="search-content">
      <span className="close" onClick={closeModal}>&times;</span>
      <h3>Search Users</h3>
      <form>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={searchFields.username}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="fullname"
            value={searchFields.fullname}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={searchFields.email}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={searchFields.phoneNumber}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Birthday:
          <input
            type="text"
            name="birthDay"
            value={searchFields.birthDay}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={searchFields.role}
            onChange={handleSearchChange}
          />
        </label>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default UsersTable;

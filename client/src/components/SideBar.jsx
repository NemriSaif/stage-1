import React from 'react'
import { Link } from 'react-router-dom';

function SideBar({isOpen}) {
  return (
    <nav id="sidebar" className={`sidebar js-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content js-simplebar">
        <Link className="sidebar-brand" to="/">
          <span className="align-middle">AdminKit</span>
        </Link>

        <ul className="sidebar-nav">
            <li className="sidebar-header">
                Pages
            </li>

            <li className="sidebar-item active">
                <a className="sidebar-link" href="index.html">
      <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Client's list</span>
    </a>
            </li>

            <li className="sidebar-item">
                <a className="sidebar-link" href="pages-profile.html">
      <i className="align-middle" data-feather="user"></i> <span className="align-middle">Profile</span>
    </a>
            </li>

            <li className="sidebar-item">
                <a className="sidebar-link" href="pages-sign-in.html">
      <i className="align-middle" data-feather="log-in"></i> <span className="align-middle">User's list</span>
    </a>
            </li>

            <li className="sidebar-item">
                <a className="sidebar-link" href="pages-sign-up.html">
      <i className="align-middle" data-feather="user-plus"></i> <span className="align-middle">Blank</span>
    </a>
            </li>

            

            

            
            
            
        </ul>

    </div>
</nav>
  )
}

export default SideBar
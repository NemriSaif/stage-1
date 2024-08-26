import React, {useState} from 'react'
import Dashboard from './components/Dashboard';
import Details from './components/Details';
import {Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import FeatherIconInitializer from './components/FeatherIconInitializer';
import Login from './components/signIn';
import SignUp from './components/signUp';
import Home from './components/Home';
import Profile from './components/profile';
import Edit from './components/edit';
import './App.css';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (

    <Router>
      <div className="wrapper">
      <FeatherIconInitializer />
        <SideBar isOpen={sidebarOpen} />
        <div className={`main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <NavBar toggleSidebar={toggleSidebar} />
          <div className="content">
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit" element={<Edit />} />
            <Route path='/Dashboard' element={<Dashboard/>}/>
            <Route path='/Details/:id' element={<Details/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>


    
   

  )
}

export default App
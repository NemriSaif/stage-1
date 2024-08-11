import React, {useState} from 'react'
import Dashboard from './components/Dashboard';
import Details from './components/Details';
import {Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import FeatherIconInitializer from './components/FeatherIconInitializer';
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
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/Details/:id' element={<Details/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>


    
   

  )
}

export default App
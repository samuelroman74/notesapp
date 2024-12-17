// src/App.js
import React, { useState } from 'react';
import Taskbar from './Components/Taskbar.jsx';
import Concepts from './Components/Concepts.jsx';
import AllConcepts from './Components/AllConcepts.jsx';
import './App.css';
//import ProfileView from './components/ProfileView';
//import SettingsView from './components/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState('Create Concepts');

  const showConcepts = () => setCurrentView('Create Concepts');
  const showAllConcepts = () => setCurrentView('View All Concepts');
  //const showProfile = () => setCurrentView('Profile');
  //const showSettings = () => setCurrentView('Settings');

  const taskbarItems = [
    { label: 'Create Concepts', onClick: showConcepts },
    { label: 'View All Concepts', onClick: showAllConcepts },
    //{ label: 'Profile', onClick: showProfile },
    //{ label: 'Settings', onClick: showSettings },
  ];

  return (
    <div className="App">
      <Taskbar items={taskbarItems} />
      <div className="content">
        {currentView === 'Create Concepts' && <Concepts />}
        {currentView === 'View All Concepts' && <AllConcepts />}
      </div>
    </div>
  );
}

export default App;

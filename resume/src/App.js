import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Pages/Header';
import Professional from './Pages/Professional';
import Home from './Home/Home';
import Core from './Pages/Core';
import Experience from './Pages/Experience';
import Certifiaction from './Pages/Certifiaction';
import Achievement from './Pages/Acheivement';
import Project from './Pages/Project';
import Education from './Pages/Education';
import SoftSkills from './Pages/SoftSkills';
import Hobbies from './Pages/Hobbies';

const App = () => {
 

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route 
          path="page/header" 
          element={<Header  />} 
        />
        <Route 
          path="page/professional-summary" 
          element={<Professional  />} 
        />
        <Route path="page/core-competency"
          element={<Core></Core>}
        />
        <Route path="page/experience"
          element={<Experience/>}
        />
        <Route path="page/certification"
          element={<Certifiaction/>}
        />
        <Route path="page/acheivement" 
          element={<Achievement/>}
        />
        <Route path="page/project"
          element={<Project/>}
        />
        <Route path="page/education"
          element={<Education/>}
        />
        <Route path="page/soft-skill"
          element={<SoftSkills/>}
        />
        <Route path="/page/hobbies"
          element={<Hobbies/>}
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;

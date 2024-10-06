import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css"
import About from '../About/About';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/page/header'); // Navigates to the Header component
  };

  return (
    <div className="home-container">
      <h1>Welcome to Resume Builder</h1>
      <p>Create a professional resume in minutes with our easy-to-use builder. Stand out from the competition and showcase your skills effectively.</p>
      
      <section className="features">
        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Easy to Use:</strong> Simple, intuitive design for hassle-free resume creation.</li>
         
         
          <li><strong>Export in Multiple Formats:</strong> Download your resume as a PDF.</li>
          <li><strong>Responsive Layout:</strong> Resumes that look great on any device.</li>
        </ul>
      </section>
      
      <section className="steps">
        <h2>How It Works:</h2>
        <ol>
          <li><strong>Step 1:</strong> Enter your details, education, and work experience.</li>
          
          
          <li><strong>Step 2:</strong> Download and share your professionally designed resume.</li>
        </ol>
      </section>

      <button className='create-resume-btn ' onClick={handleClick}>Create Your Resume Now</button>
      <About/>

      
    </div>
  );
}

export default Home;

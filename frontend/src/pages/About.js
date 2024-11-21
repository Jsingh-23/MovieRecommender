// src/pages/About.js
import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1 className="about-title">About MovieRecommender</h1>
        <p className="about-subtitle">
          Discover your next favorite movie through personalized recommendations
        </p>
      </section>

      <section className="about-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h2>Smart Recommendations</h2>
            <p>
              Powered by TensorFlow and machine learning, our recommendation engine analyzes
              movie features and your preferences to suggest films you'll love. Using
              content-based filtering, we process data from over 45,000 movies to find
              the perfect matches for you.
            </p>
          </div>

          <div className="feature-card">
            <h2>Track Your Movies</h2>
            <p>
              Keep track of what you've watched and what you want to watch next with
              personalized watchlists. Mark movies as watched, save them for later,
              and never lose track of that movie someone recommended to you.
            </p>
          </div>

          <div className="feature-card">
            <h2>Rate & Review</h2>
            <p>
              Share your thoughts with the community through ratings and reviews.
              Help others discover great films while building your own viewing
              profile for better recommendations.
            </p>
          </div>

          <div className="feature-card">
            <h2>Advanced Search</h2>
            <p>
              Find exactly what you're looking for with our powerful search feature.
              Filter movies by genre, year, rating, and more to discover films that
              match your interests.
            </p>
          </div>
        </div>

        <div className="tech-stack">
          <h2>Built With</h2>
          <div className="tech-list">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React</li>
                <li>Node.js</li>
                <li>Context API</li>
                <li>React Router</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Python</li>
                <li>Flask</li>
                <li>TensorFlow</li>
                <li>Pandas</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>Cloud Services</h3>
              <ul>
                <li>Firebase Authentication</li>
                <li>Cloud Firestore</li>
                <li>Real-time Updates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-footer">
          <h2>Get Started</h2>
          <p>
            Create an account to start discovering movies tailored to your taste.
            Rate films you've watched to improve your recommendations and join our
            community of movie enthusiasts.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
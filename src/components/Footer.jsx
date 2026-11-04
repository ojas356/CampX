import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="logo logo-footer">
            <span className="logo-mark">CX</span>
            <span className="logo-text">
              Camp<em>X</em>
            </span>
          </Link>
          <p>
            The official student-to-student bulletin board and marketplace for A.P. Shah Institute of Technology (APSIT), Thane. Pin your unused engineering gear and pass it on to fellow batchmates.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Bulletin Board</h4>
          <ul>
            <li><Link to="/browse">Browse All Pins</Link></li>
            <li><Link to="/sell">Pin an Item for Sale</Link></li>
            <li><Link to="/my-listings">My Pinned Listings</Link></li>
            <li><Link to="/messages">Campus Chat</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-links">
          <h4>Departments & Gear</h4>
          <ul>
            <li><Link to="/browse?category=Electronics">Calculators & Arduino</Link></li>
            <li><Link to="/browse?category=Engineering%20Tools">Drafters & Drawing</Link></li>
            <li><Link to="/browse?category=Books%20%26%20Notes">MU Semester Books</Link></li>
            <li><Link to="/browse?category=Lab%20Coats%20%26%20Kits">Workshop & Lab Coats</Link></li>
          </ul>
        </div>

        {/* Campus Safety & Location */}
        <div className="footer-contact">
          <h4>Campus Handover</h4>
          <ul>
            <li>A.P. Shah Institute of Technology</li>
            <li>Kasarvadavali, Ghodbunder Rd, Thane (W)</li>
            <li>Meet at Canteen, Library Foyer, or Gate 1</li>
            <li>Verified @apsit.edu.in Students Only</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} CampX — A.P. Shah Institute of Technology Student Marketplace.</span>
          <span>Built with React & Kotlin Spring Boot REST API</span>
        </div>
      </div>
    </footer>
  );
}

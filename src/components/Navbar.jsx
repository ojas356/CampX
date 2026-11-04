import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { PlusCircle, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, switchStudent } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const demoStudents = api.getDemoStudents();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          {/* Zone 1: Brand Title */}
          <Link to="/" className="logo">
            <span className="logo-mark">CX</span>
            <span className="logo-text">
              Camp<em>X</em>
            </span>
          </Link>

          {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
          <nav className="main-nav hidden md:block" aria-label="Main Navigation">
            <ul className="nav-list">
              <li>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>
                  Browse Board
                </Link>
              </li>
              {currentUser ? (
                <>
                  <li>
                    <Link to="/my-listings" className={`nav-link ${isActive('/my-listings') ? 'active' : ''}`}>
                      My Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`}>
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="header-actions">
            <Link to="/sell" className="btn btn-primary btn-sm">
              <PlusCircle className="w-4 h-4" />
              Sell Item
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn btn btn-outline btn-sm"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-t-2 border-dashed border-[#f0cf8a]/40 px-4 py-3 bg-[#5c3a1e]/95 backdrop-blur-md">
            <ul className="flex flex-col gap-2 text-[#fff9ee] font-semibold text-sm">
              <li>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                  Browse Board
                </Link>
              </li>
              {currentUser ? (
                <>
                  <li>
                    <Link to="/my-listings" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                      My Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                      Profile ({currentUser.name})
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Glassmorphic Campus Utility Strip below header */}
      <div className="campus-glass-bar">
        <div className="container campus-glass-inner text-xs">
          <div className="flex items-center gap-2 font-medium text-[#2c2115] flex-wrap">
            <span className="font-bold">A.P. Shah Institute of Technology (APSIT)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#5a4a34]">Verified @apsit.edu.in Bulletin Board</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {currentUser ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#5a4a34] font-semibold">Test Student:</span>
                  {demoStudents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => switchStudent(s.id)}
                      title={`Switch user to ${s.name} (${s.collegeEmail})`}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                        currentUser.id === s.id
                          ? 'bg-[#b3352c] text-[#fff9ee] border-[#2c2115] shadow-xs'
                          : 'bg-[#fdf8ec]/80 text-[#2c2115] border-[#c9a86a] hover:bg-[#fdf8ec]'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <span aria-hidden="true" className="hidden sm:inline text-[#a5855a]">|</span>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-[#2c2115]">
                    Signed in: {currentUser.name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1 font-bold text-[#9c2f26] hover:underline cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 font-bold">
                <Link to="/login" className="text-[#2f5b8a] hover:underline">
                  Student Log In
                </Link>
                <span aria-hidden="true">·</span>
                <Link to="/register" className="text-[#b3352c] hover:underline">
                  Register with @apsit.edu.in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [collegeEmail, setCollegeEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const demoStudents = api.getDemoStudents();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!collegeEmail.trim() || !password) {
      setError('Please provide both your college email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(collegeEmail.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (student) => {
    setCollegeEmail(student.collegeEmail);
    setPassword('Password@123');
    setError('');
  };

  return (
    <div className="section">
      <div className="container">
        <div className="login-card mx-auto">
          <span className="eyebrow">A.P. Shah Institute of Technology</span>
          <h2>Sign In to CampX Board</h2>
          <p className="login-subtitle">
            Enter your official @apsit.edu.in student credentials.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#f2d8d2] border border-[#9c2f26] text-xs text-[#9c2f26] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">APSIT College Email</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="student.name@apsit.edu.in"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full mt-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In with College Email'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#c9a86a]">
            <span className="text-xs font-bold text-[#5a4a34] block mb-2 text-center">
              Quick Demo Student Accounts (Click to Fill):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {demoStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleQuickFill(s)}
                  className="btn btn-outline btn-sm"
                >
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center text-sm text-[#5a4a34]">
            New to CampX?{' '}
            <Link to="/register" className="font-bold text-[#b3352c] hover:underline">
              Register with @apsit.edu.in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

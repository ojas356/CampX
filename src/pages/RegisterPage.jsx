import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  validateStudentEmail, 
  validatePassword, 
  validatePhoneNumber 
} from '../utils/validators.js';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    collegeEmail: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [domainWarning, setDomainWarning] = useState('');

  const handleEmailChange = (val) => {
    setFormData({ ...formData, collegeEmail: val });
    if (val.includes('@') && !val.toLowerCase().endsWith('@apsit.edu.in')) {
      setDomainWarning('Notice: Non-APSIT emails will be rejected upon submission.');
    } else {
      setDomainWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    const emailValidation = validateStudentEmail(formData.collegeEmail);
    if (!emailValidation.valid) {
      newErrors.collegeEmail = emailValidation.message;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.valid) {
      newErrors.phoneNumber = phoneValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        collegeEmail: formData.collegeEmail.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim()
      });
      navigate('/');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="login-card max-w-lg mx-auto">
          <span className="eyebrow">A.P. Shah Institute of Technology</span>
          <h2>Join CampX Marketplace</h2>
          <p className="login-subtitle">
            Exclusively for APSIT students with a valid @apsit.edu.in email address.
          </p>

          <div className="mb-5 p-3 rounded-lg bg-[#f2e0bd] border border-[#96631c] flex items-start gap-2 text-xs text-[#2c2115]">
            <ShieldAlert className="w-4 h-4 text-[#96631c] shrink-0 mt-0.5" />
            <span>
              Registration is strictly restricted to students of <strong>A.P. Shah Institute of Technology</strong>. Your email must end with <strong>@apsit.edu.in</strong>.
            </span>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-[#f2d8d2] border border-[#9c2f26] text-xs text-[#9c2f26] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="regName">Student Full Name *</label>
              <input
                id="regName"
                type="text"
                placeholder="e.g. Rohan Kulkarni"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-xs text-[#9c2f26] mt-1 mb-0 font-bold">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="regEmail">Official College Email (@apsit.edu.in) *</label>
              <input
                id="regEmail"
                type="email"
                placeholder="your.roll@apsit.edu.in"
                value={formData.collegeEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
              />
              {errors.collegeEmail && (
                <p className="text-xs text-[#9c2f26] mt-1 mb-0 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.collegeEmail}
                </p>
              )}
              {domainWarning && !errors.collegeEmail && (
                <p className="text-xs text-[#96631c] mt-1 mb-0 font-bold">{domainWarning}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="regPhone">Mobile Number (For campus handover) *</label>
              <input
                id="regPhone"
                type="tel"
                placeholder="9876543210 or +919876543210"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              {errors.phoneNumber && (
                <p className="text-xs text-[#9c2f26] mt-1 mb-0 font-bold">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="regPassword">Password *</label>
                <input
                  id="regPassword"
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                {errors.password && <p className="text-xs text-[#9c2f26] mt-1 mb-0 font-bold">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="regConfirmPassword">Confirm Password *</label>
                <input
                  id="regConfirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-[#9c2f26] mt-1 mb-0 font-bold">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full mt-2"
            >
              {submitting ? 'Registering Student...' : 'Create APSIT Student Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-[#5a4a34]">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#b3352c] hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

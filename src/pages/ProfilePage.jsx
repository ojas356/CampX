import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { validatePhoneNumber } from '../utils/validators.js';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      setError(phoneValidation.message);
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), phoneNumber: phoneNumber.trim() });
      setSuccess('Student ID card updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section pt-8">
      <div className="container sell-inner">
        <div className="section-heading mb-6">
          <span className="eyebrow">APSIT Student ID Card</span>
          <h1>My Campus Profile</h1>
          <p className="mb-0">
            Manage your contact details displayed to fellow students when you list or inquire about items.
          </p>
        </div>

        <div className="product-form">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#f2d8d2] border border-[#9c2f26] text-xs text-[#9c2f26] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-[#e6ead9] border border-[#3f6b3f] text-xs text-[#3f6b3f] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center gap-4 pb-6 mb-6 border-b-2 border-dashed border-[#c9a86a]">
            <div className="w-16 h-16 rounded-full bg-[#b3352c] text-[#fff9ee] font-['Kalam'] text-2xl font-bold flex items-center justify-center border-2 border-[#2c2115] shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl mb-0">{currentUser.name}</h2>
              <p className="text-sm text-[#5a4a34] mb-0">
                {currentUser.collegeEmail} · Verified A.P. Shah Institute of Technology Student
              </p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="profileName">Student Full Name</label>
                <input
                  id="profileName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profilePhone">Phone Number (Visible to APSIT buyers)</label>
                <input
                  id="profilePhone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+919876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profileEmail">College Email (Locked to @apsit.edu.in)</label>
                <input
                  id="profileEmail"
                  type="email"
                  value={currentUser.collegeEmail}
                  disabled
                  className="opacity-65 cursor-not-allowed"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(currentUser.name);
                    setPhoneNumber(currentUser.phoneNumber);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f7efd8] border border-[#e6d9b8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34] block">Full Name</span>
                  <strong className="text-base text-[#2c2115]">{currentUser.name}</strong>
                </div>

                <div className="p-4 rounded-xl bg-[#f7efd8] border border-[#e6d9b8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34] block">Official College Email</span>
                  <strong className="text-base text-[#2c2115]">{currentUser.collegeEmail}</strong>
                </div>

                <div className="p-4 rounded-xl bg-[#f7efd8] border border-[#e6d9b8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34] block">Mobile Number</span>
                  <strong className="text-base text-[#2c2115]">{currentUser.phoneNumber}</strong>
                </div>

                <div className="p-4 rounded-xl bg-[#f7efd8] border border-[#e6d9b8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34] block">Member Since</span>
                  <strong className="text-base text-[#2c2115]">
                    {new Date(currentUser.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </strong>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

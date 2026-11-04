import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on initial load
    const savedToken = localStorage.getItem('campx_token');
    const savedUser = localStorage.getItem('campx_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('campx_token');
        localStorage.removeItem('campx_user');
      }
    } else {
      // Default to demo student Arav Patel for an instant, friction-free experience
      const demoStudents = api.getDemoStudents();
      if (demoStudents && demoStudents.length > 0) {
        const defaultStudent = demoStudents[0];
        setCurrentUser(defaultStudent);
        setToken(`mock-jwt-token-${defaultStudent.id}`);
        localStorage.setItem('campx_user', JSON.stringify(defaultStudent));
        localStorage.setItem('campx_token', `mock-jwt-token-${defaultStudent.id}`);
      }
    }
    setLoading(false);
  }, []);

  const login = async (collegeEmail, password) => {
    const res = await api.login({ collegeEmail, password });
    setCurrentUser(res.student);
    setToken(res.token);
    localStorage.setItem('campx_token', res.token);
    localStorage.setItem('campx_user', JSON.stringify(res.student));
    return res.student;
  };

  const register = async (studentData) => {
    const res = await api.register(studentData);
    setCurrentUser(res.student);
    setToken(res.token);
    localStorage.setItem('campx_token', res.token);
    localStorage.setItem('campx_user', JSON.stringify(res.student));
    return res.student;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('campx_token');
    localStorage.removeItem('campx_user');
  };

  const switchStudent = (studentId) => {
    const students = api.getDemoStudents();
    const target = students.find(s => String(s.id) === String(studentId));
    if (target) {
      setCurrentUser(target);
      const newToken = `mock-jwt-token-${target.id}`;
      setToken(newToken);
      localStorage.setItem('campx_user', JSON.stringify(target));
      localStorage.setItem('campx_token', newToken);
    }
  };

  const updateProfile = async (data) => {
    if (!currentUser) return;
    const updated = await api.updateProfile(data, currentUser.id);
    setCurrentUser(updated);
    localStorage.setItem('campx_user', JSON.stringify(updated));
    return updated;
  };

  const value = {
    currentUser,
    token,
    loading,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    switchStudent,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

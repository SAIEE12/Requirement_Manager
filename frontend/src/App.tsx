// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import DomainsPage from './pages/DomainsPage';
import { RootState, AppDispatch } from './store/store';
import { checkAuth } from './store/slices/authSlice';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/domains" element={<ProtectedRoute><DomainsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
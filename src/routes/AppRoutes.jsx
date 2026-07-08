import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BrowseDonations from '../pages/BrowseDonations';
import DonationDetails from '../pages/DonationDetails';
import NotFound from '../pages/NotFound';

// Protected Pages
import DonorDashboard from '../pages/DonorDashboard';
import AddDonation from '../pages/AddDonation';
import MyDonations from '../pages/MyDonations';
import ReceiverDashboard from '../pages/ReceiverDashboard';
import MyRequests from '../pages/MyRequests';
import AdminDashboard from '../pages/AdminDashboard';

// Route guards
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      />
      <Route
        path="/browse-donations"
        element={
          <MainLayout>
            <BrowseDonations />
          </MainLayout>
        }
      />
      <Route
        path="/donation/:id"
        element={
          <MainLayout>
            <DonationDetails />
          </MainLayout>
        }
      />

      {/* Donor Protected Routes with DashboardLayout */}
      <Route
        path="/donor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DashboardLayout>
              <DonorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-donation"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DashboardLayout>
              <AddDonation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-donations"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DashboardLayout>
              <MyDonations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Receiver Protected Routes with DashboardLayout */}
      <Route
        path="/receiver-dashboard"
        element={
          <ProtectedRoute allowedRoles={['receiver']}>
            <DashboardLayout>
              <ReceiverDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute allowedRoles={['receiver']}>
            <DashboardLayout>
              <MyRequests />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes with DashboardLayout */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route inside MainLayout */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

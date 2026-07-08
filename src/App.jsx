import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonationProvider } from './context/DonationContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DonationProvider>
          <AppRoutes />
        </DonationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

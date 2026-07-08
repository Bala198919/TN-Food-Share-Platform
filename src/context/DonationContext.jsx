import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const DonationContext = createContext(null);

const DONATIONS_API = `${API_BASE_URL}/api/donations`;
const REQUESTS_API = `${API_BASE_URL}/api/requests`;

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    count: 0
  });

  const getHeaders = () => {
    const token = localStorage.getItem('food_share_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  const refreshDonations = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.city && filters.city !== 'all') queryParams.append('city', filters.city);
      if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.foodType && filters.foodType !== 'all') queryParams.append('foodType', filters.foodType);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      // Default to status=all in context so dashboards get their stats
      if (filters.status) {
        queryParams.append('status', filters.status);
      } else {
        queryParams.append('status', 'all');
      }

      const res = await fetch(`${DONATIONS_API}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setDonations(data.data);
        setPagination({
          total: data.total || data.count || 0,
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          count: data.count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDonations();
  }, []);

  const addDonation = async (newDonation) => {
    try {
      const res = await fetch(DONATIONS_API, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newDonation)
      });
      const data = await res.json();
      
      if (data.success) {
        await refreshDonations();
        return { success: true, donation: data.data };
      } else {
        return { success: false, message: data.message || 'Failed to list food item.' };
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const claimDonation = async (donationId) => {
    try {
      const res = await fetch(`${REQUESTS_API}/claim/${donationId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes: 'Surplus food collection claim' })
      });
      const data = await res.json();
      
      if (data.success) {
        await refreshDonations();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to claim food item.' };
      }
    } catch (error) {
      console.error('Error claiming donation:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const cancelClaim = async (donationId) => {
    try {
      const res = await fetch(`${REQUESTS_API}/cancel/${donationId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        await refreshDonations();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to cancel claim.' };
      }
    } catch (error) {
      console.error('Error cancelling claim:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const updateDonationStatus = async (donationId, status) => {
    try {
      const res = await fetch(`${DONATIONS_API}/${donationId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      
      if (data.success) {
        await refreshDonations();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to update donation status.' };
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const deleteDonation = async (donationId) => {
    try {
      const res = await fetch(`${DONATIONS_API}/${donationId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        await refreshDonations();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to delete listing.' };
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        pagination,
        addDonation,
        claimDonation,
        cancelClaim,
        updateDonationStatus,
        deleteDonation,
        refreshDonations,
        loading
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
};

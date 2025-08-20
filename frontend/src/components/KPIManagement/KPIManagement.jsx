import React, { useState, useEffect } from 'react';
import './KPIManagement.css';
import apiService from '../../utils/api';

const ApiConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic API endpoint (this will fail with 401 but proves connection works)
        await apiService.get('/users/lecturers');
        setConnectionStatus('✅ Connected! (Got expected 401 - auth working)');
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setConnectionStatus('✅ Connected! Backend is working (401 = auth required)');
        } else if (error.message.includes('CORS')) {
          setConnectionStatus('❌ CORS Error - Check your appsettings.json');
        } else if (error.message.includes('fetch')) {
          setConnectionStatus('❌ Connection Failed - Is backend running on port 5158?');
        } else {
          setConnectionStatus(`❌ Error: ${error.message}`);
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Connection Test</h3>
      <p>{connectionStatus}</p>
    </div>
  );
};

export default ApiConnectionTest;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import SendTokens from './components/SendTokens';
import TransactionHistory from './components/TransactionHistory';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
    fetchActiveAccount();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      if (response.data.success) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchActiveAccount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/active`);
      if (response.data.success) {
        setActiveAccount(response.data.account);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active account:', error);
      setLoading(false);
    }
  };

  const createAccount = async (nickname) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/create`, {
        nickname: nickname
      });
      if (response.data.success) {
        await fetchAccounts();
        return response.data.account;
      }
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  const switchAccount = async (accountId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/switch`, {
        account_id: accountId
      });
      if (response.data.success) {
        setActiveAccount(response.data.account);
        await fetchAccounts();
      }
    } catch (error) {
      console.error('Error switching account:', error);
    }
  };

  const sendTokens = async (toAddress, amount) => {
    if (!activeAccount) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/send`, {
        from_account_id: activeAccount.id,
        to_address: toAddress,
        amount: parseFloat(amount)
      });
      
      if (response.data.success) {
        await fetchAccounts();
        await fetchActiveAccount();
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    await fetchAccounts();
    await fetchActiveAccount();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Sui Wallet...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView}
        activeAccount={activeAccount}
      />
      
      <div className="main-content">
        {activeView === 'dashboard' && (
          <Dashboard 
            accounts={accounts}
            activeAccount={activeAccount}
            refreshBalance={refreshBalance}
          />
        )}
        
        {activeView === 'accounts' && (
          <AccountManager 
            accounts={accounts}
            activeAccount={activeAccount}
            createAccount={createAccount}
            switchAccount={switchAccount}
          />
        )}
        
        {activeView === 'send' && (
          <SendTokens 
            activeAccount={activeAccount}
            sendTokens={sendTokens}
          />
        )}
        
        {activeView === 'history' && (
          <TransactionHistory 
            activeAccount={activeAccount}
          />
        )}
      </div>
    </div>
  );
}

export default App;
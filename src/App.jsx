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
      console.log('Fetching accounts...');
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      console.log('Accounts response:', response.data);
      
      if (response.data.success) {
        setAccounts(response.data.accounts);
        console.log('✅ Accounts loaded:', response.data.accounts.length);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchActiveAccount = async () => {
    try {
      console.log('Fetching active account...');
      const response = await axios.get(`${API_BASE_URL}/accounts/active`);
      console.log('Active account response:', response.data);
      
      if (response.data.success) {
        setActiveAccount(response.data.account);
        console.log('✅ Active account loaded:', response.data.account?.nickname);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active account:', error);
      setLoading(false);
    }
  };

  const createAccount = async (nickname) => {
    try {
      console.log('Creating account with nickname:', nickname);
      
      const response = await axios.post(`${API_BASE_URL}/accounts/create`, {
        nickname: nickname
      });
      
      console.log('Create account response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Account created successfully:', response.data.account);
        
        // Refresh accounts list
        await fetchAccounts();
        await fetchActiveAccount();
        
        return response.data.account;
      } else {
        throw new Error(response.data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('❌ Error creating account:', error);
      throw error;
    }
  };

  const switchAccount = async (accountId) => {
    try {
      console.log('Switching to account:', accountId);
      
      const response = await axios.post(`${API_BASE_URL}/accounts/switch`, {
        account_id: accountId
      });
      
      if (response.data.success) {
        setActiveAccount(response.data.account);
        await fetchAccounts();
        console.log('✅ Switched to:', response.data.account.nickname);
      }
    } catch (error) {
      console.error('❌ Error switching account:', error);
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      console.log('Deleting account:', accountId);
      
      const response = await axios.delete(`${API_BASE_URL}/accounts/delete/${accountId}`);
      
      if (response.data.success) {
        console.log('✅ Account deleted successfully');
        
        // Refresh accounts and active account
        await fetchAccounts();
        await fetchActiveAccount();
      } else {
        throw new Error(response.data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      throw error;
    }
  };

  const sendTokens = async (toAddress, amount) => {
    if (!activeAccount) return;
    
    try {
      console.log('Sending tokens:', { to: toAddress, amount });
      
      const response = await axios.post(`${API_BASE_URL}/send`, {
        from_account_id: activeAccount.id,
        to_address: toAddress,
        amount: parseFloat(amount)
      });
      
      if (response.data.success) {
        console.log('✅ Transaction successful:', response.data.transaction);
        
        // Refresh balances
        await fetchAccounts();
        await fetchActiveAccount();
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error sending tokens:', error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    console.log('Refreshing balances...');
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
            deleteAccount={deleteAccount}
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
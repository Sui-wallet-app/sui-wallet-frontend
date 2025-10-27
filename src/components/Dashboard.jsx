import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard({ accounts, activeAccount, refreshBalance }) {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!activeAccount) return;
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/${activeAccount.address}?limit=10`
      );
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      fetchTransactions();
    }
  }, [activeAccount, fetchTransactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    await fetchTransactions();
    setTimeout(() => setRefreshing(false), 500);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  // Generate chart data (mock data for visualization)
  const chartData = [
    { name: 'Mon', balance: totalBalance * 0.85 },
    { name: 'Tue', balance: totalBalance * 0.90 },
    { name: 'Wed', balance: totalBalance * 0.88 },
    { name: 'Thu', balance: totalBalance * 0.95 },
    { name: 'Fri', balance: totalBalance * 0.92 },
    { name: 'Sat', balance: totalBalance * 0.98 },
    { name: 'Sun', balance: totalBalance },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button 
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Wallet size={32} />
          </div>
          <div className="stat-content">
            <h3>Total Balance</h3>
            <p className="stat-value">{totalBalance.toFixed(4)} SUI</p>
            <span className="stat-label">Across {accounts.length} accounts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>Received</h3>
            <p className="stat-value">
              {transactions.filter(tx => tx.type === 'received').length}
            </p>
            <span className="stat-label">Total transactions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <TrendingDown size={32} />
          </div>
          <div className="stat-content">
            <h3>Sent</h3>
            <p className="stat-value">
              {transactions.filter(tx => tx.type === 'sent').length}
            </p>
            <span className="stat-label">Total transactions</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Balance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #00ff88',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#00ff88" 
              strokeWidth={3}
              dot={{ fill: '#00ff88', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activeAccount && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet</p>
          ) : (
            <div className="transaction-list">
              {transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="transaction-item">
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === 'received' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div className="tx-details">
                    <span className="tx-type">
                      {tx.type === 'received' ? 'Received' : 'Sent'}
                    </span>
                    <span className="tx-digest">
                      {tx.digest.substring(0, 12)}...
                    </span>
                  </div>
                  <span className={`tx-status ${tx.status}`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
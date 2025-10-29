import React, { useState } from 'react';
import AccountCard from './AccountCard';
import { Plus, AlertCircle } from 'lucide-react';

function AccountManager({ accounts, activeAccount, createAccount, switchAccount }) {
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createAccount(nickname.trim() || 'Account');
      setNickname('');
      setShowForm(false);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-manager">
      {/* Header */}
      <div className="section-header">
        <h2>Manage Accounts</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(prev => !prev)}
        >
          <Plus size={20} /> Create Account
        </button>
      </div>

      {/* Create Account Form */}
      {showForm && (
        <div className="create-account-form">
          <h3>Create New Account</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Account nickname (optional)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
            />
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
          {error && (
            <div className="error-message">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>
      )}

      {/* Accounts Grid */}
      <div className="accounts-grid">
        {accounts.length === 0 ? (
          <div className="empty-state">
            <p>No accounts yet. Create your first account to get started!</p>
          </div>
        ) : (
          accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              isActive={activeAccount?.id === account.id}
              onSwitch={() => switchAccount(account.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AccountManager;

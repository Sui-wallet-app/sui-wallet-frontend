import React, { useState } from 'react';
import AccountCard from './AccountCard';
import { Plus, AlertCircle } from 'lucide-react';

function AccountManager({ accounts, activeAccount, createAccount, switchAccount, deleteAccount, refreshBalance }) {
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newAccount = await createAccount(nickname.trim() || 'Account');
      if (newAccount) {
        setSuccess(`Account "${nickname || 'Account'}" created successfully!`);
        setNickname('');
        setShowForm(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      await deleteAccount(accountId);
      setSuccess('Account deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      setTimeout(() => setError(''), 3000);
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
          <Plus size={20} /> {showForm ? 'Cancel' : 'Create Account'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <AlertCircle size={16} /> {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}

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
              disabled={loading}
            />
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setNickname('');
                  setError('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
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
              onDelete={handleDelete}
              refreshBalance={refreshBalance}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AccountManager;
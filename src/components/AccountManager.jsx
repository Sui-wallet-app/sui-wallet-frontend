import React, { useState } from 'react';
import AccountCard from './AccountCard';
import { Plus, AlertCircle } from 'lucide-react';

function AccountManager({ accounts, activeAccount, createAccount, switchAccount }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await createAccount(nickname || 'Account');
      setNickname('');
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="account-manager">
      <div className="section-header">
        <h2>Manage Accounts</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={20} />
          Create Account
        </button>
      </div>

      {showCreateForm && (
        <div className="create-account-form">
          <h3>Create New Account</h3>
          <form onSubmit={handleCreateAccount}>
            <input
              type="text"
              placeholder="Account nickname (optional)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
            />
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}

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
import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

function SendTokens({ activeAccount, sendTokens }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!activeAccount) {
      setError('No active account. Please select an account first.');
      return;
    }

    if (!recipient || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (parseFloat(amount) > (activeAccount.balance || 0)) {
      setError('Insufficient balance.');
      return;
    }

    setSending(true);

    try {
      const result = await sendTokens(recipient, amount);
      
      if (result.success) {
        setSuccess(`Successfully sent ${amount} SUI!`);
        setRecipient('');
        setAmount('');
      } else {
        setError(result.error || 'Transaction failed.');
      }
    } catch (err) {
      setError('Failed to send tokens. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-tokens">
      <div className="section-header">
        <h2>Send SUI Tokens</h2>
      </div>

      {!activeAccount ? (
        <div className="warning-box">
          <AlertCircle size={24} />
          <p>Please select an account first to send tokens.</p>
        </div>
      ) : (
        <>
          <div className="account-info-box">
            <h3>Sending from</h3>
            <p className="account-name">{activeAccount.nickname}</p>
            <p className="account-balance">
              Available: {activeAccount.balance?.toFixed(4) || '0.0000'} SUI
            </p>
          </div>

          <form className="send-form" onSubmit={handleSend}>
            <div className="form-group">
              <label htmlFor="recipient">Recipient Address</label>
              <input
                id="recipient"
                type="text"
                className="input-field"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={sending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (SUI)</label>
              <input
                id="amount"
                type="number"
                step="0.0001"
                className="input-field"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={sending}
              />
              <div className="quick-amounts">
                <button
                  type="button"
                  onClick={() => setAmount('0.1')}
                  disabled={sending}
                >
                  0.1 SUI
                </button>
                <button
                  type="button"
                  onClick={() => setAmount('1')}
                  disabled={sending}
                >
                  1 SUI
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(((activeAccount.balance || 0) * 0.5).toFixed(4))}
                  disabled={sending}
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setAmount((activeAccount.balance || 0).toFixed(4))}
                  disabled={sending}
                >
                  Max
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={sending}
            >
              <Send size={20} />
              {sending ? 'Sending...' : 'Send Tokens'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default SendTokens;
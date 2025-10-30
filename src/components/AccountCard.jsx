import React, { useState } from 'react';
import { Copy, Check, Eye, QrCode, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function AccountCard({ account, isActive, onSwitch, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(account.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`account-card ${isActive ? 'active' : ''}`}>
      <div className="account-card-header">
        <h3>{account.nickname}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isActive && <span className="active-badge">Active</span>}
          <button 
            className="icon-btn delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete account"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="account-balance">
        <span className="balance-label">Balance</span>
        <span className="balance-value">{account.balance?.toFixed(4) || '0.0000'} SUI</span>
      </div>

      <div className="account-address">
        <span className="address-label">Address</span>
        <div className="address-container">
          <code className="address-text">{truncateAddress(account.address)}</code>
          <button 
            className="icon-btn"
            onClick={copyAddress}
            title="Copy address"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button 
            className="icon-btn"
            onClick={() => setShowQR(!showQR)}
            title="Show QR code"
          >
            <QrCode size={16} />
          </button>
        </div>
      </div>

      {showQR && (
        <div className="qr-container">
          <QRCodeSVG 
            value={account.address} 
            size={150}
            bgColor="#1a1a1a"
            fgColor="#00ff88"
            level="H"
            includeMargin={true}
          />
        </div>
      )}

      {!isActive && (
        <button 
          className="switch-account-btn"
          onClick={onSwitch}
        >
          <Eye size={16} />
          Switch to this account
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>Are you sure you want to delete <strong>{account.nickname}</strong>?</p>
            <p className="warning-text">This action cannot be undone!</p>
            <div className="modal-actions">
              <button 
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountCard;
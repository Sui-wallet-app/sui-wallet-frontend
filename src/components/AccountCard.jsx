import React, { useState } from 'react';
import { Copy, Check, Eye, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function AccountCard({ account, isActive, onSwitch }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <div className={`account-card ${isActive ? 'active' : ''}`}>
      <div className="account-card-header">
        <h3>{account.nickname}</h3>
        {isActive && <span className="active-badge">Active</span>}
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
    </div>
  );
}

export default AccountCard;
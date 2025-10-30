import React, { useState } from "react";
import { Copy, Check, Eye, QrCode, Trash2, Droplet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

function AccountCard({
  account,
  isActive,
  onSwitch,
  onDelete,
  refreshBalance,
}) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestingFunds, setRequestingFunds] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState("");

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
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRequestFunds = async () => {
    setRequestingFunds(true);
    setFaucetMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/faucet/request",
        {
          address: account.address,
        }
      );

      if (response.data.success) {
        setFaucetMessage("✅ Funds received!");
        if (refreshBalance) refreshBalance();
        setTimeout(() => setFaucetMessage(""), 3000);
      } else {
        setFaucetMessage(`❌ ${response.data.error}`);
        setTimeout(() => setFaucetMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error requesting funds:", error);
      setFaucetMessage("❌ Failed to request funds");
      setTimeout(() => setFaucetMessage(""), 3000);
    } finally {
      setRequestingFunds(false);
    }
  };

  return (
    <div className={`account-card ${isActive ? "active" : ""}`}>
      <div className="account-card-header">
        <h3>{account.nickname}</h3>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
        <span className="balance-value">
          {account.balance?.toFixed(4) || "0.0000"} SUI
        </span>
      </div>

      {faucetMessage && (
        <div
          className={`mini-message ${
            faucetMessage.includes("✅") ? "success" : "error"
          }`}
        >
          {faucetMessage}
        </div>
      )}

      <div className="account-address">
        <span className="address-label">Address</span>
        <div className="address-container">
          <code className="address-text">
            {truncateAddress(account.address)}
          </code>
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
          <div className="qr-wrapper">
            <QRCodeSVG
              value={account.address}
              size={180}
              bgColor="#1a1a1a"
              fgColor="#00ff88"
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-label">Scan to copy address</p>
        </div>
      )}

      <div className="account-actions">
        <button
          className="faucet-btn-small"
          onClick={handleRequestFunds}
          disabled={requestingFunds}
          title="Request testnet SUI"
        >
          <Droplet size={16} />
          {requestingFunds ? "Requesting..." : "Get Testnet SUI"}
        </button>

        {!isActive && (
          <button className="switch-account-btn" onClick={onSwitch}>
            <Eye size={16} />
            Switch to this account
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{account.nickname}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone!</p>
            <div className="modal-actions">
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
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

import React, { useState } from "react";
import { Copy, Check, Eye, QrCode, Trash2, Droplet, AlertCircle, Clock } from "lucide-react";
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
  const [deleteError, setDeleteError] = useState("");
  const [requestingFunds, setRequestingFunds] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState("");
  const [faucetError, setFaucetError] = useState("");

  const copyAddress = async () => {
    try {
      // Modern clipboard API (preferred)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(account.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback method for older browsers or non-HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = account.address;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            console.error("Fallback copy failed");
            alert("Copy failed. Please copy manually: " + account.address);
          }
        } catch (err) {
          console.error("Fallback copy error:", err);
          alert("Copy failed. Address: " + account.address);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Copy error:", error);
      // Show address in an alert as last resort
      alert("Address copied (fallback):\n" + account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    
    try {
      console.log(`Attempting to delete account ID: ${account.id}`);
      
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/accounts/delete/${account.id}`
      );
      
      if (response.data.success) {
        console.log("Delete successful:", response.data);
        setShowDeleteConfirm(false);
        if (onDelete) {
          // Pass the new active account if the deleted one was active
          await onDelete(account.id, response.data.new_active_account);
        }
      } else {
        console.error("Delete failed:", response.data);
        setDeleteError(response.data.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      console.error("Error response:", error.response);
      
      if (error.response?.data?.error) {
        setDeleteError(error.response.data.error);
      } else if (error.response?.status === 404) {
        setDeleteError("Account not found");
      } else if (error.response?.status === 400) {
        setDeleteError(error.response?.data?.error || "Cannot delete account");
      } else {
        setDeleteError("Failed to delete account. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleRequestFunds = async () => {
    setRequestingFunds(true);
    setFaucetMessage("");
    setFaucetError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/faucet/request",
        {
          address: account.address,
        }
      );

      if (response.data.success) {
        setFaucetMessage("✅ Funds received!");
        if (refreshBalance) refreshBalance();
        setTimeout(() => setFaucetMessage(""), 4000);
      } else {
        const errorMsg = response.data.message || response.data.error || "Failed to request funds";
        setFaucetError(errorMsg);
        setTimeout(() => setFaucetError(""), 6000);
      }
    } catch (error) {
      console.error("Error requesting funds:", error);
      console.error("Error response data:", error.response?.data);
      
      if (error.response?.status === 429) {
        // Rate limit error
        const backendMsg = error.response?.data?.message || error.response?.data?.error;
        const errorMsg = backendMsg || "⏳ Rate limit - please wait 60 seconds between requests";
        console.log("Setting faucet error message:", errorMsg);
        setFaucetError(errorMsg);
        setTimeout(() => setFaucetError(""), 8000);
      } else if (error.response?.data?.message) {
        // Use user-friendly message from backend
        console.log("Setting user message:", error.response.data.message);
        setFaucetError(error.response.data.message);
        setTimeout(() => setFaucetError(""), 6000);
      } else if (error.response?.data?.error) {
        // Use error message from backend
        console.log("Setting error message:", error.response.data.error);
        setFaucetError(error.response.data.error);
        setTimeout(() => setFaucetError(""), 6000);
      } else {
        console.log("Setting default error message");
        setFaucetError("❌ Failed to request funds. Please try again.");
        setTimeout(() => setFaucetError(""), 5000);
      }
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
        <div className="mini-message success">
          {faucetMessage}
        </div>
      )}

      {faucetError && (
        <div className="mini-message error" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.85rem",
          padding: "0.75rem",
          backgroundColor: "rgba(255, 68, 68, 0.1)",
          border: "1px solid rgba(255, 68, 68, 0.3)",
          borderRadius: "8px",
          marginTop: "0.5rem",
          marginBottom: "0.5rem"
        }}>
          {faucetError.includes("⏳") && <Clock size={14} style={{ flexShrink: 0 }} />}
          {faucetError.includes("❌") && <AlertCircle size={14} style={{ flexShrink: 0 }} />}
          <span style={{ flex: 1 }}>{faucetError}</span>
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
          title="Request testnet SUI (60s cooldown)"
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
          onClick={() => {
            if (!deleting) {
              setShowDeleteConfirm(false);
              setDeleteError("");
            }
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{account.nickname}</strong>?
            </p>
            <p className="warning-text">
              Address: <code style={{ fontSize: "0.85rem" }}>{truncateAddress(account.address)}</code>
            </p>
            <p className="warning-text" style={{ 
              color: "#ff6b6b", 
              fontWeight: "600",
              marginTop: "0.5rem"
            }}>
              ⚠️ This action cannot be undone!
            </p>
            
            {deleteError && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "rgba(255, 68, 68, 0.1)",
                border: "1px solid rgba(255, 68, 68, 0.3)",
                borderRadius: "8px",
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#ff4444"
              }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: "0.9rem" }}>{deleteError}</span>
              </div>
            )}
            
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
                onClick={() => {
                  if (!deleting) {
                    setShowDeleteConfirm(false);
                    setDeleteError("");
                  }
                }}
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
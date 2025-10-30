import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  Droplet,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Dashboard({ accounts, activeAccount, refreshBalance }) {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requestingFunds, setRequestingFunds] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState("");
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(rateLimitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (
      rateLimitCountdown === 0 &&
      faucetMessage.includes("Rate limit")
    ) {
      setFaucetMessage("");
    }
  }, [rateLimitCountdown, faucetMessage]);

  const fetchTransactions = useCallback(async () => {
    if (!activeAccount) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/transactions/${activeAccount.address}`
      );
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
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

  const handleRequestFunds = async () => {
    if (!activeAccount) return;

    setRequestingFunds(true);
    setFaucetMessage("");
    setMessageType("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/faucet/request",
        {
          address: activeAccount.address,
        }
      );

      if (response.data.success) {
        setFaucetMessage("✅ Success! Testnet SUI received. Balance updated.");
        setMessageType("success");
        await refreshBalance();
        await fetchTransactions();

        // Clear message after 5 seconds
        setTimeout(() => {
          setFaucetMessage("");
          setMessageType("");
        }, 5000);
      } else {
        setFaucetMessage(`❌ Error: ${response.data.error}`);
        setMessageType("error");
        setTimeout(() => {
          setFaucetMessage("");
          setMessageType("");
        }, 5000);
      }
    } catch (error) {
      console.error("Error requesting funds:", error);
      console.log("Error response:", error.response);
      console.log("Error status:", error.response?.status);
      console.log("Error data:", error.response?.data);

      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retry_after || 60;
        console.log("Setting countdown to:", retryAfter);
        setRateLimitCountdown(retryAfter);
        setFaucetMessage(
          `⏳ Rate limit exceeded! You can only request funds once per minute. Please wait ${retryAfter} seconds.`
        );
        setMessageType("error");
        // Don't auto-clear on rate limit - let countdown handle it
      } else if (error.response?.data?.error) {
        setFaucetMessage(`❌ ${error.response.data.error}`);
        setMessageType("error");
        setTimeout(() => {
          setFaucetMessage("");
          setMessageType("");
        }, 5000);
      } else {
        setFaucetMessage("❌ Failed to request funds. Please try again.");
        setMessageType("error");
        setTimeout(() => {
          setFaucetMessage("");
          setMessageType("");
        }, 5000);
      }
    } finally {
      setRequestingFunds(false);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  );

  // Generate chart data (mock data for visualization)
  const chartData = [
    { name: "Mon", balance: totalBalance * 0.85 },
    { name: "Tue", balance: totalBalance * 0.9 },
    { name: "Wed", balance: totalBalance * 0.88 },
    { name: "Thu", balance: totalBalance * 0.95 },
    { name: "Fri", balance: totalBalance * 0.92 },
    { name: "Sat", balance: totalBalance * 0.98 },
    { name: "Sun", balance: totalBalance },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {activeAccount && (
            <button
              className="faucet-btn"
              onClick={handleRequestFunds}
              disabled={requestingFunds || rateLimitCountdown > 0}
              title={
                rateLimitCountdown > 0
                  ? `Wait ${rateLimitCountdown}s before requesting again`
                  : "Request testnet SUI from faucet"
              }
              style={{
                opacity: requestingFunds || rateLimitCountdown > 0 ? 0.6 : 1,
                cursor:
                  requestingFunds || rateLimitCountdown > 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {rateLimitCountdown > 0 ? (
                <>
                  <Clock size={20} />
                  Wait {rateLimitCountdown}s
                </>
              ) : requestingFunds ? (
                <>
                  <RefreshCw size={20} className="spinning" />
                  Requesting...
                </>
              ) : (
                <>
                  <Droplet size={20} />
                  Get Testnet SUI
                </>
              )}
            </button>
          )}
          <button
            className={`refresh-btn ${refreshing ? "spinning" : ""}`}
            onClick={handleRefresh}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {faucetMessage && (
        <div className={`faucet-message ${messageType}`}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            {messageType === "error" && (
              <AlertCircle
                size={20}
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div>{faucetMessage}</div>
              {rateLimitCountdown > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  <Clock size={16} />
                  <span style={{ fontFamily: "monospace" }}>
                    Retry in: {rateLimitCountdown}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Wallet size={32} />
          </div>
          <div className="stat-content">
            <h3>Total Balance</h3>
            <p className="stat-value">{totalBalance.toFixed(4)} SUI</p>
            <span className="stat-label">
              Across {accounts.length} accounts
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>Received</h3>
            <p className="stat-value">
              {transactions.filter((tx) => tx.type === "received").length}
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
              {transactions.filter((tx) => tx.type === "sent").length}
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
                backgroundColor: "#1a1a1a",
                border: "1px solid #00ff88",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#00ff88"
              strokeWidth={3}
              dot={{ fill: "#00ff88", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activeAccount && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {transactions.length === 0 ? (
            <div className="no-transactions">
              <p>No transactions yet</p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#888",
                  marginTop: "0.5rem",
                }}
              >
                Need test SUI? Click "Get Testnet SUI" above!
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="transaction-item">
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === "received" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div className="tx-details">
                    <span className="tx-type">
                      {tx.type === "received" ? "Received" : "Sent"}
                    </span>
                    <span className="tx-digest">
                      {tx.digest.substring(0, 12)}...
                    </span>
                  </div>
                  <span className={`tx-status ${tx.status}`}>{tx.status}</span>
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

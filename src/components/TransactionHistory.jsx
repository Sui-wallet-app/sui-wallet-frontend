import React, { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

function TransactionHistory({ activeAccount }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, sent, received

  const fetchTransactions = useCallback(async () => {
    if (!activeAccount) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/${activeAccount.address}?limit=50`
      );
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      fetchTransactions();
    }
  }, [activeAccount, fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const truncateHash = (hash) => {
    return `${hash.substring(0, 12)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="transaction-history">
      <div className="section-header">
        <h2>Transaction History</h2>
        <button
          className="refresh-btn"
          onClick={fetchTransactions}
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? "spinning" : ""} />
          Refresh
        </button>
      </div>

      {!activeAccount ? (
        <div className="empty-state">
          <p>Please select an account to view transactions.</p>
        </div>
      ) : (
        <>
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "sent" ? "active" : ""}
              onClick={() => setFilter("sent")}
            >
              Sent
            </button>
            <button
              className={filter === "received" ? "active" : ""}
              onClick={() => setFilter("received")}
            >
              Received
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No {filter !== "all" ? filter : ""} transactions found.</p>
            </div>
          ) : (
            <div className="transactions-table">
              {filteredTransactions.map((tx, index) => (
                <div key={index} className={`transaction-row ${tx.type}`}>
                  <div className="tx-icon-large">
                    {tx.type === "received" ? (
                      <TrendingUp size={24} />
                    ) : (
                      <TrendingDown size={24} />
                    )}
                  </div>

                  <div className="tx-info">
                    <div className="tx-main">
                      <span className="tx-type-label">
                        {tx.type === "received" ? "Received" : "Sent"}
                      </span>
                      <span className={`tx-status-badge ${tx.status}`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="tx-details-row">
                      <span className="tx-hash">{truncateHash(tx.digest)}</span>

                      <a
                        href={`https://suiexplorer.com/txblock/${tx.digest}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        <ExternalLink size={14} />
                        View on Explorer
                      </a>
                    </div>

                    {tx.sender && (
                      <div className="tx-sender">
                        From: {truncateHash(tx.sender)}
                      </div>
                    )}
                  </div>

                  <div className="tx-date">{formatDate(tx.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionHistory;

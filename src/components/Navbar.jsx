import React from 'react';
import { Wallet, Users, Send, History } from 'lucide-react';

function Navbar({ activeView, setActiveView, activeAccount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Wallet size={32} />
        <h1>Sui Wallet</h1>
      </div>
      
      <div className="navbar-links">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {activeAccount && (
        <div className="navbar-account">
          <div className="account-indicator">
            <span className="account-nickname">{activeAccount.nickname}</span>
            <span className="account-balance">{activeAccount.balance?.toFixed(4)} SUI</span>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
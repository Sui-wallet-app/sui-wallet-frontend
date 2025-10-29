# 🚀 Sui Wallet - Full-Stack Web Application

A professional-grade web application for managing Sui blockchain accounts, sending tokens, and viewing transaction history. Built with Python (Flask), PySui SDK, and React.

![Sui Wallet](https://img.shields.io/badge/Sui-Blockchain-00ff88)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0.3-lightgrey)

## ✨ Features

- ✅ **Account Generation**: Create multiple Sui accounts with Ed25519 keypairs
- ✅ **Account Management**: Switch between accounts seamlessly
- ✅ **Send Tokens**: Transfer SUI tokens between accounts
- ✅ **Transaction History**: View complete transaction history
- ✅ **Real-time Balances**: Automatic balance updates
- ✅ **Secure Storage**: Encrypted private key storage
- ✅ **QR Codes**: Generate QR codes for account addresses
- ✅ **Beautiful UI**: Modern, responsive design with smooth animations

## 📋 Prerequisites

Before running this application, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** installed
- Internet connection for blockchain interaction

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd sui-wallet
```

### 2️⃣ Backend Setup (Flask + PySui)

#### Create Python Virtual Environment

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt contents:**
```
Flask==3.0.3
Flask-Cors==4.0.0
pysui==0.52.0
qrcode==7.4.2
cryptography==42.0.5
python-dotenv==1.0.0
```

### 3️⃣ Frontend Setup (React)

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Install Node Dependencies

```bash
npm install
```

**Required packages:**
```bash
npm install axios lucide-react qrcode.react recharts
```

## 🚀 Running the Application

### Start Backend Server

Open a terminal and run:

```bash
# Make sure virtual environment is activated
python app.py
```

The backend will start on **http://127.0.0.1:5000**

You should see:
```
============================================================
🚀 SUI WALLET BACKEND RUNNING
📍 http://127.0.0.1:5000
✅ Successfully connected to Sui testnet
============================================================
```

### Start Frontend Development Server

Open a **second terminal** and run:

```bash
cd frontend
npm start
```

The frontend will start on **http://localhost:3000** and open in your browser automatically.

## 📁 Project Structure

```
sui-wallet/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── wallet_manager.py      # Sui wallet operations
│   ├── database.py           # SQLite database manager
│   ├── transaction_service.py # Transaction handling
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Global styles
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AccountManager.js
│   │   │   ├── AccountCard.js
│   │   │   ├── SendTokens.js
│   │   │   └── TransactionHistory.js
│   │   └── index.js
│   ├── package.json
│   └── public/
├── sui_wallet.db            # SQLite database (auto-created)
├── .encryption_key          # Encryption key (auto-generated)
└── README.md               # This file
```

## 🎯 Usage Guide

### Creating Your First Account

1. **Open the application** at http://localhost:3000
2. Click **"Create Account"** button
3. Enter a nickname (optional) like "My Main Account"
4. Click **"Create"**
5. Your account will be generated with:
   - Unique Sui address
   - Secure encrypted private key
   - Initial balance (0 SUI on testnet)

### Getting Testnet Tokens

To test sending transactions, you need testnet SUI tokens:

1. Copy your account address
2. Visit the **Sui Testnet Faucet**: https://discord.gg/sui
3. Request tokens using: `!faucet <your-address>`
4. Refresh your balance in the app

### Sending Tokens

1. Go to the **"Send"** tab
2. Enter recipient address
3. Enter amount
4. Click **"Send Tokens"**
5. Transaction will be executed on Sui testnet

### Viewing History

1. Go to the **"History"** tab
2. View all transactions (sent/received)
3. Filter by transaction type
4. Click "View on Explorer" to see on blockchain

## 🔒 Security Features

- **Encrypted Private Keys**: All private keys are encrypted using Fernet symmetric encryption
- **Local Storage**: Keys never leave your machine
- **Secure Database**: SQLite with encrypted key storage
- **No Key Transmission**: Private keys are never sent over the network

## 🌐 API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /api/health` - API health status

### Account Management
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/active` - Get active account
- `POST /api/accounts/create` - Create new account
  ```json
  {
    "nickname": "My Account"
  }
  ```
- `POST /api/accounts/switch` - Switch active account
  ```json
  {
    "account_id": 1
  }
  ```

### Transactions
- `POST /api/send` - Send SUI tokens
  ```json
  {
    "from_account_id": 1,
    "to_address": "0x...",
    "amount": 0.1
  }
  ```
- `GET /api/transactions/<address>` - Get transaction history

### Balance
- `GET /api/balance/<address>` - Get SUI balance

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Module not found" error**
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Problem: "Connection to Sui network failed"**
```bash
# Solution: Check internet connection and RPC endpoint
# The app will work in offline mode for account creation
```

**Problem: Port 5000 already in use**
```bash
# Solution: Change port in app.py
app.run(debug=True, host='127.0.0.1', port=5001)
```

### Frontend Issues

**Problem: "Cannot connect to backend"**
```bash
# Solution: Ensure backend is running on port 5000
# Check CORS settings in app.py
```

**Problem: "npm start fails"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🎨 Key Features Explained

### Fixed Navbar
The navbar stays at the top when scrolling, providing easy navigation at all times.

### Real-time Balance Updates
Balances automatically refresh when you switch accounts or complete transactions.

### QR Code Generation
Each account can generate a QR code for easy address sharing.

### Transaction Explorer Links
Click any transaction to view it on the official Sui Explorer.

### Responsive Design
Works perfectly on desktop, tablet, and mobile devices.

## 📊 Database Schema

### Accounts Table
```sql
CREATE TABLE accounts (
    id INTEGER PRIMARY KEY,
    nickname TEXT,
    address TEXT UNIQUE,
    private_key_encrypted BLOB,
    scheme TEXT,
    created_at TIMESTAMP,
    is_active INTEGER
)
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    digest TEXT UNIQUE,
    from_address TEXT,
    to_address TEXT,
    amount REAL,
    status TEXT,
    timestamp TIMESTAMP
)
```

## 🏆 Team Information

**Team Leader**: [Your Name]
**Team Members**:
- [Member 1 Name]
- [Member 2 Name]
- [Member 3 Name]

**Submission Date**: September 2, 2025

## 📝 License

This project is submitted for the Sui Wallet Challenge.

## 🤝 Contributing

This project was built for a competition, but improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

For questions or issues, please open an issue on GitHub or contact the team leader.

## 🙏 Acknowledgments

- **Sui Foundation** for the amazing blockchain platform
- **PySui SDK** for the Python implementation
- **React** for the frontend framework
- **Flask** for the backend framework

## 🎯 Future Enhancements

- [ ] Multi-signature support
- [ ] NFT management
- [ ] Staking functionality
- [ ] DeFi integration
- [ ] Mobile app version
- [ ] Hardware wallet support

---

**Built with ❤️ for the Sui Blockchain Challenge**

**Good luck to all participants! 🚀**

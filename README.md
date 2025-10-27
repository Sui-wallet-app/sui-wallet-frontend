# SUI Wallet Frontend

A modern, feature-rich React application for managing Sui blockchain wallets with a stunning neon-themed UI.

## 🎨 Features

- **Multi-Account Management** - Create and manage multiple Sui accounts
- **Real-time Balance Tracking** - Live balance updates from Sui network
- **Token Transfers** - Send SUI tokens with intuitive interface
- **Transaction History** - Complete transaction visualization with charts
- **QR Code Generation** - Share addresses easily
- **Account Switching** - Seamlessly switch between accounts
- **Network Status** - Live connection monitoring
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Animated UI** - Smooth animations and modern design

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running (see backend README)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sui-wallet-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Production Server

```bash
# Install serve globally
npm install -g serve

# Serve the build
serve -s build -p 3000
```

## 📱 Application Structure

```
sui-wallet-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard view
│   │   ├── AccountManager.jsx     # Account creation/management
│   │   ├── SendTokens.jsx         # Token transfer interface
│   │   ├── TransactionHistory.jsx # Transaction list/visualization
│   │   ├── AccountCard.jsx        # Account display component
│   │   └── Navbar.jsx             # Navigation bar
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   └── index.js                   # Application entry point
├── package.json
├── .env
├── .gitignore
└── README.md
```

## 🎯 Key Components

### Dashboard
- Overview of all accounts
- Total balance across accounts
- Recent transaction activity
- Transaction chart visualization
- Quick account switching

### Account Manager
- Create new accounts with custom names
- View all accounts with balances
- Edit account names
- Delete accounts
- Generate QR codes for receiving
- View accounts on Sui Explorer

### Send Tokens
- Select recipient from address book
- Enter amount with quick-select buttons
- Transaction summary with gas estimates
- Real-time balance validation
- Transaction confirmation

### Transaction History
- Filter by sent/received
- Pagination controls
- Transaction statistics
- View on blockchain explorer
- Gas fee tracking

## 🎨 Design Features

### Modern UI Elements
- **Neon Theme** - Cyberpunk-inspired color scheme
- **Smooth Animations** - CSS transitions and keyframes
- **Glassmorphism** - Modern card designs
- **Responsive Layout** - Mobile-first approach
- **Interactive Charts** - Chart.js visualizations

### Color Palette
```css
--sui-blue: #4da2ff
--sui-dark: #0a1929
--success: #00d4aa
--error: #ff5252
--warning: #ffb74d
```

## 📦 Dependencies

### Core
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM renderer

### Utilities
- **axios** (^1.6.0) - HTTP client
- **chart.js** (^4.4.0) - Data visualization
- **react-chartjs-2** (^5.2.0) - React Chart.js wrapper
- **qrcode.react** (^3.1.0) - QR code generation
- **lucide-react** (^0.294.0) - Icon library

### Styling
- **tailwindcss** (^3.3.0) - Utility-first CSS

## 🔧 Configuration

### Environment Variables

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Optional: Custom port
PORT=3000
```

### Tailwind Configuration

The app uses Tailwind CSS. Configuration is in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'sui-blue': '#4da2ff',
        'sui-dark': '#0a1929',
      }
    },
  },
  plugins: [],
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new account
- [ ] Switch between accounts
- [ ] Check balance updates
- [ ] Send tokens to another account
- [ ] View transaction history
- [ ] Generate QR code
- [ ] Edit account name
- [ ] Delete account
- [ ] Responsive design on mobile

### API Connection Test

```javascript
// Test connection to backend
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🐛 Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure backend is running with CORS enabled
2. Check `REACT_APP_API_URL` in `.env`
3. Verify Flask-CORS is installed on backend

### Build Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Chart.js Not Rendering

```bash
# Reinstall Chart.js dependencies
npm install chart.js react-chartjs-2 --save
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px)

/* Tablet */
@media (max-width: 1200px)

/* Desktop */
@media (min-width: 1201px)
```

## 🎨 Customization

### Change Theme Colors

Edit `App.css`:

```css
:root {
  --sui-blue: #your-color;
  --success: #your-color;
  --error: #your-color;
}
```

### Add New Components

1. Create component in `src/components/`
2. Import in `App.jsx`
3. Add to navigation in `Navbar.jsx`
4. Add route logic in `App.jsx`

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

### GitHub Pages

```bash
# Install gh-pages
npm install gh-pages --save-dev

# Add to package.json
"homepage": "https://yourusername.github.io/sui-wallet",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## 📊 Performance Optimization

### Code Splitting
Already configured with React.lazy():
```javascript
const Dashboard = React.lazy(() => import('./components/Dashboard'));
```

### Bundle Size Analysis
```bash
npm run build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

## 🔐 Security Best Practices

- Never commit `.env` file
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Add authentication for production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

- Team Leader: [Esther Nakungu]
- Developer: [Esther Nakungu]
- Designer: [Esther Nakungu]

## 🏆 Project Submission

This project was created for the Sui Wallet Development Competition.

**Deadline:** September 2, 2025
**Prize:** $40 for winning team

## 📞 Support

For issues or questions:
- GitHub Issues: [Your Repo URL]
- Email: nakunguesther044@gmail.com

## 🙏 Acknowledgments

- Sui Foundation for the blockchain platform
- Anthropic Claude for development assistance
- Open source community for libraries and tools

---


## 👤 Individual Submission Note


This project was developed as an individual submission to:
- Demonstrate mastery of full-stack blockchain development independently
- Maintain consistent code quality and architectural decisions throughout
- Showcase ability to integrate complex technologies (PySui SDK, Flask, React) without coordination overhead

While the competition requests team submissions, this work demonstrates:
- Comprehensive full-stack development skills across frontend, backend, and blockchain layers
- Real blockchain integration expertise with Sui testnet (not simulated)
- Professional-grade code quality with modular architecture and clean separation of concerns
- Complete feature implementation exceeding requirements with additional features:
  - Multi-account wallet management
  - Real-time balance tracking
  - QR code generation for addresses
  - Visual transaction analytics with charts
  - Transaction filtering and history
  - Responsive UI with modern design principles

**Technical Stack:**
- Backend: Python 3.x, Flask, PySui SDK
- Frontend: React 18, Recharts, Axios, Lucide Icons
- Blockchain: Sui Testnet Integration

**Contact:** [nakunguesther044@gmail.com]

Made with ❤️ for Sui Blockchain

**Good luck with your submission! 🚀**
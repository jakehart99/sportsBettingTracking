# Sports Betting Tracker

A modern, responsive web application for tracking sports betting activities built with vanilla JavaScript, Vite, and Tailwind CSS.

## Features

- 📊 **Dashboard Overview**: View key statistics and today's games
- 🎯 **Betting Portfolio**: Track all your bets with detailed information  
- 🎨 **Modern UI**: Beautiful glass-morphism design with animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Quick Start (Windows)

### First Time Setup
1. Double-click `setup.bat` to install all dependencies
2. Wait for the installation to complete

### Running the Website
1. Double-click `run.bat` to start the development server
2. Your browser will automatically open to `http://localhost:3000`
3. Press `Ctrl+C` in the terminal to stop the server

## Manual Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
sports-betting-tracker/
├── src/
│   ├── style.css          # Main CSS with Tailwind imports
│   └── main.js           # JavaScript application logic
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── setup.bat            # Windows setup script
├── run.bat              # Windows run script
└── README.md            # This file
```

## Data Sources

The application reads betting data from two text files:
- `Gambling Game Times.txt` - Game schedules and times
- `My Bets.txt` - Your betting information

## Tech Stack

- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **JavaScript**: Vanilla ES6+ modules
- **Development**: ESLint, Prettier

## Features Overview

### Dashboard
- Total bets counter
- Win rate calculation
- Upcoming games display
- Active bets tracking

### My Bets Page
- Complete betting portfolio
- Filter by status (All, Pending, Won, Lost)
- Interactive bet cards with hover effects
- Sport-specific icons and emojis

### Design Features
- Glass-morphism effects
- Smooth animations and transitions
- Gradient backgrounds
- Responsive grid layouts
- Modern typography (Inter font)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Customization
You can easily customize the appearance by modifying:
- `tailwind.config.js` - Colors, animations, and design tokens
- `src/style.css` - Custom CSS and glass effects
- `src/main.js` - Application logic and data parsing

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for personal use. Feel free to modify and customize for your needs.
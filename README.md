# Art Institute Collection Browser

A modern React application that allows users to browse and select artworks from the Art Institute of Chicago's extensive collection. Built with React, TypeScript, Vite, and PrimeReact for a professional user experience.

## 🎨 Features

### Core Functionality
- **Artwork Browsing**: Browse thousands of artworks from the Art Institute of Chicago API
- **Server-Side Pagination**: Efficient pagination with 12 artworks per page
- **Row Selection**: Select individual artworks or multiple artworks at once
- **Selection Persistence**: Selections are maintained across page navigation
- **Custom Selection Panel**: Bulk select functionality with overlay panel
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Dual Selection Modes**: Toggle between checkbox and row-click selection
- **Cross-Page Selection**: Select more rows than available on current page
- **Memory Efficient**: Optimized to handle large datasets without memory issues
- **Real-time Updates**: Live selection count and status updates
- **Sortable Columns**: Sort artworks by title, artist, date, and more

## 🚀 Live Demo

[View Live Demo on Netlify](https://clinquant-kheer-6c4513.netlify.app/)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: PrimeReact
- **Styling**: CSS3 with custom components
- **API**: Art Institute of Chicago API
- **Deployment**: Netlify

## 📦 Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrathamJain2002/GrowMeOrganic-Private-Limited.git
   cd GrowMeOrganic-Private-Limited
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🏗️ Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── index.css        # Global styles

public/
├── vite.svg         # Vite logo
└── _redirects       # Netlify SPA routing configuration
```
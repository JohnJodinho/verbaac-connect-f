# Verbaac Connect Frontend

A modern React-based frontend application for the Verbaac Connect platform - a secure rental agreements and housing marketplace system for Nigerian students and young professionals.

## 🚀 Features

### Core Platform
- **Housing Marketplace**: Browse and list properties with detailed information
- **Roommate Matching**: Find compatible roommates with verified profiles
- **Secure Agreements**: Create digital rental agreements with escrow protection
- **Dashboard**: Comprehensive user dashboard for managing properties and bookings

### Technical Features
- **Modern UI**: Built with Tailwind CSS and responsive design
- **Dark Mode**: Full theme system with light/dark/system preferences
- **Type Safety**: TypeScript for enhanced development experience
- **Routing**: React Router v6 with nested routes and layouts
- **Performance**: Vite for fast development and optimized builds

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **State Management**: React Context API
- **Development**: ESLint, PostCSS

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable UI components
│   └── ThemeToggle.tsx  # Theme switching component
├── hooks/               # Custom React hooks
│   └── useTheme.tsx     # Theme context provider
├── layout/              # Layout components
│   ├── AuthLayout.tsx   # Authentication pages layout
│   ├── DashboardLayout.tsx  # Dashboard layout with sidebar
│   ├── Footer.tsx       # Global footer component
│   ├── MainLayout.tsx   # Main application layout
│   └── Navbar.tsx       # Navigation bar
├── lib/                 # Utility libraries
│   └── theme.ts         # Theme configuration
├── pages/               # Page components
│   ├── agreements/      # Agreement management pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── home/           # Landing page
│   ├── housing/        # Housing marketplace pages
│   ├── marketplace/    # General marketplace pages
│   ├── roommates/      # Roommate matching pages
│   └── NotFound.tsx    # 404 error page
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎯 Routes

### Public Routes
- `/` - Landing page
- `/housing` - Housing marketplace
- `/housing/:id` - Property details
- `/marketplace` - General marketplace
- `/marketplace/:id` - Marketplace item details
- `/roommates` - Roommate finder
- `/agreements` - Public agreement portal

### Authentication Routes
- `/auth/login` - User login
- `/auth/register` - User registration

### Protected Dashboard Routes
- `/dashboard` - Dashboard overview
- `/dashboard/agreements` - User agreements
- `/dashboard/agreements/create` - Create new agreement

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Theme System

The application includes a comprehensive theme system supporting:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Dark background with light text
- **System Mode**: Follows system preference
- **Persistent**: Theme choice saved in localStorage

### Theme Configuration
Located in `src/lib/theme.ts` with customizable:
- Color palettes (primary, secondary, accent)
- Typography scales
- Animation durations
- Responsive breakpoints

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Tablet Optimized**: Enhanced experience on tablets
- **Desktop Enhanced**: Full features on desktop screens
- **Flexible Layouts**: Adapts to any screen size

## 🔐 Security Features

- **Input Validation**: Client-side form validation
- **Type Safety**: TypeScript for compile-time checks
- **Secure Routing**: Protected routes for authenticated users
- **XSS Protection**: Sanitized user inputs

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React functional component patterns
- Implement proper prop types and interfaces
- Use meaningful component and variable names

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Implement dark mode considerations
- Use semantic HTML elements

### State Management
- Use React Context for global state
- Implement custom hooks for complex logic
- Keep component state local when possible
- Use proper dependency arrays in useEffect

## 🚧 Current Status - Stage 1 Scaffolding Complete

This represents the **Stage 1 scaffolding** of the Verbaac Connect frontend with:

✅ **Completed Features**
- Complete project structure and organization
- Theme system with light/dark modes
- React Router v6 implementation
- All major page placeholders with modern UI
- Responsive navigation and layouts
- Build system and development tools

🔄 **Next Steps (Stage 2)**
- Backend API integration
- Authentication system implementation
- Real data integration
- Form submissions and validation
- Payment processing integration
- Advanced search and filtering

## 📄 License

This project is part of the Verbaac Connect platform. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

---

**Built with ❤️ for Nigerian students and young professionals**

# Verbaac Connect Frontend

A production-ready React + TypeScript web application for Nigerian students to find housing, connect with roommates, buy/sell items, and create digital rental agreements.

## 🚀 Quick Start

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

## 📁 Project Structure

```
src/
├── assets/              # Static assets (logos, images)
├── components/          # Global reusable components
│   └── ui/             # UI component library
├── hooks/              # Global React hooks
├── layout/             # Layout components
│   ├── MainLayout.tsx  # Public pages layout
│   ├── AuthLayout.tsx  # Authentication pages layout
│   └── DashboardLayout.tsx  # Dashboard layout
├── lib/                # Utilities and API clients
├── types/              # TypeScript type definitions
├── modules/            # Feature-based modules
│   ├── auth/           # Authentication
│   ├── housing/        # Student housing
│   ├── marketplace/    # Second-hand marketplace
│   ├── roommates/      # Roommate matching
│   ├── agreements/     # Digital rental agreements
│   ├── dashboard/      # User dashboard
│   ├── messaging/      # In-app messaging
│   ├── notifications/  # Notifications
│   ├── admin/          # Admin panel
│   ├── home/           # Landing page
│   └── error-pages/    # Error pages
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## 🛣️ Routes

### Public Routes
- `/` - Home landing page
- `/housing` - Housing search and listings
- `/marketplace` - Student marketplace
- `/roommates` - Roommate matching
- `/agreements` - Digital agreements
- `/notifications` - Notifications
- `/messages` - Messaging inbox

### Authentication Routes
- `/login` - User login
- `/register` - User registration
- `/auth/login` - Alternative login route
- `/auth/register` - Alternative registration route

### Dashboard Routes (Protected)
- `/dashboard` - Overview
- `/dashboard/profile` - Profile settings
- `/dashboard/security` - Security settings
- `/dashboard/activity` - Activity log
- `/dashboard/wallet` - Wallet management
- `/dashboard/rewards` - Referral rewards

## 🎨 Features Implemented

### ✅ Stage 1 Deliverables (COMPLETED)
- [x] Complete folder structure and file scaffolds
- [x] All route placeholders with functional navigation
- [x] Three main layouts (Main, Auth, Dashboard)
- [x] Theme system with dark/light mode support
- [x] TypeScript types and interfaces
- [x] Utility functions and API client setup
- [x] Responsive design with Tailwind CSS
- [x] Navigation components with proper routing

### 🚧 Coming Soon
- [ ] User authentication system
- [ ] Housing listings with map integration
- [ ] Marketplace with escrow payments
- [ ] Roommate matching algorithm
- [ ] Digital agreement creation
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Admin panel functionality

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Theme**: Custom theme system with CSS variables

## 🎯 Key Components

### Layout System
- **MainLayout**: Header navigation + footer for public pages
- **AuthLayout**: Split layout with branding and form areas
- **DashboardLayout**: Sidebar navigation for user dashboard

### Theme System
- Dark/light/system theme support
- CSS variables for consistent theming
- Automatic system preference detection

### Module Architecture
Each module contains:
- `pages/` - Route components
- `components/` - Module-specific components
- Optional: `hooks/`, `lib/`, `api.ts`

## 🔧 Development

### File Naming Conventions
- Components: `PascalCase.tsx`
- Pages: `PascalCase.tsx` 
- Hooks: `camelCase.ts` or `camelCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`

### Code Organization
- Global components in `/src/components/`
- Feature-specific code in `/src/modules/[feature]/`
- Shared utilities in `/src/lib/`
- Type definitions in `/src/types/`

### Routing Pattern
```typescript
<Route path="/feature" element={<Layout />}>
  <Route index element={<FeaturePage />} />
  <Route path="sub-feature" element={<SubFeaturePage />} />
</Route>
```

## 🌟 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System-aware theme switching
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error pages
- **Accessibility**: ARIA labels and keyboard navigation
- **Smooth Animations**: Framer Motion integration ready

## 📱 Responsive Breakpoints

- `sm`: 640px and up
- `md`: 768px and up  
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🔗 API Integration Ready

- Axios client with interceptors
- Environment variable configuration
- Automatic token management
- Error handling and retry logic

## 🚀 Deployment

The application is configured for deployment on:
- **Vercel** (recommended)
- **Netlify** 
- **Any static hosting service**

## 📄 Environment Variables

Create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Verbaac Connect
```

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new components
3. Follow the existing naming conventions
4. Add proper type definitions
5. Ensure responsive design
6. Test in both light and dark modes

---

**Status**: Stage 1 Complete ✅  
**Next**: Implement authentication system and housing module functionality

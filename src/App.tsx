import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';

// Route Protection
import ProtectedRoute from './components/shared/ProtectedRoute';

// Layout Components
import { MainLayout } from './layout/MainLayout';
import { AuthLayout } from './layout/AuthLayout';
import { DashboardLayout } from './layout/DashboardLayout';

// Page Components
import Home from './modules/consumer/home/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import Housing from './modules/consumer/housing/pages/Housing';
import Marketplace from './modules/consumer/marketplace/pages/Marketplace';
import Roommates from './modules/consumer/roommates/pages/Roommates';
import AgreementsRoute from './modules/consumer/agreements/pages/AgreementsRoute';
import Dashboard from './modules/consumer/dashboard/pages/Dashboard';
import Profile from './modules/consumer/dashboard/pages/Profile';
import Security from './modules/consumer/dashboard/pages/Security';
import Activity from './modules/consumer/dashboard/pages/Activity';
import Wallet from './modules/shared/wallet/pages/Wallet';
import Rewards from './modules/consumer/rewards/pages/Rewards';
import Notifications from './modules/shared/notifications/pages/Notifications';
import Messages from './modules/shared/messaging/pages/Messages';
import ItemDetails from './modules/consumer/marketplace/pages/ItemDetails';
import NotFound from './modules/shared/error-pages/pages/NotFound';

import PropertyDetails from './modules/consumer/housing/pages/PropertyDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 transition-colors duration-200">
          <Routes>
            {/* Public Routes with Main Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="housing" element={<Housing />} />
              <Route path="/housing/:id" element={<PropertyDetails />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="marketplace/:id" element={<ItemDetails />} />
              <Route path="roommates" element={<Roommates />} />
              <Route path="agreements" element={<AgreementsRoute />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="messages" element={<Messages />} />
            </Route>

            {/* Authentication Routes with Auth Layout */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Alternative auth routes for convenience */}
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthLayout />}>
              <Route index element={<Register />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="security" element={<Security />} />
              <Route path="activity" element={<Activity />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="rewards" element={<Rewards />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Route Protection
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import { MainLayout } from './layout/MainLayout';
import { AuthLayout } from './layout/AuthLayout';
import { DashboardLayout } from './layout/DashboardLayout';

// Page Components
import Home from './modules/home/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import Housing from './modules/housing/pages/Housing';
import Marketplace from './modules/marketplace/pages/Marketplace';
import Roommates from './modules/roommates/pages/Roommates';
import Agreements from './modules/agreements/pages/Agreements';
import Dashboard from './modules/dashboard/pages/Dashboard';
import Notifications from './modules/notifications/pages/Notifications';
import Messages from './modules/messaging/pages/Messages';
import NotFound from './modules/error-pages/pages/NotFound';

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
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="roommates" element={<Roommates />} />
              <Route path="agreements" element={<Agreements />} />
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
              <Route path="profile" element={<div>Profile Settings</div>} />
              <Route path="security" element={<div>Security Settings</div>} />
              <Route path="activity" element={<div>Activity Log</div>} />
              <Route path="wallet" element={<div>Wallet</div>} />
              <Route path="rewards" element={<div>Rewards</div>} />
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

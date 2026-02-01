import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuthStore } from '@/store/useAuthStore';

// Route Protection
import ProtectedRoute from './components/shared/ProtectedRoute';

// Layout Components
import { MainLayout } from './layout/MainLayout';
import { AuthLayout } from './layout/AuthLayout';
import { DashboardLayout } from './layout/DashboardLayout';
import { OnboardingLayout } from './layout/OnboardingLayout';

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

// Seller Module
import SellerOnboarding from './modules/seller/onboarding/pages/SellerOnboarding';
import SellerDashboard from './modules/seller/dashboard/pages/SellerDashboard';
import SellerWallet from './modules/seller/dashboard/pages/SellerWallet';
import SellerInventory from './modules/seller/dashboard/pages/SellerInventory';
import CreateListing from './modules/seller/inventory/pages/CreateListing';
import { RoleGuard } from './components/shared/RoleGuard';

// Seller Orders & Disputes (Stage 4 & 5)
import SellerOrderList from './modules/seller/orders/pages/SellerOrderList';
import OrderDetails from './modules/seller/orders/pages/OrderDetails';
import DisputeList from './modules/seller/disputes/pages/DisputeList';
import DisputeDetailsPage from './modules/seller/disputes/pages/DisputeDetails';

// Ambassador Module
import AmbassadorOnboarding from './modules/ambassador/onboarding/pages/AmbassadorOnboarding';
import AmbassadorDashboard from './modules/ambassador/dashboard/pages/AmbassadorDashboard';
import VerificationQueue from './modules/ambassador/verifications/pages/VerificationQueue';
import FieldAuditForm from './modules/ambassador/verifications/pages/FieldAuditForm';
import AmbassadorEarnings from './modules/ambassador/earnings/pages/AmbassadorEarnings';
import DisputePortal from './modules/ambassador/verifications/pages/DisputePortal';
import AmbassadorActivity from './modules/ambassador/activity/pages/AmbassadorActivity';

// Landlord Module
import LandlordOnboarding from './modules/landlord/onboarding/pages/LandlordOnboarding';
import LandlordDashboard from './modules/landlord/dashboard/pages/LandlordDashboard';
import LandlordProperties from './modules/landlord/dashboard/pages/LandlordProperties';
import BuildingWizard from '@/modules/landlord/properties/pages/BuildingWizard';
import ListingWizard from '@/modules/landlord/listings/pages/ListingWizard';
import LandlordListings from './modules/landlord/dashboard/pages/LandlordListings';
import LandlordTenants from './modules/landlord/dashboard/pages/LandlordTenants';
import LandlordWallet from './modules/landlord/dashboard/pages/LandlordWallet';

// Agent Module
import AgentOnboarding from './modules/agent/onboarding/pages/AgentOnboarding';
import AgentDashboard from './modules/agent/dashboard/pages/AgentDashboard';
import AgentPortfolio from './modules/agent/dashboard/pages/AgentPortfolio';
import AgentClients from './modules/agent/dashboard/pages/AgentClients';
import AgentWallet from './modules/agent/dashboard/pages/AgentWallet';
import AgentBuildingWizard from './modules/agent/dashboard/pages/AgentBuildingWizard';
import AgentUnitWizard from './modules/agent/dashboard/pages/AgentUnitWizard';

// Admin Module
import Admin2FAGate from './modules/admin/auth/pages/Admin2FAGate';
import AdminLayout from './modules/admin/layout/AdminLayout';
import AdminDashboard from './modules/admin/dashboard/pages/AdminDashboard';
import VerificationCenter from './modules/admin/verification/pages/VerificationCenter';
import DisputeResolutionHub from './modules/admin/dispute/pages/DisputeResolutionHub';
import AdminTeamManager from './modules/admin/team/pages/AdminTeamManager';
import GlobalUserDirectory from './modules/admin/users/pages/GlobalUserDirectory';
import TreasuryHub from './modules/admin/treasury/pages/TreasuryHub';
import GeographyRegistry from './modules/admin/registry/pages/GeographyRegistry';
import AmbassadorTrustHub from './modules/admin/trust/pages/AmbassadorTrustHub';

function AppRoutes() {
  const { activeRole } = useAuthStore();
  
  return (
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
        <Route index element={<Navigate to="/auth/login" replace />} />
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

      {/* === Standalone Onboarding Routes (No Dashboard Sidebar) === */}
      <Route path="/seller/onboarding" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SellerOnboarding />} />
      </Route>

      {/* Agent Onboarding (Standalone) */}
      <Route path="/agent/onboarding" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AgentOnboarding />} />
      </Route>

      <Route path="/onboarding/agent" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AgentOnboarding />} />
      </Route>

      {/* Ambassador Onboarding (Standalone) */}
      <Route path="/ambassador/onboarding" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AmbassadorOnboarding />} />
      </Route>

      {/* Landlord Onboarding (Standalone) */}
      <Route path="/landlord/onboarding" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<LandlordOnboarding />} />
      </Route>

      <Route path="/onboarding/landlord" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route index element={<LandlordOnboarding />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route path="/agent/properties/new" element={
        <ProtectedRoute>
            <AgentBuildingWizard />
        </ProtectedRoute>
      } />
      
      <Route path="/agent/units/new" element={
        <ProtectedRoute>
            <AgentUnitWizard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout key={activeRole} />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="security" element={<Security />} />
        <Route path="activity" element={<Activity />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="rewards" element={<Rewards />} />

        {/* Seller Dashboard Routes - Protected by RoleGuard */}
        <Route path="seller" element={<RoleGuard requiredRole="seller" onboardingPath="/seller/onboarding" />}>
          <Route index element={<SellerDashboard />} />
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="inventory/new" element={<CreateListing />} />
          <Route path="orders" element={<SellerOrderList />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="disputes" element={<DisputeList />} />
          <Route path="disputes/:disputeId" element={<DisputeDetailsPage />} />
          <Route path="wallet" element={<SellerWallet />} />
        </Route>

        {/* Ambassador Dashboard Routes - Protected by RoleGuard */}
        <Route path="ambassador" element={<RoleGuard requiredRole="ambassador" onboardingPath="/ambassador/onboarding" />}>
          <Route index element={<AmbassadorDashboard />} />
          <Route path="verifications" element={<VerificationQueue />} />
          <Route path="verifications/:taskId/audit" element={<FieldAuditForm />} />
          <Route path="activity" element={<AmbassadorActivity />} />
          <Route path="earnings" element={<AmbassadorEarnings />} />
          <Route path="disputes" element={<DisputePortal />} />
        </Route>

        {/* Landlord Dashboard Routes - Protected by RoleGuard */}
        <Route path="landlord" element={<RoleGuard requiredRole="landlord" onboardingPath="/landlord/onboarding" />}>
          <Route index element={<LandlordDashboard />} />
          <Route path="properties" element={<LandlordProperties />} />
          <Route path="properties/new" element={<BuildingWizard />} />
          <Route path="listings" element={<LandlordListings />} />
          <Route path="listings/new" element={<ListingWizard />} />
          <Route path="tenants" element={<LandlordTenants />} />
          <Route path="wallet" element={<LandlordWallet />} />
        </Route>

      {/* Agent Dashboard Routes - Protected by RoleGuard */}
        <Route path="agent" element={<RoleGuard requiredRole="agent" onboardingPath="/agent/onboarding" />}>
          <Route index element={<AgentDashboard />} />
          <Route path="portfolio" element={<AgentPortfolio />} />
          <Route path="clients" element={<AgentClients />} />
          <Route path="wallet" element={<AgentWallet />} />
        </Route>
        
        {/* Admin Dashboard Routes - Uses AdminLayout (Desktop Only) */}
        {/* We redirect /dashboard/admin to the standalone layout route below if needed, 
            or we can inline it here if we want it under the main protected route tree but with different layout. 
            Given AdminLayout is distinct, let's keep it separate or handling it carefully.
            For now, let's remove the confusing block and rely on the standalone /dashboard/admin route.
        */}
      </Route>

      {/* === Admin Portal (Standalone Layout) === */}
      <Route path="/admin/login" element={<Admin2FAGate />} />
      
      {/* 
          Admin Dashboard - Protected by RoleGuard manually or relying on internal safeguards.
          We wrap it in RoleGuard to ensure only admins can access.
      */}
      <Route path="/dashboard/admin" element={
        <RoleGuard requiredRole="admin" onboardingPath="/admin/login">
            <AdminLayout />
        </RoleGuard>
      }>
         <Route index element={<AdminDashboard />} />
         <Route path="verification" element={<VerificationCenter />} />
         <Route path="disputes" element={<DisputeResolutionHub />} />
         <Route path="team" element={<AdminTeamManager />} />
         <Route path="users" element={<GlobalUserDirectory />} />
         <Route path="treasury" element={<TreasuryHub />} />
         <Route path="registry" element={<GeographyRegistry />} />
         <Route path="trust" element={<AmbassadorTrustHub />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 transition-colors duration-200">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

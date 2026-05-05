import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RecommendPage from './pages/onboarding/RecommendPage';
import CustomizePage from './pages/onboarding/CustomizePage';
import PaymentPage from './pages/onboarding/PaymentPage';
import StayHomePage from './pages/stay/StayHomePage';
import TroubleReportPage from './pages/stay/TroubleReportPage';
import CleaningPage from './pages/stay/CleaningPage';
import ExtendPage from './pages/stay/ExtendPage';
import FacilitiesPage from './pages/stay/FacilitiesPage';
import EmergencyPage from './pages/stay/EmergencyPage';
import CommunityPage from './pages/community/CommunityPage';
import MigrationPage from './pages/migration/MigrationPage';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminTroublesPage from './pages/admin/AdminTroublesPage';
import AdminRevenuePage from './pages/admin/AdminRevenuePage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/stay" replace />;
  return <>{children}</>;
}

export default function App() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={
        currentUser
          ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/stay'} replace />
          : <Navigate to="/login" replace />
      } />

      {/* Onboarding */}
      <Route path="/onboarding/recommend" element={
        <RequireAuth><Layout><RecommendPage /></Layout></RequireAuth>
      } />
      <Route path="/onboarding/customize/:planId" element={
        <RequireAuth><Layout><CustomizePage /></Layout></RequireAuth>
      } />
      <Route path="/onboarding/payment" element={
        <RequireAuth><Layout><PaymentPage /></Layout></RequireAuth>
      } />

      {/* Stay Management */}
      <Route path="/stay" element={
        <RequireAuth><Layout><StayHomePage /></Layout></RequireAuth>
      } />
      <Route path="/stay/trouble" element={
        <RequireAuth><Layout><TroubleReportPage /></Layout></RequireAuth>
      } />
      <Route path="/stay/cleaning" element={
        <RequireAuth><Layout><CleaningPage /></Layout></RequireAuth>
      } />
      <Route path="/stay/extend" element={
        <RequireAuth><Layout><ExtendPage /></Layout></RequireAuth>
      } />
      <Route path="/stay/facilities" element={
        <RequireAuth><Layout><FacilitiesPage /></Layout></RequireAuth>
      } />
      <Route path="/stay/emergency" element={
        <RequireAuth><Layout><EmergencyPage /></Layout></RequireAuth>
      } />

      {/* Community */}
      <Route path="/community" element={
        <RequireAuth><Layout><CommunityPage /></Layout></RequireAuth>
      } />

      {/* Migration */}
      <Route path="/migration" element={
        <RequireAuth><Layout><MigrationPage /></Layout></RequireAuth>
      } />

      {/* Chat/Support */}
      <Route path="/chat" element={
        <RequireAuth><Layout><ChatPage /></Layout></RequireAuth>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <RequireAdmin><Layout><AdminDashboard /></Layout></RequireAdmin>
      } />
      <Route path="/admin/bookings" element={
        <RequireAdmin><Layout><AdminBookingsPage /></Layout></RequireAdmin>
      } />
      <Route path="/admin/troubles" element={
        <RequireAdmin><Layout><AdminTroublesPage /></Layout></RequireAdmin>
      } />
      <Route path="/admin/revenue" element={
        <RequireAdmin><Layout><AdminRevenuePage /></Layout></RequireAdmin>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

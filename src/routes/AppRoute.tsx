import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UsersPage } from '../pages/Users';
import { DevicesPage } from '../pages/Devices';
import { CompanyPage } from '../pages/Company';
import { HealthPage } from '../pages/Health';
import { ServerLogPage } from '../pages/widgets/ServerLog';
import { SystemLogPage } from '../pages/widgets/systemlog/index';
import { TrainDevicePage } from '../pages/widgets/TrainDevice';
import { CustomerBugsPage } from '../pages/admin/CustomerBugs';
import { SimulationRequestsPage } from '../pages/admin/SimulationRequests';
import { DataManagementPage } from '../pages/admin/DataManagement';
import { UserJourneyPage } from '../pages/admin/UserJourney';
import { DeveloperReportsPage } from '../pages/admin/DeveloperReport/DeveloperReports';
import { AdminWarningsPage } from '../pages/admin/AdminWarningsPage';
import { ProtectedRoute } from './ProtectedRoute';  
import { LoginPage } from '../pages/Login';

import { useAuthStore } from '../store/auth';
import { Points } from '../pages/PointsVsPop';
import { useEffect } from 'react';


export function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuthentication = useAuthStore((state) => state.checkAuthentication);

  useEffect(() => {
    checkAuthentication(); 
  }, []);
  
  return (
    <Routes>
      <Route  path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" 
      element={isAuthenticated ? <DashboardLayout/> : <ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route index element={<Navigate to="/dashboard/users" />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="devices/devices" element={<DevicesPage />} />
        <Route path="devices/point-vs-pop" element={<Points />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="widgets/server-log" element={<ServerLogPage />} />
        <Route path="widgets/system-log" element={<SystemLogPage />} />
        <Route path="widgets/train-device" element={<TrainDevicePage />} />
        <Route path="admin/bugs" element={<CustomerBugsPage />} />
        <Route path="admin/simulations" element={<SimulationRequestsPage />} />
        <Route path="admin/data" element={<DataManagementPage />} />
        <Route path="admin/journey" element={<UserJourneyPage />} />
        <Route path="admin/developer" element={<DeveloperReportsPage />} />
        <Route path="admin/warnings" element={<AdminWarningsPage />} />
      </Route>

      {/* Redirect to login if no route matches */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
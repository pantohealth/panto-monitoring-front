import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { UsersPage } from './pages/Users';
import { DevicesPage } from './pages/Devices';
import { CompanyPage } from './pages/Company';
import { HealthPage } from './pages/Health';
import { WarningsPage } from './pages/Warnings';
import { ServerLogPage } from './pages/widgets/ServerLog';
import { TrainDevicePage } from './pages/widgets/TrainDevice';
import { AddUserPage } from './pages/settings/AddUser';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/users" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="company" element={<CompanyPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="warnings" element={<WarningsPage />} />
            <Route path="widgets/server-log" element={<ServerLogPage />} />
            <Route path="widgets/train-device" element={<TrainDevicePage />} />
            <Route path="settings/add-user" element={<AddUserPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
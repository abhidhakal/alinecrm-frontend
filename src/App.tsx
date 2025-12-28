import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Product from './pages/Product';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/employee/Profile';

import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Dashboard from './pages/employee/Dashboard';
import Contacts from './pages/employee/Contacts';
import Leads from './pages/employee/Leads';
import Campaigns from './pages/employee/Campaigns';
import Socials from './pages/employee/Socials';
import Tasks from './pages/employee/Tasks';
import Mindfulness from './pages/employee/Mindfulness';
import Users from './pages/admin/Users';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContacts from './pages/admin/AdminContacts';
import AdminLeads from './pages/admin/AdminLeads';
import AdminTasks from './pages/admin/AdminTasks';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminSocials from './pages/admin/AdminSocials';
import Settings from './pages/employee/Settings';
import ContactSupport from './pages/employee/ContactSupport';
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ToastProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/product" element={<Product />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />

                {/* User Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
                <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
                <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/social-media" element={<ProtectedRoute><Socials /></ProtectedRoute>} />
                <Route path="/mindfulness" element={<ProtectedRoute><Mindfulness /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
                <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
                <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
                <Route path="/admin/tasks" element={<AdminRoute><AdminTasks /></AdminRoute>} />
                <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
                <Route path="/admin/social-media" element={<AdminRoute><AdminSocials /></AdminRoute>} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </ToastProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

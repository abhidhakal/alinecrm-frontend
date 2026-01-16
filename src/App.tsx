import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Landing from './pages/landing/Landing';
import Features from './pages/landing/Features';
import Pricing from './pages/landing/Pricing';
import About from './pages/landing/About';
import Login from './pages/landing/Login';
import Register from './pages/landing/Register';
import Contact from './pages/landing/Contact';
import Demo from './pages/landing/Demo';
import Privacy from './pages/landing/Privacy';
import Terms from './pages/landing/Terms';
import Profile from './pages/employee/Profile';
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
import AdminMindfulness from './pages/admin/AdminMindfulness';
import AdminProfile from './pages/admin/AdminProfile';
import Announcements from './pages/Announcements';
import Settings from './pages/employee/Settings';
import ContactSupport from './pages/employee/ContactSupport';
import NotFound from './pages/NotFound';
import { CurrencyProvider } from './context/CurrencyContext';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/reactQueryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <ToastProvider>
            <NotificationProvider>
              <SidebarProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    {/* User Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/portal/help/secure-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
                    <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                    <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
                    <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                    <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                    <Route path="/social-media" element={<ProtectedRoute><Socials /></ProtectedRoute>} />
                    <Route path="/mindfulness" element={<ProtectedRoute><Mindfulness /></ProtectedRoute>} />
                    <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
                    <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
                    <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
                    <Route path="/admin/tasks" element={<AdminRoute><AdminTasks /></AdminRoute>} />
                    <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
                    <Route path="/admin/social-media" element={<AdminRoute><AdminSocials /></AdminRoute>} />
                    <Route path="/admin/mindfulness" element={<AdminRoute><AdminMindfulness /></AdminRoute>} />
                    <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
                    <Route path="/admin/announcements" element={<AdminRoute><Announcements /></AdminRoute>} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </NotificationProvider>
          </ToastProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

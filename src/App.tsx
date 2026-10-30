import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
const CloudUserPage = lazy(() => import('@/pages/CloudUserPage'));
import AdminAuthProvider from '@/components/features/AdminAuthProvider';
import AdminAccessGate from '@/components/features/AdminAccessGate';
import AdminErrorBoundary from '@/components/features/AdminErrorBoundary';
import RegistrationSync from '@/components/features/RegistrationSync';

const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminRecoveryPage = lazy(() => import('@/pages/AdminRecoveryPage'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RegistrationSync />
        <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center bg-background text-foreground">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<CloudUserPage />} />
          <Route path="/product" element={<CloudUserPage />} />
          <Route path="/team" element={<CloudUserPage />} />
          <Route path="/mine" element={<CloudUserPage />} />
          <Route path="/checkin" element={<CloudUserPage />} />
          <Route path="/tasks" element={<CloudUserPage />} />
          <Route path="/recharge" element={<CloudUserPage />} />
          <Route path="/withdraw" element={<CloudUserPage />} />
          <Route path="/bind-card" element={<CloudUserPage />} />
          <Route path="/records" element={<CloudUserPage />} />
          <Route path="/about" element={<CloudUserPage />} />
          <Route path="/regulation" element={<CloudUserPage />} />
          <Route path="/customer-service" element={<CloudUserPage />} />
          <Route path="/redeem" element={<CloudUserPage />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/recovery" element={<AdminErrorBoundary><AdminRecoveryPage /></AdminErrorBoundary>} />
          <Route path="/admin" element={<AdminErrorBoundary><AdminAccessGate><AdminPage /></AdminAccessGate></AdminErrorBoundary>} />
          <Route path="/invite" element={<CloudUserPage />} />
          <Route path="/withdraw-status" element={<CloudUserPage />} />
          <Route path="/recharge-status" element={<CloudUserPage />} />
          <Route path="/profile" element={<CloudUserPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;


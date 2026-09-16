import React from 'react';
import { useAuth } from '@/lib/auth';
import { Layout, AdminLayout } from '@/components/layout';

export function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { student, isAdmin } = useAuth();
  
  if (adminOnly && !isAdmin) {
    window.location.href = '/admin';
    return null;
  }
  
  if (!adminOnly && !student && !isAdmin) {
    window.location.href = '/student-login';
    return null;
  }
  
  const LayoutComponent = adminOnly ? AdminLayout : Layout;
  
  return (
    <LayoutComponent>
      <Component />
    </LayoutComponent>
  );
}

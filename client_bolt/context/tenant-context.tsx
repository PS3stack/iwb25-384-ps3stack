'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  theme: {
    primary: string;
    secondary: string;
    logo?: string;
  };
  features: {
    multiElections: boolean;
    census: boolean;
    ipRestriction: boolean;
    liveResults: boolean;
  };
}

interface TenantContextType {
  tenant: TenantConfig | null;
  setTenant: (tenant: TenantConfig) => void;
}

const defaultTenant: TenantConfig = {
  id: 'tenant_001',
  name: 'SP3 Vote Core',
  domain: 'sp3vote.example.com',
  theme: {
    primary: '#2563eb',
    secondary: '#06b6d4',
  },
  features: {
    multiElections: true,
    census: true,
    ipRestriction: true,
    liveResults: true,
  },
};

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);

  useEffect(() => {
    // In a real app, this would detect the subdomain and load tenant config
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    
    // For demo purposes, always use default tenant
    setTenant(defaultTenant);
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eligibilityGroup: string;
  isPublic: boolean;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Observer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedAreas: string[];
  credentials: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  code: string;
  description: string;
  capacity: number;
  devices: Device[];
  createdAt: string;
}

export interface Device {
  id: string;
  deviceId: string;
  type: 'tablet' | 'scanner' | 'printer';
  areaId: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSync: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  party: string;
  assignedArea: string;
  qualifications: string[];
  photoUrl?: string;
  biography: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Qualification {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  isRequired: boolean;
  createdAt: string;
}

export interface Voter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  voterId: string;
  area: string;
  eligibilityGroup: string;
  status: 'active' | 'inactive' | 'voted';
  registrationDate: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface TurnoutData {
  timestamp: string;
  totalVotes: number;
  totalEligible: number;
  turnoutPercentage: number;
  areaBreakdown: Array<{
    areaId: string;
    areaName: string;
    votes: number;
    eligible: number;
    percentage: number;
  }>;
}

export interface SystemSettings {
  general: {
    organizationName: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
    twoFactorEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    notificationRoles: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
import { Election, Observer, Area, Device, Candidate, Qualification, Voter, AuditLog, TurnoutData, SystemSettings, ApiResponse } from './types';

// Mock data
const mockElections: Election[] = [
  {
    id: '1',
    title: 'Student Government Election 2024',
    description: 'Annual student government election for president, vice president, and council members.',
    startDate: '2024-03-15T09:00:00',
    endDate: '2024-03-15T17:00:00',
    eligibilityGroup: 'students',
    isPublic: true,
    status: 'upcoming',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Faculty Senate Election',
    description: 'Election for faculty senate representatives from each department.',
    startDate: '2024-02-20T08:00:00',
    endDate: '2024-02-20T18:00:00',
    eligibilityGroup: 'faculty',
    isPublic: false,
    status: 'completed',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-02-21T10:00:00Z'
  }
];

const mockObservers: Observer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
    assignedAreas: ['area1', 'area2'],
    credentials: 'League of Women Voters',
    status: 'active',
    createdAt: '2024-02-01T10:00:00Z'
  }
];

const mockAreas: Area[] = [
  {
    id: 'area1',
    name: 'Main Hall',
    code: 'MH01',
    description: 'Primary voting location in the main building',
    capacity: 500,
    devices: [],
    createdAt: '2024-01-15T09:00:00Z'
  }
];

const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    party: 'Student Progressive Party',
    assignedArea: 'area1',
    qualifications: ['qual1'],
    biography: 'Senior majoring in Political Science with extensive leadership experience.',
    status: 'approved',
    createdAt: '2024-02-01T10:00:00Z'
  }
];

const mockQualifications: Qualification[] = [
  {
    id: 'qual1',
    title: 'Student in Good Standing',
    description: 'Must maintain a minimum GPA of 2.5',
    requirements: ['Minimum GPA 2.5', 'No disciplinary actions'],
    isRequired: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockVoters: Voter[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@student.edu',
    voterId: 'V001234',
    area: 'area1',
    eligibilityGroup: 'students',
    status: 'active',
    registrationDate: '2024-01-15T10:00:00Z'
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Admin User',
    action: 'CREATE_ELECTION',
    resource: 'elections',
    resourceId: '1',
    details: { title: 'Student Government Election 2024' },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    timestamp: '2024-02-01T10:00:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Elections API
export const electionsApi = {
  async getElections(): Promise<ApiResponse<Election[]>> {
    await delay(500);
    return { success: true, data: mockElections };
  },

  async createElection(election: Omit<Election, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ApiResponse<Election>> {
    await delay(1000);
    const newElection: Election = {
      ...election,
      id: Date.now().toString(),
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockElections.push(newElection);
    return { success: true, data: newElection };
  },

  async updateElection(id: string, updates: Partial<Election>): Promise<ApiResponse<Election>> {
    await delay(1000);
    const index = mockElections.findIndex(e => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Election not found' };
    }
    mockElections[index] = { ...mockElections[index], ...updates, updatedAt: new Date().toISOString() };
    return { success: true, data: mockElections[index] };
  },

  async deleteElection(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = mockElections.findIndex(e => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Election not found' };
    }
    mockElections.splice(index, 1);
    return { success: true, data: undefined };
  }
};

// Observers API
export const observersApi = {
  async getObservers(): Promise<ApiResponse<Observer[]>> {
    await delay(500);
    return { success: true, data: mockObservers };
  },

  async createObserver(observer: Omit<Observer, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Observer>> {
    await delay(1000);
    const newObserver: Observer = {
      ...observer,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockObservers.push(newObserver);
    return { success: true, data: newObserver };
  }
};

// Areas API
export const areasApi = {
  async getAreas(): Promise<ApiResponse<Area[]>> {
    await delay(500);
    return { success: true, data: mockAreas };
  },

  async createArea(area: Omit<Area, 'id' | 'createdAt' | 'devices'>): Promise<ApiResponse<Area>> {
    await delay(1000);
    const newArea: Area = {
      ...area,
      id: Date.now().toString(),
      devices: [],
      createdAt: new Date().toISOString()
    };
    mockAreas.push(newArea);
    return { success: true, data: newArea };
  }
};

// Candidates API
export const candidatesApi = {
  async getCandidates(): Promise<ApiResponse<Candidate[]>> {
    await delay(500);
    return { success: true, data: mockCandidates };
  },

  async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Candidate>> {
    await delay(1000);
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockCandidates.push(newCandidate);
    return { success: true, data: newCandidate };
  }
};

// Qualifications API
export const qualificationsApi = {
  async getQualifications(): Promise<ApiResponse<Qualification[]>> {
    await delay(500);
    return { success: true, data: mockQualifications };
  },

  async createQualification(qualification: Omit<Qualification, 'id' | 'createdAt'>): Promise<ApiResponse<Qualification>> {
    await delay(1000);
    const newQualification: Qualification = {
      ...qualification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mockQualifications.push(newQualification);
    return { success: true, data: newQualification };
  }
};

// Voters API
export const votersApi = {
  async getVoters(): Promise<ApiResponse<Voter[]>> {
    await delay(500);
    return { success: true, data: mockVoters };
  },

  async createVoter(voter: Omit<Voter, 'id' | 'registrationDate' | 'status'>): Promise<ApiResponse<Voter>> {
    await delay(1000);
    const newVoter: Voter = {
      ...voter,
      id: Date.now().toString(),
      status: 'active',
      registrationDate: new Date().toISOString()
    };
    mockVoters.push(newVoter);
    return { success: true, data: newVoter };
  },

  async importVoters(csvData: string): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    await delay(2000);
    // Simulate CSV processing
    return {
      success: true,
      data: { imported: 50, errors: [] }
    };
  }
};

// Audit Logs API
export const auditLogsApi = {
  async getAuditLogs(filters?: { action?: string; resource?: string; dateFrom?: string; dateTo?: string }): Promise<ApiResponse<AuditLog[]>> {
    await delay(500);
    let filteredLogs = [...mockAuditLogs];
    
    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action!));
    }
    
    if (filters?.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
    }
    
    return { success: true, data: filteredLogs };
  }
};

// Turnout API
export const turnoutApi = {
  async getLiveTurnout(): Promise<ApiResponse<TurnoutData>> {
    await delay(300);
    const mockTurnoutData: TurnoutData = {
      timestamp: new Date().toISOString(),
      totalVotes: Math.floor(Math.random() * 1000) + 500,
      totalEligible: 2500,
      turnoutPercentage: 0,
      areaBreakdown: [
        { areaId: 'area1', areaName: 'Main Hall', votes: 250, eligible: 800, percentage: 0 },
        { areaId: 'area2', areaName: 'Conference Room A', votes: 150, eligible: 500, percentage: 0 },
        { areaId: 'area3', areaName: 'Conference Room B', votes: 180, eligible: 600, percentage: 0 },
        { areaId: 'area4', areaName: 'Auditorium', votes: 120, eligible: 600, percentage: 0 }
      ]
    };
    
    // Calculate percentages
    mockTurnoutData.turnoutPercentage = (mockTurnoutData.totalVotes / mockTurnoutData.totalEligible) * 100;
    mockTurnoutData.areaBreakdown.forEach(area => {
      area.percentage = (area.votes / area.eligible) * 100;
    });
    
    return { success: true, data: mockTurnoutData };
  }
};

// Settings API
export const settingsApi = {
  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    await delay(500);
    const mockSettings: SystemSettings = {
      general: {
        organizationName: 'University Election Commission',
        timezone: 'UTC-5',
        language: 'en',
        dateFormat: 'MM/DD/YYYY'
      },
      security: {
        sessionTimeout: 30,
        passwordPolicy: {
          minLength: 8,
          requireSpecialChars: true,
          requireNumbers: true,
          requireUppercase: true
        },
        twoFactorEnabled: false
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notificationRoles: ['admin', 'observer']
      }
    };
    return { success: true, data: mockSettings };
  },

  async updateSettings(settings: SystemSettings): Promise<ApiResponse<SystemSettings>> {
    await delay(1000);
    return { success: true, data: settings };
  }
};

// Reports API
export const reportsApi = {
  async generateReport(type: 'pdf' | 'csv' | 'excel', electionId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    await delay(2000);
    return {
      success: true,
      data: { downloadUrl: `#download-${type}-${electionId}` }
    };
  },

  async publishResults(electionId: string): Promise<ApiResponse<void>> {
    await delay(1500);
    return { success: true, data: undefined };
  }
};
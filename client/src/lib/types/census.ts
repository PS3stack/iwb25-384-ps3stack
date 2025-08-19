export interface CensusProject {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  isPublic: boolean;
  targetPopulation: number;
  currentResponses: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface DataCollector {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  assignedAreas: string[];
  status: 'active' | 'inactive' | 'suspended';
  totalAssignments: number;
  completedAssignments: number;
  createdAt: string;
}

export interface Household {
  id: string;
  householdNumber: string;
  address: string;
  area: string;
  collectorId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  members: number;
  lastVisit?: string;
  notes?: string;
  createdAt: string;
}

export interface CensusResponse {
  id: string;
  householdId: string;
  collectorId: string;
  responses: Record<string, any>;
  status: 'draft' | 'submitted' | 'verified';
  submittedAt?: string;
  verifiedAt?: string;
}

export interface CensusArea {
  id: string;
  name: string;
  code: string;
  description: string;
  targetHouseholds: number;
  completedHouseholds: number;
  assignedCollectors: string[];
}
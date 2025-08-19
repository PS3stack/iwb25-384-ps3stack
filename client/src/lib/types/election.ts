export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'general' | 'primary' | 'local' | 'referendum';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  eligibilityRequirements: string[];
  totalVoters: number;
  votesCount: number;
  turnoutPercentage: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  party: string;
  position: string;
  electionId: string;
  biography: string;
  photoUrl?: string;
  votes: number;
  percentage: number;
}

export interface Voter {
  id: string;
  voterId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  pollingStation: string;
  hasVoted: boolean;
  voteTime?: string;
}

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  capacity: number;
  assignedVoters: number;
  currentVoters: number;
  officials: PollingOfficial[];
}

export interface PollingOfficial {
  id: string;
  firstName: string;
  lastName: string;
  role: 'presiding_officer' | 'assistant' | 'observer';
  pollingStationId: string;
  credentials: string;
  status: 'active' | 'inactive';
}

export interface Vote {
  id: string;
  voterId: string;
  electionId: string;
  pollingStationId: string;
  timestamp: string;
  verified: boolean;
}
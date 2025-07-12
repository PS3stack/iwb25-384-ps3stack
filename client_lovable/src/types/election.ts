
export interface ElectionMetrics {
  activeElections: number;
  totalVotes: number;
  totalVoters: number;
  liveResults: number;
  voterTurnout: number;
}

export interface ActiveElection {
  id: string;
  title: string;
  type: 'election' | 'census';
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  endDate: string;
  totalVotes: number;
  totalVoters: number;
  turnoutPercentage: number;
  isLiveResults: boolean;
  description: string;
  location?: string;
}

export interface VoteData {
  timestamp: string;
  votes: number;
  election: string;
}

export interface ChartData {
  time: string;
  votes: number;
  cumulative: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'committee' | 'observer' | 'grama_niladhari';
  tenantId: string;
}

export interface AuthContextType {
  user: User | null;
  tenant: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}


import axios from 'axios';
import { ElectionMetrics, ActiveElection, ChartData } from '@/types/election';

class ElectionService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // TODO: Uncomment when backend is ready
  // async getMetrics(): Promise<ElectionMetrics> {
  //   const response = await axios.get(`${this.baseURL}/elections/metrics`);
  //   return response.data;
  // }

  // async getActiveElections(): Promise<ActiveElection[]> {
  //   const response = await axios.get(`${this.baseURL}/elections/active`);
  //   return response.data;
  // }

  // async getChartData(): Promise<ChartData[]> {
  //   const response = await axios.get(`${this.baseURL}/elections/chart-data`);
  //   return response.data;
  // }

  // Dummy data methods - remove when backend is ready
  getDummyMetrics(): ElectionMetrics {
    return {
      activeElections: 4,
      totalVotes: 15847,
      totalVoters: 16142,
      liveResults: 3,
      voterTurnout: 98.2
    };
  }

  getDummyActiveElections(): ActiveElection[] {
    return [
      {
        id: '1',
        title: 'Presidential Election 2024',
        type: 'election',
        status: 'active',
        startDate: '2024-07-12T08:00:00Z',
        endDate: '2024-07-12T18:00:00Z',
        totalVotes: 8453,
        totalVoters: 8621,
        turnoutPercentage: 98.1,
        isLiveResults: true,
        description: 'National presidential election with real-time results.',
        location: 'Nationwide'
      },
      {
        id: '2',
        title: 'Local Council Elections',
        type: 'election',
        status: 'active',
        startDate: '2024-07-12T09:00:00Z',
        endDate: '2024-07-12T17:00:00Z',
        totalVotes: 3247,
        totalVoters: 3456,
        turnoutPercentage: 93.9,
        isLiveResults: false,
        description: 'Municipal council member selection for Districts 1-5.',
        location: 'Districts 1-5'
      },
      {
        id: '3',
        title: 'Population Census 2024',
        type: 'census',
        status: 'active',
        startDate: '2024-07-10T00:00:00Z',
        endDate: '2024-07-20T23:59:59Z',
        totalVotes: 4147,
        totalVoters: 4065,
        turnoutPercentage: 102.0,
        isLiveResults: true,
        description: 'National population and housing census count.',
        location: 'All Provinces'
      },
      {
        id: '4',
        title: 'School Board Election',
        type: 'election',
        status: 'pending',
        startDate: '2024-07-15T10:00:00Z',
        endDate: '2024-07-15T16:00:00Z',
        totalVotes: 0,
        totalVoters: 892,
        turnoutPercentage: 0,
        isLiveResults: true,
        description: 'Annual school board member elections.',
        location: 'Education District 3'
      }
    ];
  }

  getDummyChartData(): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const votes = Math.floor(Math.random() * 200) + 50;
      const cumulative = data.length > 0 ? data[data.length - 1].cumulative + votes : votes;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        votes,
        cumulative
      });
    }
    
    return data;
  }
}

export const electionService = new ElectionService();

import axios from 'axios';

// Stubbed API service for elections
export class ElectionsAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sp3vote.example.com';

  async getActiveElections() {
    // return await axios.get(`${this.baseURL}/elections/active`);
    // Stubbed with dummy data
    const { active_elections } = await import('@/data/fixtures/elections.json');
    return { data: active_elections };
  }

  async getElectionById(id: string) {
    // return await axios.get(`${this.baseURL}/elections/${id}`);
    const { active_elections } = await import('@/data/fixtures/elections.json');
    const election = active_elections.find(e => e.id === id);
    return { data: election };
  }

  async createElection(electionData: any) {
    // return await axios.post(`${this.baseURL}/elections`, electionData);
    console.log('Creating election:', electionData);
    return { data: { id: 'elec_new', ...electionData, status: 'draft' } };
  }

  async updateElection(id: string, updates: any) {
    // return await axios.put(`${this.baseURL}/elections/${id}`, updates);
    console.log('Updating election:', id, updates);
    return { data: { id, ...updates } };
  }

  async deleteElection(id: string) {
    // return await axios.delete(`${this.baseURL}/elections/${id}`);
    console.log('Deleting election:', id);
    return { data: { success: true } };
  }

  async getLiveResults(electionId: string) {
    // return await axios.get(`${this.baseURL}/elections/${electionId}/results`);
    const { active_elections } = await import('@/data/fixtures/elections.json');
    const election = active_elections.find(e => e.id === electionId);
    return { data: election?.candidates || [] };
  }

  async uploadVoterList(electionId: string, file: File) {
    // const formData = new FormData();
    // formData.append('file', file);
    // return await axios.post(`${this.baseURL}/elections/${electionId}/voters`, formData);
    console.log('Uploading voter list for election:', electionId, file.name);
    return { data: { uploaded: 1500, errors: 0 } };
  }
}

export const electionsAPI = new ElectionsAPI();
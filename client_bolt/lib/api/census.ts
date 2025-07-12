import axios from 'axios';

export class CensusAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sp3vote.example.com';

  async getCensusData() {
    // return await axios.get(`${this.baseURL}/census/active`);
    const { census_data } = await import('@/data/fixtures/elections.json');
    return { data: census_data };
  }

  async submitHouseholdCount(data: any) {
    // return await axios.post(`${this.baseURL}/census/household`, data);
    console.log('Submitting household count:', data);
    return { data: { success: true, confirmation_id: 'HC-' + Date.now() } };
  }

  async getDistrictStats(district: string) {
    // return await axios.get(`${this.baseURL}/census/districts/${district}`);
    const { census_data } = await import('@/data/fixtures/elections.json');
    const districtData = census_data[0]?.districts.find(d => d.name === district);
    return { data: districtData };
  }
}

export const censusAPI = new CensusAPI();
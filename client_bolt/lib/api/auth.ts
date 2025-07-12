import axios from 'axios';

export class AuthAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sp3vote.example.com';

  async login(email: string, password: string) {
    // return await axios.post(`${this.baseURL}/auth/login`, { email, password });
    const users = await import('@/data/fixtures/users.json');
    
    // Find user across all role arrays
    const allUsers = [
      ...users.admin_users,
      ...users.committee_members, 
      ...users.observers,
      ...users.census_officers
    ];
    
    const user = allUsers.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      return {
        data: {
          user,
          token: 'jwt_token_' + user.id,
          tenant: 'tenant_001'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async logout() {
    // return await axios.post(`${this.baseURL}/auth/logout`);
    console.log('Logging out user');
    return { data: { success: true } };
  }

  async getProfile() {
    // return await axios.get(`${this.baseURL}/auth/profile`);
    // Return current user from localStorage/context
    return { data: JSON.parse(localStorage.getItem('user') || '{}') };
  }
}

export const authAPI = new AuthAPI();
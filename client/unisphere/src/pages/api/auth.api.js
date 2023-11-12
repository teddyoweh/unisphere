import axios from 'axios';

class AuthApi {
    constructor() {
      this.api = axios.create({
        baseURL:"http://localhost:9990",
      });
    }
  
    
    async register(userData) {
      try {
        const response = await this.api.post('/api/auth/register', userData);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  
    
    async login(credentials) {
      try {
        const response = await this.api.post('/api/auth/login', credentials);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }

  export default new AuthApi();
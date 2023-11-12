import axios from 'axios';

class ThreadApi {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9990",
    });
  }

  async sendThread(threadData) {
    try {
      const response = await this.api.post('/api/threads/send', threadData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getThread(receiver_id, sender_id) {
    try {
      const response = await this.api.post('/api/threads/get', {
        receiver_id
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getThreadMajors() {
    try {
      const response = await this.api.post('/api/threads/getmajors');
    
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async getThreadCourses() {
    try {
      const response = await this.api.post('/api/threads/getcourses');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default new ThreadApi();

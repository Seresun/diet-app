import { API_BASE_URL } from '../config/api.js';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API: Making request to:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('API: Request config:', config);
      const response = await fetch(url, config);
      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API: Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.log('API: API_BASE_URL =', API_BASE_URL);
      console.log('API: endpoint =', endpoint);
      throw error;
    }
  }

  // Получить все диагнозы с полными данными
  async getDiagnoses() {
    const data = await this.request('/diagnoses');
    console.log('API: getDiagnoses response:', data);
    return data;
  }

  // Получить конкретный диагноз по ID с полными данными
  async getDiagnosis(id) {
    const data = await this.request(`/daily-plan/id/${id}`);
    console.log('API: getDiagnosis response for id', id, ':', data);
    return data;
  }

  // Получить план питания для диагноза
  async getDailyPlan(diagnosisId) {
    console.log('API: getDailyPlan called with diagnosisId:', diagnosisId);
    const data = await this.request(`/daily-plan/id/${diagnosisId}`);
    console.log('API: getDailyPlan response:', data);
    return data;
  }
}

export default new ApiService();

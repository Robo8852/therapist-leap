// API Configuration
// Update this URL when deploying to production
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'  // Local Encore development
  : 'https://your-production-url.com';  // Replace with actual production URL

// API Endpoints
const API_ENDPOINTS = {
  // Contact
  contactSubmit: `${API_BASE_URL}/contact/submit`,

  // Testimonials
  testimonials: `${API_BASE_URL}/testimonials`,

  // Team
  team: `${API_BASE_URL}/team`,

  // Services
  services: `${API_BASE_URL}/services`,
  servicesByCategory: (category) => `${API_BASE_URL}/services/category/${category}`,

  // Appointments
  appointmentsBook: `${API_BASE_URL}/appointments/book`,

  // Auth
  authLogin: `${API_BASE_URL}/auth/login`,
  authRegister: `${API_BASE_URL}/auth/register`,
  authVerify: `${API_BASE_URL}/auth/verify`,
};

// API Helper Functions
const API = {
  // Generic POST request
  async post(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Generic GET request
  async get(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Submit contact form
  async submitContact(data) {
    return await this.post(API_ENDPOINTS.contactSubmit, data);
  },

  // Get testimonials
  async getTestimonials() {
    return await this.get(API_ENDPOINTS.testimonials);
  },

  // Get team members
  async getTeamMembers() {
    return await this.get(API_ENDPOINTS.team);
  },

  // Get services
  async getServices() {
    return await this.get(API_ENDPOINTS.services);
  },

  // Get services by category
  async getServicesByCategory(category) {
    return await this.get(API_ENDPOINTS.servicesByCategory(category));
  },

  // Book appointment
  async bookAppointment(data) {
    return await this.post(API_ENDPOINTS.appointmentsBook, data);
  },

  // Login
  async login(email, password) {
    return await this.post(API_ENDPOINTS.authLogin, { email, password });
  },
};

// Make API available globally
window.API = API;
window.API_ENDPOINTS = API_ENDPOINTS;

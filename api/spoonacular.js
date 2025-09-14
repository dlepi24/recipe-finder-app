const axios = require('axios');

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

class SpoonacularAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = SPOONACULAR_BASE_URL;
  }

  async searchRecipes(query, filters = {}) {
    try {
      const params = {
        apiKey: this.apiKey,
        query: query,
        number: filters.number || 12,
        addRecipeInformation: true,
        fillIngredients: true,
        ...filters
      };

      const response = await axios.get(`${this.baseURL}/recipes/complexSearch`, {
        params,
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const apiMsg = error?.response?.data?.message || error?.response?.data?.statusMessage;
      console.error('Spoonacular API search error:', status, error.message, apiMsg);
      const msg = apiMsg || error.message || 'Failed to search recipes';
      throw new Error(msg);
    }
  }

  async getRecipeDetails(id) {
    try {
      const params = {
        apiKey: this.apiKey,
        includeNutrition: true
      };

      const response = await axios.get(`${this.baseURL}/recipes/${id}/information`, {
        params,
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const apiMsg = error?.response?.data?.message || error?.response?.data?.statusMessage;
      console.error('Spoonacular API details error:', status, error.message, apiMsg);
      const msg = apiMsg || error.message || 'Failed to get recipe details';
      throw new Error(msg);
    }
  }
}

module.exports = SpoonacularAPI;
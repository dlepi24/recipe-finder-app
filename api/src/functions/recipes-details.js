const { app } = require('@azure/functions');
const SpoonacularAPI = require('../../spoonacular');

app.http('recipes-details', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'recipe/{id}',
  handler: async (request, context) => {
    try {
      const apiKey = process.env.SPOONACULAR_API_KEY;
      if (!apiKey) {
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'API key not configured' })
        };
      }

      // Log incoming request for debugging
      context.log('Recipe details request received:', {
        url: request.url,
        params: request.params,
        method: request.method
      });

      // Get the id from route parameters
      const id = request.params.id;
      if (!id || isNaN(parseInt(id))) {
        context.log('Invalid recipe ID:', id);
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Valid recipe ID is required' })
        };
      }

      context.log('Fetching recipe details for ID:', id);

      const spoonacular = new SpoonacularAPI(apiKey);
      const recipe = await spoonacular.getRecipeDetails(parseInt(id));

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(recipe)
      };
    } catch (error) {
      context.log('Error in recipes-details:', error);
      const message = error?.message || 'Internal server error';
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message })
      };
    }
  }
});

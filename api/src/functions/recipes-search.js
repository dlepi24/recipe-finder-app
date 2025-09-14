const { app } = require('@azure/functions');
const SpoonacularAPI = require('../../spoonacular');

app.http('recipes-search', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'recipes/search',
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
      context.log('Search request received:', {
        url: request.url,
        query: request.query,
        method: request.method
      });

      // Robust param extraction for SWA/Azure v4: support both object and URL parsing
      const getParam = (name) => {
        try {
          if (request.query && (name in request.query)) return request.query[name];
          const url = new URL(request.url);
          return url.searchParams.get(name);
        } catch {
          return undefined;
        }
      };

      const query = getParam('query');
      if (!query) {
        context.log('Missing query parameter. request.query:', request.query, 'url:', request.url);
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Query parameter is required' })
        };
      }

      const filters = {};
      const diet = getParam('diet');
      const cuisine = getParam('cuisine');
      const intolerances = getParam('intolerances');
      const type = getParam('type');
      const maxReadyTime = getParam('maxReadyTime');

      if (diet) filters.diet = diet;
      if (cuisine) filters.cuisine = cuisine;
      if (intolerances) filters.intolerances = intolerances;
      if (type) filters.type = type;
      if (maxReadyTime) filters.maxReadyTime = parseInt(maxReadyTime);

      context.log('Parsed parameters:', { query, filters });

      const spoonacular = new SpoonacularAPI(apiKey);
      const results = await spoonacular.searchRecipes(query, filters);

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(results)
      };
    } catch (error) {
      context.log('Error in recipes-search:', error);
      const message = error?.message || 'Internal server error';
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message })
      };
    }
  }
});

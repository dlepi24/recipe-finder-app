# Recipe Finder 🍳

A modern, responsive recipe discovery application vibe coded with Lovable.dev and constructed with React, TypeScript, and Azure Static Web Apps. This project demonstrates the seamless integration of a frontend application with Azure Functions as the backend API, all deployed on Azure's Static Web Apps platform.

Follow along step-by-step with my blog post [here](https://open.substack.com/pub/dustinlepi/p/lovable-azure-how-to-host-your-app).

## 🎯 Project Overview

Recipe Finder is a **hobby project and proof of concept** designed to showcase:

- **Azure Static Web Apps (SWA)** deployment and hosting
- **GitHub Actions** integration for CI/CD
- **Azure Functions** as serverless backend APIs
- **Modern React** with TypeScript and Vite
- **Tailwind CSS** with custom design system
- **External API integration** (Spoonacular API)
- **Responsive design** with mobile-first approach

## ✨ Features

- **Smart Recipe Search**: Find recipes by ingredients, cuisine, or dietary preferences
- **Advanced Filtering**: Filter by diet (vegan, keto, etc.), cuisine type, cooking time, and meal type
- **Detailed Recipe Views**: Comprehensive ingredient lists, step-by-step instructions, and nutritional information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Food-focused design with elegant animations and shadows
- **Favorites System**: Save and manage your favorite recipes
- **Error Handling**: Robust error handling with user-friendly messages

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** for component library
- **Lucide React** for icons
- **React Query** for data fetching and caching
- **React Router** for navigation

### Backend
- **Azure Functions v4** (Node.js)
- **Spoonacular API** for recipe data
- **Axios** for HTTP requests

### Infrastructure
- **Azure Static Web Apps**
- **GitHub Actions** for CI/CD
- **Custom domain support** (optional)

## 🚀 Getting Started

### Prerequisites

- Azure account (free tier works fine)
- GitHub account
- Spoonacular API account (free tier available)

## 🌐 Deploy to Azure Static Web Apps

### Step 1: Create a Spoonacular Account

1. Go to [Spoonacular API](https://spoonacular.com/food-api)
2. Sign up for a free account
3. Navigate to your dashboard and copy your API key
4. **Important**: Keep this key secure and never commit it to your repository

### Step 2: Fork or Import this Repository

1. Fork this repository to your GitHub account, or
2. Create a new repository and import this code

### Step 3: Create Azure Static Web App

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create a new Static Web App**
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

3. **Configure Basic Settings**
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Choose a unique name (e.g., `recipe-finder-app`)
   - **Plan type**: Select "Free" for development
   - **Region**: Choose the closest region to your users

4. **Configure Deployment**
   - **Source**: Select "GitHub"
   - **GitHub account**: Authorize Azure to access your GitHub
   - **Organization**: Select your GitHub username/organization
   - **Repository**: Select your forked repository
   - **Branch**: Select `main` (or your default branch)

5. **Configure Build Settings**
   - **Build Presets**: Select "React"
   - **App location**: `/` (root)
   - **Api location**: `api`
   - **Output location**: `dist` ⚠️ **This is important for Vite/Tailwind builds**

6. **Review and Create**
   - Review all settings
   - Click "Create"

### Step 4: Configure Environment Variables

1. **Navigate to your Static Web App**
   - Go to your resource in Azure Portal
   - Select "Configuration" from the left menu

2. **Add Application Settings**
   - Click "Add" to create a new application setting
   - **Name**: `SPOONACULAR_API_KEY`
   - **Value**: Your API key from Step 1
   - Click "OK"
   - Click "Save" at the top

### Step 5: Wait for Deployment

1. **Monitor the GitHub Action**
   - Go to your GitHub repository
   - Click on the "Actions" tab
   - You should see a workflow running
   - Wait for it to complete successfully (green checkmark)

2. **Access Your App**
   - Return to Azure Portal
   - On your Static Web App overview page, click the URL
   - Your app should be live!

## 🔧 Configuration Options

### Custom Domain (Optional)

1. In Azure Portal, go to your Static Web App
2. Select "Custom domains" from the left menu
3. Click "Add" and follow the instructions
4. Configure DNS settings with your domain provider

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOONACULAR_API_KEY` | Your Spoonacular API key | Yes |

### Build Configuration

The app uses these build settings:
- **App location**: `/` (React app root)
- **API location**: `api` (Azure Functions)
- **Output location**: `dist` (Vite build output)

## 📁 Project Structure

```
recipe-finder/
├── api/                          # Azure Functions backend
│   ├── src/functions/           # Function endpoints
│   ├── spoonacular.js          # Spoonacular API client
│   ├── host.json              # Functions host configuration
│   └── package.json           # Backend dependencies
├── src/                        # React frontend
│   ├── components/            # React components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utilities
├── public/                    # Static assets
├── .github/workflows/        # GitHub Actions (auto-generated)
├── staticwebapp.config.json  # SWA configuration
└── package.json             # Frontend dependencies
```

## 🎨 Customization

### Design System

The app uses a custom food-focused design system with:
- **Colors**: Warm oranges, fresh greens, and elegant neutrals
- **Typography**: Modern, readable font stack
- **Animations**: Subtle hover effects and loading states
- **Shadows**: Elegant depth and layering

### API Endpoints

- `GET /api/recipes/search` - Search recipes with filters
- `GET /api/recipe/{id}` - Get detailed recipe information

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with "Output location not found"**
   - Ensure the output location is set to `dist` in your Static Web App configuration

2. **API calls return 500 errors**
   - Check that your `SPOONACULAR_API_KEY` environment variable is set correctly
   - Verify your Spoonacular API key is valid and has remaining quota

3. **CORS errors in development**
   - Ensure the Azure Functions are running on the correct port
   - Check `api/local.settings.json` CORS configuration

4. **Recipes not loading**
   - Check browser console for errors
   - Verify API endpoints are responding
   - Check Spoonacular API rate limits

### Getting Help

- Check the [Azure Static Web Apps documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- Review [Spoonacular API documentation](https://spoonacular.com/food-api/docs)

## 📊 Spoonacular API Limits

### Free Tier
- **50 requests per day**
- Access to basic recipe information
- Perfect for development and testing

### Paid Plans
- **Mega Plan**: 1,500 requests/day ($9/month)
- **Ultra Plan**: 15,000 requests/day ($19/month)
- **Ultra+ Plan**: 150,000 requests/day ($49/month)

For production applications, consider upgrading based on your expected usage.

## 🤝 Contributing

This is a hobby/proof-of-concept project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🏗️ What This Project Demonstrates

- **Modern Web Development**: React 18, TypeScript, Vite, Tailwind CSS
- **Serverless Architecture**: Azure Functions for API backend
- **CI/CD Pipeline**: GitHub Actions integration with Azure
- **External API Integration**: Real-world API consumption and error handling
- **Responsive Design**: Mobile-first, accessible user interface
- **Production Deployment**: Full deployment to Azure cloud platform

## 🎯 Next Steps

Consider extending this project with:

- User authentication (Azure AD B2C)
- Recipe favorites persistence (Azure Cosmos DB)
- Meal planning features
- Shopping list generation
- Recipe sharing and reviews
- Progressive Web App (PWA) features

---

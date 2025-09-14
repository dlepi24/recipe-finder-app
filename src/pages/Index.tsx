import { useState, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { RecipeModal } from "@/components/RecipeModal";
import { SearchFilters } from "@/components/SearchFilters";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImage from "@/assets/hero-food.jpg";


const Index = () => {
  const [inputQuery, setInputQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [filters, setFilters] = useState<{
    diet?: string;
    cuisine?: string;
    intolerances?: string;
    type?: string;
    maxReadyTime?: number;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSearch = useCallback(async () => {
    if (!inputQuery.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Try searching for 'chicken', 'pasta', or 'vegan'",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        query: inputQuery
      });

      // Track submitted query for header display
      setSubmittedQuery(inputQuery);

      // Add filters if they exist
      if (filters.diet) params.append('diet', filters.diet);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.intolerances) params.append('intolerances', filters.intolerances);
      if (filters.type) params.append('type', filters.type);
      if (filters.maxReadyTime) params.append('maxReadyTime', filters.maxReadyTime.toString());

      // Always use same-origin API to avoid CORS issues; SWA serves /api from the same host
      const response = await fetch(`/api/recipes/search?${params}`, {
        headers: { Accept: 'application/json' }
      });
      
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        let errorText = `Failed to search recipes (${response.status})`;
        try {
          const err = contentType.includes('application/json') ? await response.json() : { error: await response.text() };
          if (err?.error) errorText = err.error;
        } catch {}
        throw new Error(errorText);
      }

      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Unexpected non-JSON response. First 120 chars: ${text.slice(0, 120)}`);
      }
      
      const data = await response.json();
      
      // Transform Spoonacular data to our format
      const transformedRecipes = data.results?.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary,
        cuisines: recipe.cuisines || [],
        diets: recipe.diets || [],
        dishTypes: recipe.dishTypes || [],
        isFavorite: false
      })) || [];
      
      setRecipes(transformedRecipes);
      
      toast({
        title: "Search completed",
        description: `Found ${transformedRecipes.length} recipes`,
      });
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error?.message || "Unable to search recipes. Please try again.",
        variant: "destructive"
      });
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [inputQuery, filters, toast]);

  const handleFilterChange = (filterType: string, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const fetchRecipeDetails = async (recipeId: number) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`/api/recipe/${recipeId}`, {
        headers: { Accept: 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe details (${response.status})`);
      }
      
      const recipeDetails = await response.json();
      
      // Transform the detailed recipe data
      const transformedRecipe = {
        ...recipeDetails,
        extendedIngredients: recipeDetails.extendedIngredients || [],
        analyzedInstructions: recipeDetails.analyzedInstructions || [],
        nutrition: recipeDetails.nutrition ? {
          calories: recipeDetails.nutrition.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 'N/A',
          protein: recipeDetails.nutrition.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 'N/A',
          carbs: recipeDetails.nutrition.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 'N/A',
          fat: recipeDetails.nutrition.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 'N/A',
        } : null,
        isFavorite: recipes.find(r => r.id === recipeId)?.isFavorite || false
      };
      
      setSelectedRecipe(transformedRecipe);
    } catch (error: any) {
      console.error('Error fetching recipe details:', error);
      toast({
        title: "Failed to load recipe details",
        description: error?.message || "Unable to load recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleRecipeClick = (recipe: any) => {
    fetchRecipeDetails(recipe.id);
  };

  const handleFavorite = (recipeId: number) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorite: !recipe.isFavorite }
        : recipe
    ));
    
    // Update the selected recipe if it's currently open
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : prev);
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    toast({
      title: recipe?.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: recipe?.title,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 recipe-hero overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto text-center animation-sweep-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
              Favorite Recipe
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Search thousands of delicious recipes, filter by your dietary preferences, and cook something amazing tonight.
          </p>
          
          {/* Search Tips */}
          <div className="mb-6 text-white/95 text-sm">
            <span className="font-medium">Try:</span> pasta, chicken, dessert, quick meals
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="What sounds delicious today?"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="recipe-search pl-12 h-12 md:h-14 text-base md:text-lg text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 h-12 md:h-14 text-base md:text-lg font-medium"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(true)}
                className="h-12 md:h-14 px-4 md:px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
                title="Filter by diet, cuisine, meal type, and cooking time"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline ml-2">Filters</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            {!isMobile && showFilters && (
              <aside className="w-80 flex-shrink-0 animation-sweep-in">
                <SearchFilters
                  activeFilters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearFilters}
                />
              </aside>
            )}

            {/* Recipe Grid */}
            <main className="flex-1 min-w-0">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {isLoading ? 
                    <span className="flex items-center gap-2">
                      <div className="animate-pulse w-4 h-4 md:w-6 md:h-6 bg-primary rounded-full"></div>
                      <span className="text-base md:text-2xl">Finding your perfect recipe...</span>
                    </span>
                    : submittedQuery ? `Recipes matching "${submittedQuery}"` : "Let's cook something amazing!"
                  }
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {isLoading ? 
                    "Sifting through our recipe collection just for you..." 
                    : submittedQuery ? 
                      `${recipes.length} delicious ${recipes.length === 1 ? 'option' : 'options'} ready to try` 
                      : "What are you craving? Search above and let's get cooking!"
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="animation-sweep-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <RecipeCardSkeleton />
                    </div>
                  ))
                ) : (
                  // Actual recipes
                  recipes.map((recipe, index) => (
                    <div 
                      key={recipe.id} 
                      className="animation-sweep-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        onClick={handleRecipeClick}
                        onFavorite={handleFavorite}
                      />
                    </div>
                  ))
                )}
              </div>

              {!isLoading && recipes.length === 0 && submittedQuery && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Hmm, no matches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Don't worry! Let's try a different approach
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2"><strong>Suggestions:</strong></p>
                    <ul className="space-y-1">
                      <li>• Use simpler keywords like "chicken" instead of "grilled chicken breast"</li>
                      <li>• Remove some filters to see more results</li>
                      <li>• Try popular searches: "pasta", "salad", "soup", "dessert"</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {!isLoading && recipes.length === 0 && !submittedQuery && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">Your kitchen adventure awaits!</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Tell us what you're hungry for and we'll find the perfect recipe
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                    {["Pasta", "Chicken", "Vegetarian", "Dessert", "Quick meals", "Healthy"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInputQuery(suggestion.toLowerCase());
                          // Don't auto-search, let user hit enter or click search
                        }}
                        className="text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <Drawer open={isMobile && showFilters} onOpenChange={setShowFilters}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-semibold">Filter Recipes</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <SearchFilters
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe || isLoadingDetails}
        onClose={() => setSelectedRecipe(null)}
        onFavorite={handleFavorite}
        isLoading={isLoadingDetails}
      />
    </div>
  );
};

export default Index;
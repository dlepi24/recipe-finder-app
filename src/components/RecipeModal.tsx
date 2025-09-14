import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, Heart, Share2, Printer, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  cuisines: string[];
  diets: string[];
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  analyzedInstructions: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  instructions?: string;
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  isFavorite?: boolean;
}

interface RecipeModalProps {
  recipe: RecipeDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (recipeId: number) => void;
  isLoading?: boolean;
}

export const RecipeModal = ({ recipe, isOpen, onClose, onFavorite, isLoading }: RecipeModalProps) => {
  if (!recipe && !isLoading) return null;

  const handleFavorite = () => {
    if (recipe) {
      onFavorite?.(recipe.id);
    }
  };

  const handleShare = () => {
    if (recipe && navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this delicious recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } else if (recipe) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const parseHtmlInstructions = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const items = Array.from(tmp.querySelectorAll("li"));
    if (items.length) return items.map(li => li.textContent?.trim() || "").filter(Boolean);
    const text = tmp.textContent || tmp.innerText || "";
    return text.split(/\.\s+/).map(s => s.trim()).filter(Boolean);
  };

  // Only process recipe data if recipe exists
  const instructions = recipe?.analyzedInstructions?.[0]?.steps || [];
  const htmlSteps = recipe && !instructions.length && recipe.instructions
    ? parseHtmlInstructions(recipe.instructions)
    : [];

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading recipe details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {recipe.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        <ScrollArea className="flex-1 h-0">
          <div className="p-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={recipe.isFavorite ? "default" : "outline"}
                onClick={handleFavorite}
                className="flex items-center gap-2"
              >
                <Heart className={cn("w-4 h-4", recipe.isFavorite && "fill-current")} />
                {recipe.isFavorite ? "Favorited" : "Favorite"}
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.cuisines?.map((cuisine) => (
                <Badge key={cuisine} variant="secondary">
                  {cuisine}
                </Badge>
              ))}
              {recipe.diets?.map((diet) => (
                <Badge key={diet} variant="outline" className="border-secondary text-secondary">
                  {diet}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                About this recipe
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {stripHtml(recipe.summary)}
              </p>
            </div>

            <Separator />

            {/* Nutrition (if available) */}
            {recipe.nutrition && (
              <>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</div>
                      <div className="text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-secondary">{recipe.nutrition.protein}</div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-accent">{recipe.nutrition.carbs}</div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-recipe-warm">{recipe.nutrition.fat}</div>
                      <div className="text-sm text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Ingredients</h3>
              <div className="grid gap-2">
                {recipe.extendedIngredients?.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-16 text-sm font-medium text-primary">
                      {ingredient.amount} {ingredient.unit}
                    </div>
                    <div className="text-sm">{ingredient.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            {instructions.length > 0 ? (
              <div>
                <h3 className="font-semibold text-lg mb-4">Instructions</h3>
                <div className="space-y-4">
                  {instructions.map((step) => (
                    <div key={step.number} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.number}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{step.step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : htmlSteps.length > 0 ? (
              <div>
                <h3 className="font-semibold text-lg mb-4">Instructions</h3>
                <div className="space-y-4">
                  {htmlSteps.map((text, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg mb-4">Instructions</h3>
                <div className="bg-muted rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    Instructions not available for this recipe. Visit the source website for cooking directions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  cuisines: string[];
  diets: string[];
  dishTypes?: string[];
  isFavorite?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  onFavorite?: (recipeId: number) => void;
  className?: string;
}

export const RecipeCard = ({ recipe, onClick, onFavorite, className }: RecipeCardProps) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(recipe.id);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Card 
      className={cn(
        "recipe-card cursor-pointer group overflow-hidden border-0 shadow-[var(--shadow-elegant)]",
        "hover:shadow-[var(--shadow-recipe)] transition-all duration-300",
        className
      )}
      onClick={() => onClick(recipe)}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200"
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-all duration-200",
              recipe.isFavorite ? "fill-recipe-warm text-recipe-warm" : "text-muted-foreground hover:text-recipe-warm"
            )}
          />
        </button>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-200">
          {recipe.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {stripHtml(recipe.summary)}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.readyInMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.cuisines?.slice(0, 2).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="text-xs">
              {cuisine}
            </Badge>
          ))}
          {recipe.diets?.slice(0, 1).map((diet) => (
            <Badge key={diet} variant="outline" className="text-xs border-secondary text-secondary">
              {diet}
            </Badge>
          ))}
          {recipe.dishTypes?.slice(0, 1).map((type) => (
            <Badge key={type} variant="default" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
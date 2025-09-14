import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SearchFiltersProps {
  activeFilters: {
    diet?: string;
    cuisine?: string;
    maxReadyTime?: number;
    type?: string;
  };
  onFilterChange: (filterType: string, value: string | number | null) => void;
  onClearAll: () => void;
}

const DIET_OPTIONS = [
  "Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Paleo", "Pescetarian"
];

const CUISINE_OPTIONS = [
  "Italian", "Mexican", "Asian", "American", "Mediterranean", "Indian", "French", "Thai"
];

const MEAL_TYPES = [
  "Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer"
];

const TIME_OPTIONS = [
  { label: "Quick (≤30 min)", value: 30 },
  { label: "Medium (≤60 min)", value: 60 },
  { label: "Any time", value: null }
];

export const SearchFilters = ({ activeFilters, onFilterChange, onClearAll }: SearchFiltersProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== undefined && filter !== null);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 bg-card rounded-2xl shadow-[var(--shadow-elegant)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base md:text-lg text-card-foreground">Filters</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Refine your recipe search</p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground h-8 md:h-9 text-xs md:text-sm"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            const displayValue = key === 'maxReadyTime' ? `≤${value} min` : value;
            return (
              <Badge
                key={key}
                variant="default"
                className="flex items-center gap-1 bg-primary text-primary-foreground"
              >
                {displayValue}
                <button
                  onClick={() => onFilterChange(key, null)}
                  className="ml-1 rounded-full hover:bg-primary-foreground/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Diet Filters */}
      <div className="space-y-2 md:space-y-3">
        <h4 className="font-medium text-sm md:text-base text-foreground">Diet</h4>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((diet) => (
            <Button
              key={diet}
              variant={activeFilters.diet === diet ? "default" : "filter"}
              size="sm"
              onClick={() => onFilterChange('diet', activeFilters.diet === diet ? null : diet)}
              className="h-9 md:h-8 text-xs md:text-sm px-3 md:px-4 min-w-[44px]"
            >
              {diet}
            </Button>
          ))}
        </div>
      </div>

      {/* Cuisine Filters */}
      <div className="space-y-2 md:space-y-3">
        <h4 className="font-medium text-sm md:text-base text-foreground">Cuisine</h4>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((cuisine) => (
            <Button
              key={cuisine}
              variant={activeFilters.cuisine === cuisine ? "default" : "filter"}
              size="sm"
              onClick={() => onFilterChange('cuisine', activeFilters.cuisine === cuisine ? null : cuisine)}
              className="h-9 md:h-8 text-xs md:text-sm px-3 md:px-4 min-w-[44px]"
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* Meal Type */}
      <div className="space-y-2 md:space-y-3">
        <h4 className="font-medium text-sm md:text-base text-foreground">Meal Type</h4>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((type) => (
            <Button
              key={type}
              variant={activeFilters.type === type ? "default" : "filter"}
              size="sm"
              onClick={() => onFilterChange('type', activeFilters.type === type ? null : type)}
              className="h-9 md:h-8 text-xs md:text-sm px-3 md:px-4 min-w-[44px]"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Cooking Time */}
      <div className="space-y-2 md:space-y-3">
        <h4 className="font-medium text-sm md:text-base text-foreground">Cooking Time</h4>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((option) => (
            <Button
              key={option.label}
              variant={activeFilters.maxReadyTime === option.value ? "default" : "filter"}
              size="sm"
              onClick={() => onFilterChange('maxReadyTime', activeFilters.maxReadyTime === option.value ? null : option.value)}
              className="h-9 md:h-8 text-xs md:text-sm px-3 md:px-4 min-w-[44px]"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
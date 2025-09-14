import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipeCardSkeleton = () => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <Skeleton className="w-full h-48" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 mb-3" />
        <Skeleton className="h-4 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};
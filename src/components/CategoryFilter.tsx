import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CATEGORIES, Category } from "@/lib/categories";

interface CategoryFilterProps {
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4">
          <Badge
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors"
            onClick={() => onCategoryChange("all")}
          >
            All Categories
          </Badge>
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors capitalize"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;

import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="group bg-card rounded-lg shadow-recipe-card hover:shadow-recipe-card-hover transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {recipe.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            recipe.difficulty === 'Easy' 
              ? 'bg-green-100 text-green-800' 
              : recipe.difficulty === 'Medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <Link
          to={`/recipe/${recipe.id}`}
          className="inline-block w-full bg-gradient-primary text-primary-foreground text-center py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};
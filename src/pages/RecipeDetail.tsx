import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';
import { MicButton } from '@/components/MicButton';
import { recipes } from '@/data/recipes';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Recipe not found</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all recipes
        </Link>

        <div className="bg-card rounded-xl shadow-recipe-card overflow-hidden">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full font-medium mb-3 inline-block">
                {recipe.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl">{recipe.description}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">Cook Time</div>
                <div className="font-semibold">{recipe.cookTime}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-sm text-muted-foreground">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ChefHat className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
                <div className={`font-semibold ${
                  recipe.difficulty === 'Easy' 
                    ? 'text-green-600' 
                    : recipe.difficulty === 'Medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {recipe.difficulty}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-card-foreground">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="bg-gradient-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-card-foreground leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MicButton />
    </div>
  );
};

export default RecipeDetail;
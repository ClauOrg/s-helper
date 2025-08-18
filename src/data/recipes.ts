import chickenAlfredo from '@/assets/chicken-alfredo.jpg';
import grilledSalmon from '@/assets/grilled-salmon.jpg';
import thaiBeefStirFry from '@/assets/thai-beef-stir-fry.jpg';
import margheritaPizza from '@/assets/margherita-pizza.jpg';
import chocolateLavaCake from '@/assets/chocolate-lava-cake.jpg';
import moroccanTagine from '@/assets/moroccan-tagine.jpg';
import capreseSalad from '@/assets/caprese-salad.jpg';
import koreanBulgogi from '@/assets/korean-bulgogi.jpg';
import frenchOnionSoup from '@/assets/french-onion-soup.jpg';
import butterChicken from '@/assets/butter-chicken.jpg';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  steps: string[];
  category: string;
}

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Chicken Alfredo Pasta',
    description: 'Rich and creamy pasta dish with tender chicken and parmesan cheese',
    image: chickenAlfredo,
    cookTime: '25 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Italian',
    ingredients: [
      '400g fettuccine pasta',
      '500g chicken breast, sliced',
      '300ml heavy cream',
      '100g parmesan cheese, grated',
      '3 cloves garlic, minced',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Fresh parsley for garnish'
    ],
    steps: [
      'Cook pasta according to package directions until al dente',
      'Season chicken with salt and pepper, cook in olive oil until golden',
      'Add minced garlic to the pan and sauté for 1 minute',
      'Pour in heavy cream and bring to a gentle simmer',
      'Add grated parmesan cheese and stir until melted',
      'Toss in cooked pasta and mix well to coat',
      'Garnish with fresh parsley and serve immediately'
    ]
  },
  {
    id: '2',
    title: 'Mediterranean Grilled Salmon',
    description: 'Perfectly seasoned salmon with lemon herbs and olive oil',
    image: grilledSalmon,
    cookTime: '20 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Seafood',
    ingredients: [
      '4 salmon fillets',
      '2 lemons, juiced and zested',
      '3 tbsp olive oil',
      '2 tsp dried oregano',
      '1 tsp dried thyme',
      '2 cloves garlic, minced',
      'Salt and black pepper',
      'Fresh dill for garnish'
    ],
    steps: [
      'Preheat grill to medium-high heat',
      'Mix lemon juice, zest, olive oil, oregano, thyme, and garlic',
      'Season salmon fillets with salt and pepper',
      'Brush salmon with herb mixture on both sides',
      'Grill salmon for 4-5 minutes per side until flaky',
      'Let rest for 2 minutes before serving',
      'Garnish with fresh dill and serve with lemon wedges'
    ]
  },
  {
    id: '3',
    title: 'Spicy Thai Beef Stir Fry',
    description: 'Quick and flavorful stir fry with tender beef and fresh vegetables',
    image: thaiBeefStirFry,
    cookTime: '15 mins',
    servings: 3,
    difficulty: 'Easy',
    category: 'Asian',
    ingredients: [
      '500g beef sirloin, thinly sliced',
      '2 bell peppers, sliced',
      '1 onion, sliced',
      '3 tbsp soy sauce',
      '2 tbsp oyster sauce',
      '1 tbsp fish sauce',
      '2 tsp brown sugar',
      '3 chilies, chopped',
      '3 cloves garlic, minced',
      'Thai basil leaves'
    ],
    steps: [
      'Heat oil in a wok over high heat',
      'Add garlic and chilies, stir fry for 30 seconds',
      'Add beef and cook until browned on all sides',
      'Add onions and bell peppers, stir fry for 2 minutes',
      'Mix soy sauce, oyster sauce, fish sauce, and brown sugar',
      'Pour sauce over beef and vegetables, toss to combine',
      'Add Thai basil leaves and serve over steamed rice'
    ]
  },
  {
    id: '4',
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh mozzarella, basil, and tomatoes',
    image: margheritaPizza,
    cookTime: '30 mins',
    servings: 2,
    difficulty: 'Medium',
    category: 'Italian',
    ingredients: [
      '1 pizza dough ball',
      '200g canned tomatoes, crushed',
      '200g fresh mozzarella, sliced',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      'Salt and pepper to taste',
      'Parmesan cheese, grated'
    ],
    steps: [
      'Preheat oven to 250°C (480°F)',
      'Roll out pizza dough on floured surface',
      'Mix crushed tomatoes with garlic, salt, and pepper',
      'Spread tomato sauce evenly over dough',
      'Add slices of fresh mozzarella cheese',
      'Bake for 12-15 minutes until crust is golden',
      'Top with fresh basil leaves and drizzle with olive oil'
    ]
  },
  {
    id: '5',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with molten centers',
    image: chocolateLavaCake,
    cookTime: '20 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Dessert',
    ingredients: [
      '100g dark chocolate, chopped',
      '100g butter',
      '2 large eggs',
      '2 egg yolks',
      '50g caster sugar',
      '25g plain flour',
      'Butter for ramekins',
      'Cocoa powder for dusting',
      'Vanilla ice cream to serve'
    ],
    steps: [
      'Preheat oven to 200°C (400°F)',
      'Butter 4 ramekins and dust with cocoa powder',
      'Melt chocolate and butter in double boiler until smooth',
      'Whisk eggs, egg yolks, and sugar until thick and pale',
      'Fold melted chocolate mixture into egg mixture',
      'Sift in flour and fold gently until just combined',
      'Divide between ramekins and bake for 12 minutes until edges are firm'
    ]
  },
  {
    id: '6',
    title: 'Moroccan Lamb Tagine',
    description: 'Slow-cooked lamb with apricots, almonds, and warm spices',
    image: moroccanTagine,
    cookTime: '2 hours',
    servings: 6,
    difficulty: 'Hard',
    category: 'Middle Eastern',
    ingredients: [
      '1kg lamb shoulder, cubed',
      '2 onions, chopped',
      '200g dried apricots',
      '100g blanched almonds',
      '2 tsp ground cinnamon',
      '2 tsp ground ginger',
      '1 tsp ground cumin',
      '400ml beef stock',
      'Fresh coriander',
      'Couscous to serve'
    ],
    steps: [
      'Heat oil in tagine or heavy pot over medium heat',
      'Brown lamb pieces on all sides, then remove',
      'Cook onions until softened and translucent',
      'Add spices and cook for 1 minute until fragrant',
      'Return lamb to pot with apricots and stock',
      'Cover and simmer gently for 1.5-2 hours until tender',
      'Stir in almonds and coriander, serve with couscous'
    ]
  },
  {
    id: '7',
    title: 'Fresh Caprese Salad',
    description: 'Simple Italian salad with tomatoes, mozzarella, and basil',
    image: capreseSalad,
    cookTime: '10 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Salad',
    ingredients: [
      '4 large ripe tomatoes',
      '400g fresh mozzarella cheese',
      'Fresh basil leaves',
      '4 tbsp extra virgin olive oil',
      '2 tbsp balsamic vinegar',
      'Sea salt flakes',
      'Fresh black pepper',
      'Crusty bread to serve'
    ],
    steps: [
      'Slice tomatoes and mozzarella into 1cm thick rounds',
      'Arrange alternating slices on serving platter',
      'Tuck fresh basil leaves between tomato and cheese',
      'Drizzle with extra virgin olive oil and balsamic vinegar',
      'Season with sea salt flakes and fresh black pepper',
      'Let stand for 10 minutes to allow flavors to meld',
      'Serve with crusty bread as an appetizer or light meal'
    ]
  },
  {
    id: '8',
    title: 'Korean BBQ Bulgogi',
    description: 'Sweet and savory marinated beef grilled to perfection',
    image: koreanBulgogi,
    cookTime: '30 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Korean',
    ingredients: [
      '600g ribeye steak, thinly sliced',
      '4 tbsp soy sauce',
      '2 tbsp brown sugar',
      '2 tbsp sesame oil',
      '4 cloves garlic, minced',
      '1 Asian pear, grated',
      '2 spring onions, chopped',
      '1 tbsp toasted sesame seeds',
      'Steamed rice to serve'
    ],
    steps: [
      'Mix soy sauce, brown sugar, sesame oil, and garlic in bowl',
      'Add grated pear and mix well to create marinade',
      'Marinate sliced beef for at least 2 hours or overnight',
      'Heat grill or grill pan over high heat',
      'Cook beef for 2-3 minutes per side until caramelized',
      'Sprinkle with spring onions and sesame seeds',
      'Serve immediately with steamed rice and kimchi'
    ]
  },
  {
    id: '9',
    title: 'French Onion Soup',
    description: 'Rich, comforting soup topped with melted Gruyère cheese',
    image: frenchOnionSoup,
    cookTime: '1 hour',
    servings: 4,
    difficulty: 'Medium',
    category: 'French',
    ingredients: [
      '6 large yellow onions, thinly sliced',
      '4 tbsp butter',
      '2 tbsp olive oil',
      '1 tsp sugar',
      '1 tsp salt',
      '125ml dry white wine',
      '1.5L beef stock',
      '2 bay leaves',
      '200g Gruyère cheese, grated',
      '4 slices baguette'
    ],
    steps: [
      'Heat butter and oil in large pot over medium heat',
      'Add onions, sugar, and salt, cook slowly for 45 minutes',
      'Stir occasionally until onions are deep golden brown',
      'Add wine and scrape up browned bits from bottom',
      'Add beef stock and bay leaves, simmer for 30 minutes',
      'Toast baguette slices and top with Gruyère cheese',
      'Ladle soup into bowls, top with cheese toasts, and broil until bubbly'
    ]
  },
  {
    id: '10',
    title: 'Indian Butter Chicken',
    description: 'Creamy, mildly spiced curry with tender chicken in tomato sauce',
    image: butterChicken,
    cookTime: '45 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Indian',
    ingredients: [
      '800g chicken thighs, cubed',
      '400ml coconut milk',
      '400g canned tomatoes',
      '2 tbsp tomato paste',
      '3 tbsp butter',
      '1 onion, finely chopped',
      '4 cloves garlic, minced',
      '2 tsp garam masala',
      '1 tsp turmeric',
      'Fresh coriander and basmati rice'
    ],
    steps: [
      'Season chicken with salt, pepper, and half the garam masala',
      'Heat butter in large pan and brown chicken pieces',
      'Remove chicken and sauté onions until golden',
      'Add garlic, remaining spices, and tomato paste',
      'Add canned tomatoes and simmer for 15 minutes',
      'Return chicken to pan with coconut milk',
      'Simmer for 20 minutes until chicken is tender, garnish with coriander'
    ]
  }
];
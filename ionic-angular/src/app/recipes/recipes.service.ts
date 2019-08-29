import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFVTEneyRIykCMVgH1bR1HdhMQGvqba5ynmRx4eQGk1UWQO7aM',
      ingredients: ['French fries', 'Pork meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl: 'https://www.maxpixel.net/static/photo/1x/Tomato-Pasta-Cuisine-Italian-Food-Spaghetti-Sauce-1463928.jpg',
      ingredients: ['Spaghetti', 'meat', 'tomatoes']
    }
  ];
  recipesChanged = new Subject<Recipe[]>();

  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {...this.recipes.find(recipe => recipe.id === recipeId)};
  }

  deleteRecipe(recipeId: string) {
    this.recipes = [...this.recipes.filter(recipe => {
      return recipe.id !== recipeId;
    })];
    this.recipesChanged.next(this.recipes);
  }
}

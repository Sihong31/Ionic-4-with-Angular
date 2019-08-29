import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[] = [
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
  constructor() { }

  ngOnInit() {
  }

}

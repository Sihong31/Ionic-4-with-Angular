import { Component, OnInit } from '@angular/core';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[];
  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
    this.recipesService.recipesChanged.subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  ionViewWillEnter() {
    console.log('ion view will enter');
  }

  ionViewDidEnter() {
    console.log('ion view did enter');
  }

  ionViewWillLeave() {
    console.log('vion view will leave');
  }

  ionViewDidLeave() {
    console.log('vion view did leave');
  }

}

import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of central park',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mansion_de_Lopez_%28Lopez_Heritage_House_or_Nelly%27s_Garden%29.jpg/800px-Mansion_de_Lopez_%28Lopez_Heritage_House_or_Nelly%27s_Garden%29.jpg',
      200.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
    ),
    new Place(
      'p2',
      'Disney World',
      'Happiness on earth',
      'https://cdn.pixabay.com/photo/2017/02/14/15/28/walt-disney-world-2066168_960_720.jpg',
      350.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
    ),
    new Place(
      'p3',
      'Fancy Palace',
      'Very fancy place to stay',
      'https://cdn.pixabay.com/photo/2017/06/19/15/47/drottningholm-palace-2419776_960_720.jpg',
      275.50,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(place => place.id === id)};
  }
}

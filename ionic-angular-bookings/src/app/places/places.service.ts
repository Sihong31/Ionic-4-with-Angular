import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  // [
  //   new Place(
  //     'p1',
  //     'Manhattan Mansion',
  //     'In the heart of central park',
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mansion_de_Lopez_%28Lopez_Heritage_House_or_Nelly%27s_Garden%29.jpg/800px-Mansion_de_Lopez_%28Lopez_Heritage_House_or_Nelly%27s_Garden%29.jpg',
  //     200.99,
  //     new Date('2019-01-01'),
  //     new Date('2019-12-31'),
  //     'abc'
  //   ),
  //   new Place(
  //     'p2',
  //     'Disney World',
  //     'Happiness on earth',
  //     'https://cdn.pixabay.com/photo/2017/02/14/15/28/walt-disney-world-2066168_960_720.jpg',
  //     350.99,
  //     new Date('2019-01-01'),
  //     new Date('2019-12-31'),
  //     'efg'
  //   ),
  //   new Place(
  //     'p3',
  //     'Fancy Palace',
  //     'Very fancy place to stay',
  //     'https://cdn.pixabay.com/photo/2017/06/19/15/47/drottningholm-palace-2419776_960_720.jpg',
  //     275.50,
  //     new Date('2019-01-01'),
  //     new Date('2019-12-31'),
  //     'abc'
  //   ),
  // ]

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlaces() {
    return this.http.get<{[key: string]: PlaceData}>('https://ionic-angular-9fe4c.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          // firebase key in resData is the unique ID
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          const transformedPlaces: any = places;
          this._places.next(transformedPlaces);
        })
      );
  }

  getPlace(id: string) {
    return this.http.get(
        `https://ionic-angular-9fe4c.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData: any) => {
          return new Place(id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          'https://cdn.pixabay.com/photo/2017/06/19/15/47/drottningholm-palace-2419776_960_720.jpg',
          price,
          dateFrom,
          dateTo,
          userId,
          location
          );
        return this.http.post<{name: string}>(
          'https://ionic-angular-9fe4c.firebaseio.com/offered-places.json',
          { ...newPlace, id: null }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.getPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(place => place.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location);
        return this.http.put(
          `https://ionic-angular-9fe4c.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null}
        );
      }),
      tap(resData => {
        this._places.next(updatedPlaces);
      })
    );
  }

}

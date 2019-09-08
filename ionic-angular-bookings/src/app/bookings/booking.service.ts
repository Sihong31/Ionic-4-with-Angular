import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date) {
      let generatedId: string;
      let newBooking: Booking;
      return this.authService.userId.pipe(
        take(1),
        switchMap((userId: string) => {
          if (!userId) {
            throw new Error('No user is found!');
          }
          newBooking = new Booking(
            Math.random().toString(),
            placeId,
            userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo);
          return this.http.post<any>(
            'https://ionic-angular-9fe4c.firebaseio.com/bookings.json',
            { ...newBooking, id: null }
          );
        }),
        switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(
      `https://ionic-angular-9fe4c.firebaseio.com/bookings/${bookingId}.json`
    ).pipe(
      switchMap(resData => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    return this.http.get(
      `https://ionic-angular-9fe4c.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    )
    .pipe(
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].guestNumber,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }
}
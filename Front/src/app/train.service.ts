import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppConfig } from './app.config';
import { Observable } from 'rxjs';
import { ISeatsAvailability } from './train';



@Injectable({
  providedIn: 'root'
})
export class TrainService {
  trainDataUrl: string;
  availabilityKey: string;

  constructor(stationsUrl: AppConfig, private http: HttpClient) {
    this.trainDataUrl = stationsUrl.availabilityApiEndpoint;
    this.availabilityKey = stationsUrl.getAvailabilityKey;
  }

  getTrain(origin, destination, date, time, train): Observable<ISeatsAvailability> {

    const headers = new HttpHeaders().set('x-api-key', this.availabilityKey);
    let availabilityResponse;
    availabilityResponse = this.http.get<ISeatsAvailability>(
      this.trainDataUrl, {headers,
      params: new HttpParams()
        .set('origin', origin)
        .set('destination', destination)
        .set('date', date)
        .set('time', time)
        .set('train', train)
      });
    return availabilityResponse;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from './app.config';
import { Observable } from 'rxjs';
import { ITrainsStations } from './station';


@Injectable({
  providedIn: 'root'
})
export class StationService {
  stationListUrl: string;

  constructor(stationsUrl: AppConfig, private http: HttpClient) {
    this.stationListUrl = stationsUrl.stationApiEndpoint;
  }

  getStation(): Observable<ITrainsStations[]> {
    let stationsTXT: Observable<ITrainsStations[]>;
    try {
      stationsTXT = this.http.get<ITrainsStations[]>(this.stationListUrl);
      return stationsTXT;
    } catch (error) {
      console.log('Not a valid Train Station type');
      return null;
    }
  }
}

import { Observable, of } from 'rxjs';
import { ITrainsStations } from './station';

export class MockStationService {
  MOCK_STATION: ITrainsStations[];

  constructor(mockData: ITrainsStations[]) {
    this.MOCK_STATION = mockData;
  }

  getStation(): Observable<ITrainsStations[]> {

    return of(this.MOCK_STATION);
  }
}

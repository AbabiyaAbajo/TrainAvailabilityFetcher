import { ITrainsStations } from './station';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StationService } from './station.service';
import { AppConfig } from './app.config';

describe('StationService', () => {
  let expectedStations: ITrainsStations[];

  let service: StationService;
  let httpMock: HttpTestingController;
  const appConfig: AppConfig = {
    stationApiEndpoint: 'www.abafirsttesting.com',
    availabilityApiEndpoint: 'www.abaGettingTrainData.com',
    getAvailabilityKey: 'abaKey'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StationService,
        { provide: AppConfig, useValue: appConfig },
      ]
    });
    expectedStations = [
      { value: 8300219, label: 'Torino' },
      { value: 8300219, label: 'Turin' },
      { value: 8301700, label: 'Milan' },
      { value: 8301700, label: 'Milano' },
      { value: 8302026, label: 'Bozen' },
      { value: 8308652, label: 'Zagarolo' }
    ];
    service = TestBed.get(StationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  }
  );

  it('should get Valid Stations', () => {
    let stations: ITrainsStations[];
    service.getStation().subscribe(res => {
      stations = res;
      expect(stations).toContain(this.expectedStations);
    });

    const req = httpMock.expectOne(req => req.method === 'GET' && req.url === appConfig.stationApiEndpoint);
    req.flush({
      expectedStations
    });
    httpMock.verify();
    expect(stations).toBeDefined();
  }
  );

  it('should return undefined stations and post error statusText in console', () => {
    let stations: ITrainsStations[];
    service.getStation().subscribe(res => {
      stations = res;
      expect(service).toBeTruthy();
    });

    httpMock.expectOne((req) => req.url === appConfig.stationApiEndpoint)
      .error(new ErrorEvent('Train Error', {
        error: 500
      }), {
        status: 500,
        statusText: 'Internal Server Error'
      });

    httpMock.verify();

    expect(stations).toBeUndefined();
  }
  );

  it('should get undefined response with invalid data', () => {
    const unexpectedStations = [
      { isValid: false, name: 'Ottawa' },
      { isValid: false, name: 'Toronto' },
      { isValid: false, name: 'Montreal' }
    ];
    let stations: ITrainsStations[];
    service.getStation().subscribe(res => {
      stations = res;
    });

    const req = httpMock.expectOne(req => req.method === 'GET' && req.url === appConfig.stationApiEndpoint);
    req.flush({ unexpectedStations });
    httpMock.verify();
    let response: ITrainsStations[];
    service.getStation().subscribe(resp => {
      response = resp;
    });
    expect(response).toBeUndefined();
  }
  );

});

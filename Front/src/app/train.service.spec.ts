import { ISeatsAvailability } from './train';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainService } from './train.service';
import { AppConfig } from './app.config';
import { HttpParams } from '@angular/common/http';

describe('TrainService', () => {

  let service: TrainService;
  let httpMock: HttpTestingController;
  const appConfig: AppConfig = {
    stationApiEndpoint: 'www.abafirsttesting.com',
    availabilityApiEndpoint: 'www.abaGettingTrainData.com',
    getAvailabilityKey: 'AbaKey'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TrainService,
        { provide: AppConfig, useValue: appConfig },
      ]
    });
    service = TestBed.get(TrainService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should get Valid Train info', () => {
    const origin = '8302026';
    const destination = '8302044';
    const date = '12/10/2019, 12:00:00 AM';
    const time = '796';
    const train = '8517';
    const expectedTrains = {
      '0810300ITA': {
        'W': {
          'seats': 0, 'price': 23.9
        },
        'I': {
          'seats': 0, 'price': 17.9
        }
      }
    };

    const params1 = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('date', date)
      .set('time', time)
      .set('train', train);
    let trains: ISeatsAvailability;
    service.getTrain(origin, destination, date, time, train).subscribe(res => {
      trains = res;
    });

    const req = httpMock.expectOne(rq =>
      rq.method === 'GET' &&
      rq.url === appConfig.availabilityApiEndpoint &&
      rq.params.toString() === params1.toString());
    req.flush({ expectedTrains });
    httpMock.verify();
    expect(trains).toBeDefined();
  });

  it('should return undefined availability variable and post error message alert', () => {

    const origin = '';
    const destination = '';
    const date = '';
    const time = '';
    const train = '';

    const params1 = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('date', date)
      .set('time', time)
      .set('train', train);

    let availability: ISeatsAvailability;
    service.getTrain(origin, destination, date, time, train).subscribe(res => {
      availability = res;
      expect(service).toBeTruthy();
    });

    httpMock.expectOne(rq =>
      rq.method === 'GET' &&
      rq.url === appConfig.availabilityApiEndpoint &&
      rq.params.toString() === params1.toString())
      .error(new ErrorEvent('Train Error', {
        error: 500
      }), {
        status: 500,
        statusText: 'Internal Server Error'
      });

    httpMock.verify();

    expect(availability).toBeUndefined();
  }
  );

});

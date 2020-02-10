import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  StationService
} from '../station.service';
import {
  TrainService
} from '../train.service';
import {
  Observable
} from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';
import {
  ITrainRequest,
  TrainStation,
  ITrainsStations
} from './../station';
import {
  ISeatsAvailability
} from './../train';

import { HttpErrorResponse } from '@angular/common/http';

export function RequireStationMatch(control: AbstractControl) {
  const selection: TrainStation = control.value;
  if (typeof selection === 'string') {
    return { incorrect: true };
  }
  return null;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  errorPopUp: boolean;
  popUpDialog: string;
  departureFilteredStations: Observable<ITrainsStations[]>;
  arrivalFilteredStations: Observable<ITrainsStations[]>;
  stations: ITrainsStations[] = null;
  trainRequestsSubmissions: ITrainRequest[] = [];
  displayedColumns: string[] = ['offerCode', 'serviceCode', 'seats', 'price'];
  seatsAvailabilityResponse = [];
  spans = [];
  trainFormGroup: FormGroup;
  timeControl = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return null;
  });
  meridian = true;

  constructor(private fb: FormBuilder, private stationServices: StationService, private trainServices: TrainService) {
    this.createForm();
  }

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.seatsAvailabilityResponse.length;) {
      const currentValue = accessor(this.seatsAvailabilityResponse[i]);
      let count = 1;

      for (let j = i + 1; j < this.seatsAvailabilityResponse.length; j++) {
        if (currentValue !== accessor(this.seatsAvailabilityResponse[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  createForm() {
    this.trainFormGroup = this.fb.group({
      departure_Station: new FormControl('', [Validators.required, RequireStationMatch]),
      arrival_Station: new FormControl('', [Validators.required, RequireStationMatch]),
      departureDate: new FormControl('', [Validators.required]),
      departureTime: this.timeControl,
      train_Number: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    });
  }

  displayFn(train?: ITrainsStations): string | undefined {
    return train ? train.label : undefined;
  }

  ngOnInit() {
    this.stationServices.getStation()
      .subscribe((response: ITrainsStations[]) => {
        this.stations = response.sort((a, b) => {
          if (a.label > b.label) { return 1; }
          if (a.label < b.label) { return -1; }
          return 0;
        });
      }, err => {
        console.log(err);
      });

    if (this.trainFormGroup.get('departure_Station').valueChanges) {
      this.trainFormGroup.get('departure_Station').reset();
      this.departureFilteredStations = this.trainFormGroup.get('departure_Station').valueChanges
      .pipe(
        startWith(''),
        map(value => value ? this._filter(value) : [])
      );
    }

    this.arrivalFilteredStations = this.trainFormGroup.get('arrival_Station').valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value) : [])
        );
  }


  _filter(value: string): ITrainsStations[] {
    if (!this.stations) {
      return null;
    }
    const filterValue = value.toLowerCase();
    return this.stations.filter(station => station.label.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit() {
    if (this.trainFormGroup.valid) {
      this.seatsAvailabilityResponse.length = 0;

      this.trainRequestsSubmissions.push(this.trainFormGroup.value);
      const origin = this.trainFormGroup.get('departure_Station').value.value;
      const departure = this.trainFormGroup.get('arrival_Station').value.value;
      const date = this.trainFormGroup.get('departureDate').value.toLocaleString('en-029');
      const time = (this.trainFormGroup.get('departureTime').value.hour * 60) + (this.trainFormGroup.get('departureTime').value.minute);
      const train = this.trainFormGroup.get('train_Number').value;

      this.trainServices.getTrain(origin, departure, date, time, train).subscribe((resp: ISeatsAvailability) => {
        this.errorPopUp = false;
        const availabilityResponse = Object.entries(resp)
          .map(([key, val]) => ({
            offerCode: key,
            serviceCode: Object.keys(val),
            seats: Object.values(val).map(i => i.seats),
            price:  Object.values(val).map(i => i.price)
          }
          ));
        this.updateTable(availabilityResponse);

      }, (error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
         // client-side error
         this.popUpDialog = `Error: ${error.error.message}`;
        } else {
         // server-side error
         this.popUpDialog = `Error Code: ${error.status}\nMessage: Unable to retrieve data. Verify information submitted.`;
        }
        console.log(this.popUpDialog);
        // window.alert(this.popUpDialog);
        console.log(error);
        this.popUp();
      });
    } else {
      console.log('Unable able to submit form, please review the information to make sure all fields were properly entered');
    }
  }

  updateTable(data) {
    const seatsAvailabilityResponse: any = data;

    const reducedSeatsAvailabilityResponse = seatsAvailabilityResponse.reduce((a, b) => {
      b.serviceCode.forEach((x, i) => {
        a.push({offerCode: b.offerCode, serviceCode: x, seats: b.seats[i], price: b.price[i]});
      });
      return a;
    }, []);
    this.seatsAvailabilityResponse = reducedSeatsAvailabilityResponse;

    // this.cacheSpan('Offer Code', d => d.offerCode);

    this.popUpDialog = null;
  }

  reset() {
    this.trainFormGroup.reset();
    this.seatsAvailabilityResponse.length = 0;
    this.departureFilteredStations = this.trainFormGroup.get('departure_Station').valueChanges
    .pipe(
      startWith(''),
      map(value => value ? this._filter(value) : [])
    );

    this.arrivalFilteredStations = this.trainFormGroup.get('arrival_Station').valueChanges
    .pipe(
      startWith(''),
      map(value => value ? this._filter(value) : [])
    );
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  popUp() {
    // to be used for popUp window (error + loading)
    this.errorPopUp = true;
  }
}

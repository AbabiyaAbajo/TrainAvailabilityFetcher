import { ITrainsStations } from './../station';
import { AppConfig } from './../app.config';
import { MockStationService } from './../mock.station.service';
import { StationService } from './../station.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {

  const MOCK_STATIONS: ITrainsStations[] = [
    { value: 8300219, label: 'Torino' },
    { value: 8300219, label: 'Turin' },
    { value: 8301700, label: 'Milan' },
    { value: 8301700, label: 'Milano' },
    { value: 8302026, label: 'Bozen' },
    { value: 8308652, label: 'Zagarolo' }
  ];
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockService: MockStationService = new MockStationService(MOCK_STATIONS);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        NgbModule
      ],
      declarations: [
        HomeComponent
      ],
      providers: [AppConfig, { provide: StationService, useValue: mockService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid since the form is empty', () => {
    expect(component.trainFormGroup.valid).toBeFalsy();
  });

  it('should be valid submission with all fields completed', () => {
    component.trainFormGroup.controls.departure_Station.setValue(8308652, 'Zagarolo');
    component.trainFormGroup.controls.arrival_Station.setValue(8300147, 'Hone-Bard');
    component.trainFormGroup.controls.departureDate.setValue(new Date('09/16/2019'));
    component.trainFormGroup.controls.departureTime.setValue(13, 30);
    component.trainFormGroup.controls.train_Number.setValue(123456);
    expect(component.trainFormGroup.valid).toBeTruthy();
  });

  it('should be invalid submission since some fields are empty', () => {
    component.trainFormGroup.controls.departure_Station.setValue('', '');
    component.trainFormGroup.controls.arrival_Station.setValue('', '');
    component.trainFormGroup.controls.departureDate.setValue(new Date('09/16/2019'));
    component.trainFormGroup.controls.departureTime.setValue(13, 30);
    component.trainFormGroup.controls.train_Number.setValue(123456);
    expect(component.trainFormGroup.valid).toBeFalsy();
  });

  it('should provide only 1 option when entering Torin and only the valid "Torino" station is returned', () => {
    expect(component._filter('Torin').length).toBe(1);
    expect(component._filter('Torin')).toContain({ value: 8300219, label: 'Torino' });
  });

  it('should not match since Ottawa station does not exist in the list', () => {
    expect(component._filter('Ottaw').length).toBe(0);
  });

  it('should error when the station list recieves invalid data', () => {

    spyOn(mockService, 'getStation').and.returnValue(throwError({ status: 404 }));
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component._filter('Torin')).toBeFalsy();
  });


  it('should return input time 16:52 as being the element time', () => {
    component.trainFormGroup.controls.departureTime.setValue(16, 52);
    expect(component.trainFormGroup.controls.departureTime.value).toBe(16, 52);
  });

});

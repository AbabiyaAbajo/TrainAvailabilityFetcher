import { Time } from '@angular/common';

export class TrainStation {
  public constructor(init?: Partial<TrainStation>) {
    Object.assign(this, init);
  }
}

export interface ITrainRequest {
  departure_Station: ITrainsStations;
  arrival_Station: ITrainsStations;
  departure_date: Date;
  departure_time: Time;
  train_Number: number;
}

// Used for display function - this will avoid having to seperate departure and arrival into seperate codes
export interface ITrainsStations {
  value: number;
  label: string;
}

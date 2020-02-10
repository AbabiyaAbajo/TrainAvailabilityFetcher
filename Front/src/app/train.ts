export interface ISeatsAvailability {
  [offerCode: string]: {
    IOffercodeAvailability;
  };
}

export interface IOffercodeAvailability {
  [serviceCode: string]: {
    IServicecodeAvailability;
  };
}

export interface IServicecodeAvailability {
    seats: number;
    price: number;
}

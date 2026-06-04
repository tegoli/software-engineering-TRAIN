export class SearchCriteria {
    constructor(departureStationName, arrivalStationName, date, time, trainType, travelClass, passengerCount) {
        this.departureStationName = departureStationName;
        this.arrivalStationName = arrivalStationName;
        this.date = date;
        this.time = time;
        this.trainType = trainType;
        this.travelClass = travelClass;
        this.passengerCount = passengerCount;
    }
    validate() { return true; }
}
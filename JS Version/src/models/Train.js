export class Train {
    constructor(trainId, trainCode, trainType, serviceClass) {
        this.trainId = trainId;
        this.trainCode = trainCode;
        this.trainType = trainType;
        this.serviceClass = serviceClass;
    }
    getLiveLocation(trainId) { console.log(`Posizione treno ${trainId}`); }
    getDelayEstimate(trainId) { return 0; }
}
export class Station {
    constructor(stationId, name, city, code) {
        this.stationId = stationId;
        this.name = name;
        this.city = city;
        this.code = code;
    }
    displayBoard(data) { console.log(`Visualizza board della stazione ${this.name}`); }
}
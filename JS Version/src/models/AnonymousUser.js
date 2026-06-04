import { User } from './User.js';

export class AnonymousUser extends User {
    constructor(...args) { super(...args); }
    search(criteria, mapOpt) { console.log('Ricerca anonima', criteria); }
    selectStation(stationName) { console.log(`Stazione selezionata: ${stationName}`); }
    register(name, surname, email, password) { console.log(`Registrazione: ${name} ${surname}`); }
}
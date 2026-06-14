export class Train {
    /** @type {number} */ trainId;
    /** @type {string} */ trainCode;
    /** @type {string} */ trainType; // 'Frecciarossa', 'Intercity', 'Regionale'
    /** @type {string[]} */ serviceClasses;

    getLiveLocation(trainId) {
        // call external API or read from DB
        return { latitude: 45.0, longitude: 9.0 };
    }

    getDelayEstimate(trainId) {
        return Math.floor(Math.random() * 30);
    }
}
export class StationBoard {
    constructor(boardId, boardType, lastUpdate) {
        this.boardId = boardId;
        this.boardType = boardType;
        this.lastUpdate = lastUpdate;
    }
    updateDisplay() { console.log('Board aggiornata'); }
}
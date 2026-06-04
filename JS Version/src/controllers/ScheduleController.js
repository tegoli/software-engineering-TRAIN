export class ScheduleController {
    viewSchedule(inspId) { console.log(`Visualizza turni per ispettore ${inspId}`); }
    getSchedule(inspId) { return []; }
    displaySchedule(inspId) { console.log(`Turni mostrati per ${inspId}`); }
    showNoShift() { console.log('Nessun turno assegnato'); }
    refreshView() { console.log('Vista turni aggiornata'); }
    refresh(inspId) { console.log(`Refresh turni per ${inspId}`); }
}
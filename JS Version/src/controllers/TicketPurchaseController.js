import { readDB, writeDB, createNotification } from '../database/db.js';

/**
 * @const TicketPurchaseController
 * @brief Handles seat map display and ticket purchase logic.
 * @details Manages seat availability, subscription discounts, loyalty points,
 * and extra services like bike and luggage reservations.
 */
export const TicketPurchaseController = {
    /**
     * @brief Returns the seat map for a given train run.
     * @details Gets the train layout and marks which seats are already taken based on reservations.
     * @param {Object} req - Express request with runId as a route parameter.
     * @param {Object} res - Express response object.
     * @return {void}
     */
    getSeatMap(req, res) {
        const runId = parseInt(req.params.runId);
        const db = readDB();
        const run = db.trainRuns.find(r => r.runId === runId);
        if (!run) return res.status(404).json({ error: 'Run not found' });
        const train = db.trains.find(t => t.trainId === run.trainId);
        if (!train) return res.status(404).json({ error: 'Train not found' });

        const reservations = db.seatReservations.filter(sr => sr.runId === runId);
        const takenSeats = new Set(reservations.map(sr => sr.seatNumber));

        const coaches = [];
        if (train.coaches && train.coaches.length) {
            for (const coach of train.coaches) {
                const totalSeats = coach.totalSeats || 60;
                const seatsPerRow = 6;
                const rows = Math.ceil(totalSeats / seatsPerRow);
                const seats = [];
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                for (let row = 1; row <= rows; row++) {
                    for (let i = 0; i < seatsPerRow; i++) {
                        if (seats.length >= totalSeats) break;
                        const seatNumber = `${row}${letters[i]}`;
                        const status = takenSeats.has(seatNumber) ? 'taken' : 'free';
                        seats.push({ seatNumber, status });
                    }
                }
                coaches.push({ coachNumber: coach.coachNumber, coachClass: coach.coachClass || 'standard', seats });
            }
        } else {
            const totalSeats = 60;
            const seatsPerRow = 6;
            const rows = Math.ceil(totalSeats / seatsPerRow);
            const seats = [];
            const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            for (let row = 1; row <= rows; row++) {
                for (let i = 0; i < seatsPerRow; i++) {
                    if (seats.length >= totalSeats) break;
                    const seatNumber = `${row}${letters[i]}`;
                    const status = takenSeats.has(seatNumber) ? 'taken' : 'free';
                    seats.push({ seatNumber, status });
                }
            }
            coaches.push({ coachNumber: 1, coachClass: 'standard', seats });
        }
        res.json({ runId, coaches });
    },

    /**
     * @brief Buys one or more tickets for a train run.
     * @details Checks for active subscriptions to apply a discount, calculates
     * extra costs for bike and luggage, applies loyalty points, reserves seats,
     * and creates payment records.
     * @param {Object} req - Express request with runId, passengers, extras, usedPoints etc.
     * @param {Object} res - Express response object.
     * @return {Object|void} 400 or 409 on error, otherwise the purchase details.
     */
    purchase(req, res) {
        const { runId, passengers, extras, usedPoints = 0, bikeCount = 0, luggageCount = 0, luggageSize = 'small' } = req.body;
        const userId = req.user.userId;
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user) return res.status(400).json({ success: false, message: 'Utente non valido' });
    
        // Recupera abbonamenti attivi dell'utente (data odierna compresa)
        const today = new Date();
        const activeSubscriptions = db.subscriptions.filter(s => 
            s.userId === userId && 
            s.status === 'active' && 
            new Date(s.endDate) >= today
        );
    
        // Calcola il prezzo base totale considerando gli sconti abbonamento
        let totalBasePrice = 0;
        const passengersWithDiscount = [];
        let subscriberDiscountApplied = false;
    
        for (let idx = 0; idx < passengers.length; idx++) {
            const passenger = passengers[idx];
            let ticketPrice = passenger.price;
            
            // Solo per il primo passeggero (l'abbonato) verifichiamo se ha un abbonamento per la tratta
            if (idx === 0 && !subscriberDiscountApplied) {
                const matchingSub = activeSubscriptions.find(sub => {
                    const route = db.routes.find(r => r.routeId === sub.routeId);
                    if (!route) return false;
                    const fromStation = db.stations.find(s => s.stationId === route.stops[0].stationId);
                    const toStation = db.stations.find(s => s.stationId === route.stops[route.stops.length-1].stationId);
                    return fromStation?.name.toLowerCase() === passenger.fromStation?.toLowerCase() &&
                           toStation?.name.toLowerCase() === passenger.toStation?.toLowerCase();
                });
                if (matchingSub) {
                    ticketPrice = 0;
                    subscriberDiscountApplied = true;
                    // Opzionale: registra l'utilizzo dell'abbonamento (puoi aggiungere un campo usedCount)
                }
            }
            
            totalBasePrice += ticketPrice;
            passengersWithDiscount.push({ ...passenger, effectivePrice: ticketPrice });
        }
    
        // Calcola extra (bici, bagagli) – questi NON sono scontati dall'abbonamento
        let bikePrice = 5;
        let luggagePrice = luggageSize === 'small' ? 5 : (luggageSize === 'medium' ? 8 : 12);
        totalBasePrice += (bikeCount * bikePrice * passengers.length) + (luggageCount * luggagePrice * passengers.length);
    
        // Applica punti fedeltà (sconto standard)
        let pointsToUse = Math.min(usedPoints, user.loyaltyPoints || 0);
        if (pointsToUse < 0) pointsToUse = 0;
        const discount = pointsToUse * 0.10;
        const finalPrice = Math.max(0, totalBasePrice - discount);
        const pointsEarned = (pointsToUse === 0) ? Math.floor(finalPrice) : 0;
        user.loyaltyPoints = user.loyaltyPoints - pointsToUse + pointsEarned;
    
        const now = new Date().toISOString();
        const ticketsCreated = [];
        let remainingDiscount = discount;
    
        for (let idx = 0; idx < passengers.length; idx++) {
            const passenger = passengers[idx];
            let ticketPrice = passengersWithDiscount[idx].effectivePrice;
            // Applica eventuale sconto residuo dai punti fedeltà
            if (remainingDiscount > 0 && ticketPrice > 0) {
                const disc = Math.min(remainingDiscount, ticketPrice);
                ticketPrice -= disc;
                remainingDiscount -= disc;
            }
            // Controllo disponibilità posto
            const existing = db.seatReservations.find(sr => sr.runId === runId && sr.seatNumber === passenger.seatNumber);
            if (existing && existing.status !== 'free') {
                return res.status(409).json({ success: false, message: `Posto ${passenger.seatNumber} occupato` });
            }
            const newTicketId = Math.max(...db.tickets.map(t => t.ticketId), 0) + 1;
            const newTicket = {
                ticketId: newTicketId, ticketCode: `TKT-${userId}-${newTicketId}`, userId, runId,
                fromStopOrder: passenger.fromStopOrder || 1, toStopOrder: passenger.toStopOrder || 4,
                passengerType: passenger.passengerType || 'adult', seatNumber: passenger.seatNumber,
                class: passenger.travelClass || 'standard', price: ticketPrice, status: 'active',
                purchaseDate: now, qrCode: `QR${newTicketId}${Math.random().toString(36).substring(2,8)}`
            };
            db.tickets.push(newTicket);
            ticketsCreated.push(newTicketId);
            // Registra pagamento (anche se prezzo 0)
            const newPaymentId = Math.max(...db.payments.map(p => p.paymentId), 0) + 1;
            db.payments.push({ paymentId: newPaymentId, userId, ticketId: newTicketId, amount: ticketPrice, paymentDate: now, paymentMethod: 'Simulated', status: 'completed' });
            db.seatReservations.push({ runId, coachNumber: 1, seatNumber: passenger.seatNumber, ticketId: newTicketId, status: 'reserved' });
        }
    
        // Registra transazioni punti fedeltà
        const transId = Math.max(...db.loyaltyTransactions.map(l => l.transactionId), 0) + 1;
        if (pointsToUse > 0) {
            db.loyaltyTransactions.push({ transactionId: transId, userId, points: -pointsToUse, reason: `Utilizzo ${pointsToUse} punti per sconto`, date: now });
        }
        if (pointsEarned > 0) {
            db.loyaltyTransactions.push({ transactionId: transId + 1, userId, points: pointsEarned, reason: `Acquisto biglietti #${ticketsCreated.join(',')}`, date: now });
        }
    
        // Extra (bagagli, bici)
        if (extras && extras.length && ticketsCreated.length) {
            for (const extra of extras) {
                const newResId = Math.max(...db.additionalReservations.map(r => r.reservationId), 0) + 1;
                db.additionalReservations.push({ reservationId: newResId, ticketId: ticketsCreated[0], type: extra.type, status: 'confirmed', price: extra.price });
            }
        }
    
        createNotification(userId, `Acquisto riuscito per ${passengers.length} biglietto/i (ID: ${ticketsCreated.join(', ')})`, 'purchase_confirmation');
        writeDB(db);
        res.json({ success: true, tickets: ticketsCreated, discountApplied: discount, usedPoints: pointsToUse, finalPrice, subscriptionUsed: subscriberDiscountApplied });
    }
};
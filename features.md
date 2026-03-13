# 🚆 Sistema Ferroviario — Features

---

## 👤 Utente

### 🎫 Biglietti & Abbonamenti
- **Acquisto biglietto** con supporto ML per la previsione dei ritardi
- **Acquisto abbonamenti** (mensili, annuali, ecc.)
- **Modifica biglietto** (con limitazioni)
  - Possibilità di cambio estesa in caso di ritardi significativi

### 🗺️ Pianificazione Viaggio
- **Ricerca treni con filtri intelligenti** (algoritmo Dijkstra):
  - 🕐 Treno più veloce
  - 💰 Treno più economico
  - ✅ Minore probabilità di ritardo
  - 👥 Solitamente meno affollato
- **Visualizzazione tabellone** arrivi/partenze per stazione o treno selezionato
- **Scelta del posto** nel vagone
- **Scelta della classe** (es. Prima / Seconda)

### 🧳 Servizi Aggiuntivi
- **Prenotazione parcheggio auto** in stazione
- **Prenotazione deposito valigie**
- **Posto valigia prenotabile** (es. bici pieghevole trattata come bagaglio)
- **Prenotazione posto nel vagone bici**
  - Riservato a bici non pieghevoli
  - Numero limitato di posti (tipicamente ~7 per vagone dedicato)
  - Soggetto a costo aggiuntivo

### 👨‍👩‍👧 Compagni di Viaggio
- **Aggiunta compagni di viaggio** (utenti registrati o salvati)
- Possibilità di acquistare biglietti per conto di compagni salvati

### 📋 Storico & Fedeltà
- **Storico prenotazioni**
- **Visualizzazione abbonamenti attivi**
- **Raccolta e gestione punti fedeltà**

---

## 🛠️ Amministratore

### 🚉 Gestione Corse
- **Cancellazione treni**
- **Aggiunta corse straordinarie / extra**

### 📊 Insights & Analytics
- Guadagno per tratta / corsa
- Numero prenotazioni
- Tratte più frequenti
- Monitoraggio attività degli impiegati

### 🔧 Logistica
- Controllo collisioni tra treni
- Verifica sovrapposizioni: numero di treni attivi ≤ numero di binari disponibili

---

## 🎫 Controllore

### ✅ Validazione
- **Validazione biglietti** (QR code, NFC, ecc.)
- **Validazione abbonamenti**

### 📅 Turni
- **Visualizzazione della propria turnistica**

### 📈 Monitoraggio Capienza
- **Marcatura posti occupati** nel vagone
  - Fornisce dati di insight sulla capienza reale del treno

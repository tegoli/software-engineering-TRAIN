CREATE DATABASE IF NOT EXISTS ferrovia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ferrovia;

-- 1. Entità di base
CREATE TABLE regione (
    region_id          INT AUTO_INCREMENT PRIMARY KEY,
    nome_regione       VARCHAR(100) NOT NULL
);

CREATE TABLE station (
    station_id         INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(150) NOT NULL,
    numero_binari      INT NOT NULL DEFAULT 0,
    binari_disponibili INT NOT NULL DEFAULT 0,
    region_id          INT NOT NULL,
    
    FOREIGN KEY (region_id) REFERENCES regione(region_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE tratta (
    tratta_id          INT AUTO_INCREMENT PRIMARY KEY,
    staz_partenza_id   INT NOT NULL,
    staz_arrivo_id     INT NOT NULL,
    
    FOREIGN KEY (staz_partenza_id) REFERENCES station(station_id),
    FOREIGN KEY (staz_arrivo_id)   REFERENCES station(station_id),
    
    INDEX idx_tratta_partenza (staz_partenza_id),
    INDEX idx_tratta_arrivo   (staz_arrivo_id)
);

CREATE TABLE associations (
    station_id         INT NOT NULL,
    tratta_id          INT NOT NULL,
    
    PRIMARY KEY (station_id, tratta_id),
    FOREIGN KEY (station_id) REFERENCES station(station_id) ON DELETE CASCADE,
    FOREIGN KEY (tratta_id)  REFERENCES tratta(tratta_id)   ON DELETE CASCADE
);

CREATE TABLE capotreno (
    employee_id        INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(50)  NOT NULL,
    cognome            VARCHAR(50)  NOT NULL,
    salario            DECIMAL(10,2) NOT NULL,
    scartamento        VARCHAR(30),
    numero_vagoni      INT
);

CREATE TABLE treno (
    tren_id            INT AUTO_INCREMENT PRIMARY KEY,
    tipologia          VARCHAR(50) NOT NULL,
    capienza           INT NOT NULL,
    post_disponibili   INT NOT NULL DEFAULT 0,
    scartamento        VARCHAR(30),
    numero_vagoni      INT,
    
    capotreno_id       INT UNIQUE NOT NULL,   -- 1:1 ottimizzata
    
    FOREIGN KEY (capotreno_id) REFERENCES capotreno(employee_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE corsa (
    corsa_id           INT AUTO_INCREMENT PRIMARY KEY,
    tratta_id          INT NOT NULL,
    tren_id            INT NOT NULL,
    stazione_attuale_id INT NOT NULL,
    
    FOREIGN KEY (tratta_id)          REFERENCES tratta(tratta_id),
    FOREIGN KEY (tren_id)            REFERENCES treno(tren_id),
    FOREIGN KEY (stazione_attuale_id) REFERENCES station(station_id)
);

CREATE TABLE utente (
    user_id            INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(50)  NOT NULL,
    cognome            VARCHAR(50)  NOT NULL,
    data_di_nascita    DATE NOT NULL,
    work_region_id     INT,
    living_region_id   INT,
    abbonamento_id     INT UNIQUE,          -- 0..1
    
    FOREIGN KEY (work_region_id)   REFERENCES regione(region_id),
    FOREIGN KEY (living_region_id) REFERENCES regione(region_id)
);

CREATE TABLE biglietto (
    biglietto_id       INT AUTO_INCREMENT PRIMARY KEY,
    utente_id          INT NOT NULL,
    tratta_id          INT NOT NULL,
    classe             VARCHAR(20) NOT NULL DEFAULT 'standard',
    
    FOREIGN KEY (utente_id) REFERENCES utente(user_id),
    FOREIGN KEY (tratta_id) REFERENCES tratta(tratta_id)
);

CREATE TABLE abbonamento (
    abbonamento_id     INT AUTO_INCREMENT PRIMARY KEY,
    zona_id            INT NOT NULL,           -- codice zona (es. 1,2,3...)
    
    FOREIGN KEY (abbonamento_id) REFERENCES utente(abbonamento_id) -- legame 1:1
);

CREATE TABLE validita_abbonamento (
    abbonamento_id     INT NOT NULL,
    zona_id            INT NOT NULL,
    
    PRIMARY KEY (abbonamento_id, zona_id),
    FOREIGN KEY (abbonamento_id) REFERENCES abbonamento(abbonamento_id) ON DELETE CASCADE
);


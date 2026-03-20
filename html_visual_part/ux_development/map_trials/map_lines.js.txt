// ============================================================
//  map_lines.js  –  Linee ferroviarie da Overpass API (OSM)
//  Carica i tracciati reali al momento dell'apertura della mappa
// ============================================================

(function () {

  // Bounding box: copre Nord Italia + Toscana/Emilia/Liguria
  // min_lat, min_lon, max_lat, max_lon
  var BBOX = '43.4,6.4,47.1,14.0';

  // Query Overpass QL: tutti i tratti di ferrovia principale nell'area
  var query = `
[out:json][timeout:60];
(
  way["railway"="rail"](${BBOX});
  way["railway"="narrow_gauge"](${BBOX});
  way["railway"="light_rail"](${BBOX});
  way["railway"="tram"](${BBOX});
);
out geom;
`.trim();

  // Stili per tipo di linea
  var stili = {
    rail:          { color: '#c0392b', weight: 2,   opacity: 0.85 },
    narrow_gauge:  { color: '#8e44ad', weight: 1.8, opacity: 0.85 },
    light_rail:    { color: '#2980b9', weight: 1.8, opacity: 0.85 },
    tram:          { color: '#27ae60', weight: 1.5, opacity: 0.80 },
    default:       { color: '#7f8c8d', weight: 1.5, opacity: 0.75 }
  };

  // Layer group separato così possiamo gestirlo in futuro
  var linesLayer = L.layerGroup().addTo(map);

  // Aggiorno il pannello di stato
  var panel = document.getElementById('station-count');
  var stationText = panel ? panel.innerHTML : '';
  if (panel) panel.innerHTML = stationText + ' &nbsp;|&nbsp; ⏳ Caricamento linee...';

  // Chiamata all'API Overpass
  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query)
  })
  .then(function (resp) {
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.json();
  })
  .then(function (data) {
    var contatore = 0;

    data.elements.forEach(function (el) {
      if (el.type !== 'way' || !el.geometry) return;

      var tipo  = (el.tags && el.tags.railway) || 'default';
      var stile = stili[tipo] || stili.default;

      // Geometry restituita da Overpass: array di {lat, lon}
      var latlngs = el.geometry.map(function (pt) {
        return [pt.lat, pt.lon];
      });

      if (latlngs.length < 2) return;

      var nome = (el.tags && (el.tags.name || el.tags['name:it'])) || '';

      var polyline = L.polyline(latlngs, {
        color:   stile.color,
        weight:  stile.weight,
        opacity: stile.opacity
      });

      if (nome) {
        polyline.bindTooltip(nome, { sticky: true, direction: 'top' });
      }

      polyline.addTo(linesLayer);
      contatore++;
    });

    // Aggiorno pannello
    if (panel) {
      panel.innerHTML = stationText +
        ' &nbsp;|&nbsp; 🛤️ Linee: ' + contatore;
    }

    // Aggiorno leggenda
    aggiornaLeggenda();
  })
  .catch(function (err) {
    console.error('Errore caricamento linee Overpass:', err);
    if (panel) {
      panel.innerHTML = stationText +
        ' &nbsp;|&nbsp; ⚠️ Linee non caricate (Overpass non raggiungibile)';
    }
  });

  // ---- Leggenda dinamica ----
  function aggiornaLeggenda() {
    var leg = document.getElementById('legend');
    if (!leg) return;

    var voci = [
      { tipo: 'rail',         colore: stili.rail.color,         etichetta: 'Ferrovia principale (RFI)' },
      { tipo: 'narrow_gauge', colore: stili.narrow_gauge.color, etichetta: 'Ferrovia a scartamento ridotto' },
      { tipo: 'light_rail',   colore: stili.light_rail.color,   etichetta: 'Metropolitana / Light rail' },
      { tipo: 'tram',         colore: stili.tram.color,         etichetta: 'Tranvia' },
    ];

    var html = '<h4>🚂 Linee Ferroviarie</h4>';
    voci.forEach(function (v) {
      html += '<div class="legend-item">' +
        '<div class="legend-color" style="background:' + v.colore + '; height:3px; margin-top:8px;"></div>' +
        ' ' + v.etichetta +
        '</div>';
    });

    html += '<hr>';
    html += '<div class="legend-item">' +
      '<div style="width:12px;height:12px;border-radius:50%;background:#3388ff;' +
      'border:1.5px solid #0066cc;margin-right:8px;flex-shrink:0;"></div>' +
      'Stazione</div>';

    leg.innerHTML = html;
  }

})();

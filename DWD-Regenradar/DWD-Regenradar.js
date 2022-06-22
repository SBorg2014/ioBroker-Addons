/* DWD-Regenradar by SBorg
   holt die aktuelle Übersicht vom Deutschen Wetterdienst und Foreca

  V0.2.0 / 15.06.2022 - + GPS-Koordinaten aus Systemkonfig lesen
  V0.1.0 / 16.01.2022 - + Foreca-Regenradar hinzugefügt
                        ~ Codeoptimierungen
  V0.0.3 / 10.01.2022 - + Satellitenradar hinzugefügt
  V0.0.2 / 09.01.2022 - ~ Schreibzugriff auf die Datenpunkte entfernt
  V0.0.1 / 01.01.2022 - erste Version


  Codierung für Bundesländer (lt. Sortierung des DWD):
    0 = Baden-Württemberg
    1 = Bayern
    2 = Brandenburg und Berlin
    3 = Hessen
    4 = Mecklenburg-Vorpommern
    5 = Niedersachsen und Bremen
    6 = Nordrhein-Westfalen 
    7 = Rheinland-Pfalz und Saarland
    8 = Sachsen
    9 = Sachsen-Anhalt
   10 = Schleswig-Holstein und Hamburg
   11 = Thüringen
*/

// Usereinstellungen
const BuLand = 3;                               // für welches Bundesland?
const SatRadar = true;                          // [true/false] Bilder für Satellitenradar laden?
const Foreca = true;                            // [true/false] Bilder von Foreca laden? Falls true --> Foreca_GPS konfigurieren!
let Foreca_GPS = "SYSTEM";                      /* GPS-Koordinaten für die das Bild geladen werden soll.
                                                   Default: [SYSTEM] / =aus den Systemeinstellungen
                                                   oder Ermittlung zB. unter https://www.laengengrad-breitengrad.de
                                                   Achtung: Eingabe dann als "Breitengrad/Längengrad" [x.xx/y.yy]
                                                   2 Nachkommastellen genügen idR.  */
const DP = "0_userdata.0.Wetter.RegenRadar.";   // wo sollen die Daten angelegt werden?
const Zeitplan = "*/10 * * * *";                // wann sollen die Daten geholt werden (cron-Syntax)?


// ab hier gibt es nichts mehr zu ändern-------------------------------------------------------
 // Abkürzung lt. URL
 let url_arr = ["baw", "bay", "bbb", "hes", "mvp", "nib", "nrw", "rps", "sac", "saa", "shh", "thu"];

 // Anzeigename des Bundeslandes
 let BuLa_arr = ["Baden_Wuerttemberg", "Bayern", "Brandenburg_Berlin", "Hessen", "Mecklenburg_Vorpommern", 
                 "Niedersachsen_Bremen", "NRW", "Rheinland_Pfalz_Saarland", "Sachsen", "Sachsen_Anhalt",
                 "Schleswig_Holstein_Hamburg", "Thueringen"];

const axios = require('axios'); 
if (Foreca_GPS=="SYSTEM") { let GPS = getObject("system.config"), lat = GPS.common.latitude, long = GPS.common.longitude;
    Foreca_GPS=long+"/"+lat; }
const url_jpg = 'https://www.dwd.de/DWD/wetter/radar/rad_' + url_arr[BuLand] + '_akt.jpg';
const url_gif = 'https://www.dwd.de/DWD/wetter/radar/radfilm_' + url_arr[BuLand] + '_akt.gif';
const url_sat = 'https://www.dwd.de/DWD/wetter/sat/satwetter/njob_satrad.png';
const url_foreca = 'https://map-cf.foreca.net/teaser/map/green/radar/7/' + Foreca_GPS + '/336/400.png?units=mm';
const idDp = DP + BuLa_arr[BuLand];
const idDp_Film = DP + BuLa_arr[BuLand] + '_Film';
const idDp_SatRadar = DP + 'SatRadar';
const idDp_Foreca = DP + 'Foreca';


makeDataPoints();                             // check ob DPs existieren
setTimeout(function() { getData(); }, 10000); // initial 10 Sekunden nach Skriptstart einmalig Daten holen  
schedule(Zeitplan, getDaten);


function getDaten() {
    let warte = Math.floor(Math.random() * 60000); // random bis zu 60 Sekunden Verzögerung
    setTimeout(function() { getData(); }, warte);
}

function loadData(url_Bild, DatenPunkt) {
    let buffer;
    axios
        .get(url_Bild, {
          responseType: 'arraybuffer'
        })
    .then(response => {
        buffer = "data:" + response.headers['content-type'] + ";base64, " + Buffer.from(response.data, 'binary').toString('base64');
        setState(DatenPunkt, buffer, true);
    })
    .catch(ex => {
        log("Fehler bei " + url_Bild + " : " + ex,"warn");
    });
}

function getData() {
    loadData(url_jpg, idDp);
    loadData(url_gif, idDp_Film);
    if ( SatRadar ) { loadData(url_sat, idDp_SatRadar); }
    if ( Foreca )   { loadData(url_foreca, idDp_Foreca); }
}

function makeDataPoints() {
    if (!existsState(idDp)) { createState(idDp, "", {name: "Regenradar für " + BuLa_arr[BuLand] , type: "mixed", role: "state", read: true, write: false}); }
    if (!existsState(idDp_Film)) { createState(idDp_Film, "", {name: "Regenradar für " + BuLa_arr[BuLand], type: "mixed", role: "state", read: true, write: false}); } 
    if (SatRadar) { if (!existsState(idDp_SatRadar)) { createState(idDp_SatRadar, "", {name: "Satellitenbild", type: "mixed", role: "state", read: true, write: false}); } }
    if (Foreca) { if (!existsState(idDp_Foreca)) { createState(idDp_Foreca, "", {name: "Regenradarbild", type: "mixed", role: "state", read: true, write: false}); } }
}
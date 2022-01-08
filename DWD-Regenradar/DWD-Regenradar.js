/* DWD-Regenradar
   holt die aktuelle Übersicht vom Deutschen Wetterdienst

 (SBorg) V0.0.1 / 01.01.2022 - erste Version


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
const url_jpg = 'https://www.dwd.de/DWD/wetter/radar/rad_' + url_arr[BuLand] + '_akt.jpg';
const url_gif = 'https://www.dwd.de/DWD/wetter/radar/radfilm_' + url_arr[BuLand] + '_akt.gif';
const idDp = DP + BuLa_arr[BuLand];
const idDp_Film = DP + BuLa_arr[BuLand] + '_Film';


makeDataPoints();                             // check ob DPs existieren
setTimeout(function() { getData(); }, 10000); // initial 10 Sekunden nach Skriptstart einmalig Daten holen  
schedule(Zeitplan, getDaten);


function getDaten() {
    let warte = Math.floor(Math.random() * 60000); // random bis zu 60 Sekunden Verzögerung
    setTimeout(function() { getData(); }, warte);
}

function getData() {
    let buffer, buffer_gif;
    axios
        .get(url_jpg, {
          responseType: 'arraybuffer'
        })
    .then(response => {
        buffer = "data:" + response.headers['content-type'] + ";base64, " + Buffer.from(response.data, 'binary').toString('base64');
        setState(idDp, buffer, true);
    })
    .catch(ex => {
        log("Fehler bei JPG: " + ex,"warn");
    });


    axios
        .get(url_gif, {
          responseType: 'arraybuffer'
        })
    .then(response => {
        buffer_gif = "data:" + response.headers['content-type'] + ";base64, " + Buffer.from(response.data, 'binary').toString('base64');
        setState(idDp_Film, buffer_gif, true);
    })
    .catch(ex => {
        log("Fehler bei Film: " + ex,"warn");
    });
}

function makeDataPoints() {
    if (!existsState(idDp)) { createState(idDp, "", {name: "Regenradar für " + BuLa_arr[BuLand] , type: "mixed", role: "state"}); }
    if (!existsState(idDp_Film)) { createState(idDp_Film, "", {name: "Regenradar für " + BuLa_arr[BuLand], type: "mixed", role: "state"}); } 
}
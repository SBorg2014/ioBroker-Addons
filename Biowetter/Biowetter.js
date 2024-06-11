/* Biowetter Parser von gesundheit.de

http://forum.iobroker.net/viewtopic.php?f=23&t=2799&sid=936235bdac98a70a1d8672897d334a07#p25266

05.05.2016 erstellt von steinwedel f�r homoran
06.05.2016 Anpassung durch pix (Vorhersage mehrere Tage)

�nderung in Biowetterparser
12.01.2017 Biowetter
14.01.2017 vom Pollenflug Skript separiert
10.06.2019 neue Quellseite www.gesundheit.de (Anpassung von pix)
21.12.2021 (SBorg) Anpassungen an neuen HTML-Auftritt, Fehlerbeseitigung, request => axios, ack=true
11.07.2022 (SBorg) Anpassungen an neuen HTML-Auftritt
11.06.2024 (SBorg) Anpassung an JS 6.x und Umstellung von "axios" => "httpGet"

*/

const pfad = "0_userdata.0.Wetter.Biowetter.";
const logging = false;

// St�dte k�nnen nat�rlich auch gel�scht werden
const stadt = [
    // Hessen     
    { "URL_" : "frankfurt-am-main",
      "name" : "Frankfurt am Main" }
];

 
// ab hier nix mehr �ndern
const biowetter_url = "https://www.gesundheit.de/rat-hilfe/biowetter/";
const biodatenpunkte = ["heute", "morgen", "Kombi"];

 
function bioDpAnlegen() {
    // alle St�dte durchgehen
    stadt.forEach(function(city) {
        let bio_pfad = pfad + city.name.toLowerCase();
        setTimeout(function() {
            for (var bdp = 0; bdp < biodatenpunkte.length; bdp++) {
                createState(bio_pfad + "." + biodatenpunkte[bdp], {
                    def: "",
                    name: "Biowetter " + city.name + " " + biodatenpunkte[bdp],
                    desc: "Biowetter Vorhersage (gesundheit.de) f�r " + biodatenpunkte[bdp] + " in " + city.name,
                    type: "string"
                });
            }
        }, 1000);
    });
}
 
function readBiowetter() {
    stadt.forEach(function(s) {
        setTimeout(function() {
            if (logging) log("Es wird abgefragt: " + s.URL_ + " f�r " + s.name);
            readURL(s.URL_, s.name);
        }, 1000);
    });
}
 
function readURL(stadt_URL_, stadt_name) {
    try {
        const options = {
            method: 'get',
            url: biowetter_url + stadt_URL_, // korrekten Link erstellen
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1" }
        };
        
        httpGet(options.url, (err, response) => { 
            if (response.statusCode == 200) { // kein Fehler, Inhalt in body
                /* betroffener HTML Code
                            <h2>Heute</h2>
                            <p>Die aktuelle Wetterlage belastet Herz und Kreislauf st�rker als sonst �blich. Aufgrund der warmen Luftmasse ist die Durchblutung vermindert. Viele Menschen f�hlen sich weiterhin m�de und abgespannt. Trotzdem f�llt der erholsame Tiefschlaf schwer. Menschen, die verst�rkt mit Kopfschmerzen und Migr�neattacken auf Wetterreize reagieren, sollten ihre Schmerzmittel nicht vergessen. Anstrengungen am Mittag und Nachmittag sollten vermieden werden.</p>
                            <h2>Morgen</h2>
                            <p>Mit der Witterung sind h�ufig Leistungs- und Konzentrationsdefizite verbunden. Auch das Reaktionsverm�gen l�sst nach, sodass die Unfallgefahr zunimmt. Wetterf�hlige Menschen klagen vor allem �ber Kopfweh und eine erh�hte M�digkeit.</p>

                            <div class="
                     */

                // Code f�r HEUTE extrahieren
 
                let wetter_heute;
                let heute_start = "<h3>Heute</h3>";
                let heute_ende = "<h3>Morgen</h3>"; // dazwischen ist Text f�r heute
 
                let pos_heute_start = response.data.indexOf(heute_start);
                let pos_heute_ende = response.data.indexOf(heute_ende);
                log("Start: " + pos_heute_start + " Ende: " + pos_heute_ende, "debug");
 
                if (pos_heute_start != -1 && pos_heute_ende != -1) { // wenn gesuchte Strings �berhaupt existieren
                    let heute_bereich = response.data.substring(pos_heute_start + heute_start.length, response.data.length); // Ab aber ohne ersten Treffer bis Ende
                    heute_bereich = heute_bereich.substring(0, heute_bereich.indexOf(heute_ende)); // Suchwort am Ende abschneiden
                    wetter_heute = strip_tags(heute_bereich).trim(); // fertige Ausgabe
                    if (logging) log("Biowetter in " + stadt_name + " (heute): " + wetter_heute);
                    setState(pfad + stadt_name.toLowerCase() + ".heute", wetter_heute, true);
                } else log("gesuchter Quellcode (www.gesundheit.de) nicht gefunden | Stichwort 'heute'", "error");
 
                // Code f�r MORGEN extrahieren
                let wetter_morgen;
                let morgen_start = "<h3>Morgen</h3>";
                let morgen_ende = "<div class="; // dazwischen ist Text f�r morgen 
                let pos_morgen_start = response.data.indexOf(morgen_start);
                let pos_morgen_ende = response.data.indexOf(morgen_ende);
                log("Start: " + pos_morgen_start + " Ende: " + pos_morgen_ende, "debug");
 
                if (pos_morgen_start != -1 && pos_morgen_ende != -1) { // wenn gesuchte Strings �berhaupt existieren
                    let morgen_bereich = response.data.substring(pos_morgen_start + morgen_start.length, response.data.length); // Ab aber ohne ersten Treffer bis Ende
                    morgen_bereich = morgen_bereich.substring(0, morgen_bereich.indexOf(morgen_ende)); // Suchwort am Ende abschneiden
                    wetter_morgen = strip_tags(morgen_bereich).trim(); // fertige Ausgabe
                    if (logging) log("Biowetter in " + stadt_name + " (morgen): " + wetter_morgen);
                    setState(pfad + stadt_name.toLowerCase() + ".morgen", wetter_morgen, true);
                } else log("gesuchter Quellcode (www.gesundheit.de) nicht gefunden | Stichwort 'morgen'", "error");
 
                // Code f�r Kombidatenpunkt mit HTML
                if (!wetter_morgen || !wetter_heute) log("Fehler: keine Biowetterdaten extrahiert", "error");
                else {
                    let kombi = "<div class =\"Biowetter\">" +
                        "<h4>Biowetter (gesundheit.de) f�r " + stadt_name + "</h4>" +
                        "<h2>Heute</h2>" +
                        "<p>" + wetter_heute + "</p>" +
                        "<h2>Morgen</h2>" +
                        "<p>" + wetter_morgen + "</p></div>";
                    setState(pfad + stadt_name.toLowerCase() + "." + biodatenpunkte[2], kombi, true);
                }
            } else {
                log("StatusCode = " + response.statusCode);
            }
        });
    } catch (e) {
        log("Fehler (try) leseWebseite (gesundheit.de): " + e, "error");
    }
    log("Biowetter eingelesen", "info");
}
 
function strip_tags(data) {
    var rueckgabe = data.replace(/(&nbsp;|<([^>]+)>)/ig, " ");
    return (rueckgabe);
}
 
String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/([.*+?^=!:${}()|[]\/])/g, "\\$1"), "g"), replace);
};
 
function main() {
    bioDpAnlegen();
    setTimeout(readBiowetter, 3000);
}
 
main();
schedule("6 6 * * *", main);
 

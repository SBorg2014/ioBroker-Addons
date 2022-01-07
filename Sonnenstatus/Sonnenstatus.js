/* V0.0.5 vom 01.07.2019
   berechnet die Tageslänge und die Differenz zum Vortag, Tag des Jahres, die Kalenderwoche,
   Länge der Nacht, aktuelles Datum als DP (TT.MM.JJJJ)

 V0.0.5 - ~ doppeltes Minuszeichen bei abnehmender Tageslänge gefixt
 V0.0.4 - ~ States mit Unit versehen
          ~ Codeoptimierung
          + aktuelles Datum als DP (TT.MM.JJJJ)
          + einmalig beim 1. Start Berechnung durchführen
          + Log-Ausgaben
          ~ KW und Tagesnummern mit führenden Nullen
          ~ Default-DP geändert!
          + Nachtlänge in Stunden und Minuten
 V0.0.3 - - Openweather-Adapter wird nicht mehr benötigt
 V0.0.2 - + Länge der Nacht
          ~ x Stunden und 60 min möglich
          ~ negative Stundenanzahl bei Restlicht
 V0.0.1 - erste Beta

*/

  // wo sollen die Datenpunkte angelegt werden?
  const DP = 'javascript.0.Data.Wetter.';

  // wann erfolgt die tägliche Berechnung (Minuten Stunde * * *)
  schedule("58 0 * * *", Berechnung);

  // Ab hier braucht nichts mehr geändert zu werden ######################################


// firstStart
var DPtest = getState(DP+'aktuelles_Datum');
if ( !DPtest.val ) { firstStart(); }


async function firstStart() {
  createState(DP+'Tageslaenge',0, { unit: "Sekunden"});
  createState(DP+'Tageslaenge_txt',0);
  createState(DP+'Tageslaenge_Differenz',0);
  createState(DP+'Restlicht',0, { unit: "Sekunden"});
  createState(DP+'Restlicht_txt',0);
  createState(DP+'Kalenderwoche',0, { type: "String"});
  createState(DP+'Tag_des_Jahres',0, { type: "String"});
  createState(DP+'Nachtlaenge',0, { unit: "Sekunden"});
  createState(DP+'Nachtlicht_rest',0, { unit: "Sekunden"});
  createState(DP+'Sonnenaufgang',0);
  createState(DP+'Sonnenuntergang',0);
  createState(DP+'aktuelles_Datum',0, { type: "String"});
  await Sleep(3000);
  log("1. Start oder Update von Sonnenstatus durchgeführt...","info");
  Berechnung();
}


function Berechnung () {
  // Tageslänge berechnen
  var Aufgang = new Date(Timecode(getState('daswetter.0.NextHours.Location_1.Day_1.sun_in').val)).valueOf()/1000;
  var Untergang = new Date(Timecode(getState('daswetter.0.NextHours.Location_1.Day_1.sun_out').val)).valueOf()/1000;
  setState(DP+'Sonnenaufgang',Aufgang);
  setState(DP+'Sonnenuntergang',Untergang);

  var Tageslaenge = Untergang - Aufgang;  // in Sekunden
  var Stunden = Math.floor(Tageslaenge/3600);
  var Minuten = Math.floor((Tageslaenge % 3600)/60);

  var Tageslaenge_alt = getState(DP+'Tageslaenge').val;
  setState(DP+'Tageslaenge',Tageslaenge);
  setState(DP+'Tageslaenge_txt',Stunden+"h "+Minuten+"min");
  var Tageslaenge_Differenz = Tageslaenge - Tageslaenge_alt;
  var Minuten_Diff = Math.floor(Tageslaenge_Differenz/60);
  var Sekunden_Diff= Math.floor(Tageslaenge_Differenz % 60);

  if ( Tageslaenge_Differenz < 0 ) { setState(DP+'Tageslaenge_Differenz',Minuten_Diff+"min "+Sekunden_Diff+"sek"); }
  if ( Tageslaenge_Differenz > 0 ) { setState(DP+'Tageslaenge_Differenz',"+"+Minuten_Diff+"min "+Sekunden_Diff+"sek"); }
  if ( Tageslaenge_Differenz = 0 ) { setState(DP+'Tageslaenge_Differenz',"0min 0sek"); }

  // Nachtlaenge berechnen
  var Nachtlaenge = 86400 - Tageslaenge;
  setState(DP+'Nachtlaenge',Nachtlaenge);

  // Kalenderwoche berechnen
  var date = new Date();
  var currentThursday = new Date(date.getTime() +(3-((date.getDay()+6) % 7)) * 86400000);
   // At the beginnig or end of a year the thursday could be in another year.
   var yearOfThursday = currentThursday.getFullYear();
   // Get first Thursday of the year
   var firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
   // +1 we start with week number 1
   // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
   var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
   weekNumber = ("0" + weekNumber).slice(-2);
   setState(DP+'Kalenderwoche',weekNumber);

   // Tag des Jahres berechnen
   var Jahr = date.getFullYear();
   var heutestart = new Date(date.setHours(0,0,0,0));
   var neujahr = new Date(Jahr,0,1);
   var difftage = (heutestart - neujahr) / (24*60*60*1000) + 1;
   var tag_des_jahres = Math.ceil(difftage);
   tag_des_jahres = ("00" + tag_des_jahres).slice(-3);
   setState(DP+'Tag_des_Jahres',tag_des_jahres);

   // aktuelles Datum als DP
   var Datum = formatDate(new Date(), 'DD.MM.YYYY');
   setState(DP+'aktuelles_Datum',Datum);

   log("Berechnung für Sonnenstatus durchgeführt...","info");
}


// Tageslicht (Rest) berechnen
var MinuteMan = schedule("* * * * *", function () {
    var Untergang = getState(DP+'Sonnenuntergang').val;
    var Jetzt = Date.now() /1000;
    var Restlicht = Math.round(Untergang - Jetzt);
    setState(DP+'Restlicht',Restlicht);
    var Restlicht_h = Math.floor(Restlicht/3600);
    var Restlicht_min = Math.floor((Restlicht % 3600) /60);
    if ( Restlicht_min >= 0 && Restlicht_h >= 0 ) {
        setState(DP+'Restlicht_txt',Restlicht_h+"h "+Restlicht_min+"min");
     } else {
        setState(DP+'Restlicht_txt',"--h --min");
    }

    // Nachtlicht (Rest) berechnen
    var Nachtlicht_rest = Restlicht * -1;
    setState(DP+'Nachtlicht_rest',Nachtlicht_rest);

    // bei Nacht die restliche Länge der Nacht in h + min?
    if ( Nachtlicht_rest > 0 ) {
        var Nachtlaenge = getState(DP+'Nachtlaenge').val;
        Restlicht = Math.round(Nachtlaenge - Nachtlicht_rest);
        Restlicht_h = Math.floor(Restlicht/3600);
        Restlicht_min = Math.floor((Restlicht % 3600) /60);
        setState(DP+'Restlicht_txt',Restlicht_h+"h "+Restlicht_min+"min");
    }

});


// konvertiere Zeitstempel in Timecode
function Timecode (Zeitstempel) {
    return formatDate(new Date(), 'YYYY-MM-DD')+"T"+Zeitstempel+":00";
}


// Pause einlegen
function Sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/* MailParser 

   wertet per IMAP Mails aus
   
   (c)2022 by SBorg
   V0.1.0 - 16.05.2022  first try / Türstation
*/

// *** User-Einstellungen **********************************************************************************************************************************
    const PRE_DP   = '0_userdata.0.VIS.MailParser';  // wo sollen die Daten abgelegt werden. Nur unter "0_userdata" oder "javascript" möglich!
    const ZEITPLAN = "13 */5 * * * *";               // wann soll das Postfach geprüft werden (Sekunden Minuten Stunde * * *) [default alle 5 Minuten und 13 Sekunden] 

  //IMAP-Postfach
  let config = {
    imap: {
        user: 'mail@gmx.net', 
        password: '_geheim_', 
        host: 'imap.gmx.net', 
        port: 993,
        tls: true,
        authTimeout: 3000
    }
   };

  //suche und Ausgabe (Array)
    /*einzelner Eintrag [{ "Betreff": "_Suchtext_", "Ereignistext": "_Text_" }]
      bei mehreren muss ein Komma zischen die einzelnen {} */
  let MailParser = [{ "Betreff":"Anruf von **11", "Ereignistext": "Klingel EG" },
                    { "Betreff":"Anruf von **12", "Ereignistext": "Klingel OG" }];

// *** ENDE User-Einstellungen *****************************************************************************************************************************


//ab hier gibt es nix mehr zu ändern :)
//first start?
  const DP_Check='Klingelanzahl';
  if (!existsState(PRE_DP+'.'+DP_Check)) { createDP(DP_Check); }

//Start des Scripts
  let imaps = require('imap-simple');
  const simpleParser = require('mailparser').simpleParser;
  const _ = require('lodash');
  setTimeout(function() { main(); }, 10000);    // 10 Sekunden nach Start mal initial das Postfach prüfen

//scheduler
    schedule(ZEITPLAN, main);


function main() {
 let jsonSummary = [], id, Klingelanzahl = 0;   
 imaps.connect(config).then(function (connection) {
    return connection.openBox('INBOX').then(function () {
        let searchCriteria = ['UNSEEN'];
        let fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false
        };
        return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            messages.forEach(function (item) {
                let all = _.find(item.parts, { "which": "" })
                id = item.attributes.uid;
                let idHeader = "Imap-Id: "+id+"\r\n";
                simpleParser(idHeader+all.body, (err, mail) => {
                    // access to the whole mail object now granted
                    // check if "Klingel-Mail"
                    for(var i=0; i<MailParser.length; i++) {
                        if (MailParser[i].Betreff == mail.subject) { //Hit
                            //parse date
                            let datum = parser("Datum:", "</tr>", mail.html);
                            //parse time
                            let uhrzeit = parser("Uhrzeit:", "</tr>", mail.html);
                            jsonSummary.push(
                                {"Ereignis": MailParser[i].Ereignistext, 
                                 "Datum": datum,
                                 "Uhrzeit": uhrzeit
                                }
                            );
                            Klingelanzahl++;
                        }
                    };  
                    setState(PRE_DP+".Tuerstation", JSON.stringify(jsonSummary), true);
                    setState(PRE_DP+".Klingelanzahl", Number(Klingelanzahl), true);
                });
            });
           //keine Ereignisse gefunden?
           if ( typeof(id) == "undefined" ) { 
               setState(PRE_DP+".Tuerstation", "[]", true);
               setState(PRE_DP+".Klingelanzahl", Number(0), true);
            }
        });
    });
 });
}

function parser(start,ende,htmlmail) {
    let ausgabe;
    let pos_start = htmlmail.indexOf(start);
    let pos_ende = htmlmail.indexOf(ende);
 
    if (pos_start != -1 && pos_ende != -1) {                                         // wenn gesuchte Strings überhaupt existieren
        let bereich = htmlmail.substring(pos_start + start.length, htmlmail.length); // von/bis, aber ohne ersten Treffer
        bereich = bereich.substring(0, bereich.indexOf(ende));                       // Suchwort am Ende abschneiden
        ausgabe = strip_tags(bereich).trim();                                        // kpl. Ergebnis
    }
 return ausgabe;
}

function strip_tags(data) {
    var rueckgabe = data.replace(/(&nbsp;|<([^>]+)>)/ig, " ");
    return (rueckgabe);
}

//Datenpunkte anlegen
function createDP(DP_Check) {
    console.log(PRE_DP + '.' + DP_Check + ' existiert nicht... Lege Datenstruktur an...');
    createStateAsync(PRE_DP+'.Tuerstation',  "", { name: "Klingelereignisse", type: "string", role: "json"});
    createStateAsync(PRE_DP+'.Klingelanzahl', 0, { name: "Anzahl der Klingelereignisse", type: "number", role: "state"});
}    
# MailParser

**Javascript** welches im einstellbaren Raster ein IMAP-Postfach nach *ungelesenen*
Emails mit passendem Betreff durchsucht und daraus ein JSON-Object erzeugt. 
Hier wird zB. nach verpassten Anrufen der angebundenen Türstation auf einer Fritz!Box 
reagiert und ein passender Eintrag mit Datum und Uhrzeit des verpassten Klingelereignisses 
angelegt. 

Die Anzeige kann dann bspw. in der VIS mit einem passenden Widget erfolgen.


<img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/MailParser_Anzeige.png" alt="Übersicht verpasste Klingelereignisse" /> <img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/MailParser_VIS.png" height="200" alt="Foreca Regenradar" />

### Installation / Konfiguration
Im Javascript-Adapter müssen die folgenden drei Module hinzugefügt werden: `imap-simple`, `mailparser` und `lodash`. Es genügt sie einfach per *NPM-Modul hinzu* per C&P einzutragen. Sie werden dann nach dem Klick auf _Speichern&Schließen_ der Javascript-Instanz automatisch installiert:
   
<img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/MailParser_JS.png" alt="Javascript-Module installieren" />
Danach können die Einstellungen unter *User-Einstallungen* vorgenommen werden und abschließend das Script gestartet werden.

## Versionen
**V0.1.0 / 16.05.2022 - erstes Release**
```
  first try / Türstation
```

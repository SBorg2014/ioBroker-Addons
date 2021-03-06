# DWD-Regenradar

**Javascript** welches im einstellbaren Raster ein Bild und eine annimierte GIF des 
Regenradars für das konfigurierte Bundesland herunterlädt. Zudem können auch optional ein 
Satellitenradarbild und ein Regenradarbild von Foreca geladen werden.  
Die Bilder werden direkt in den Datenpunkten abgelegt und nicht als Dateien gespeichert.
Deswegen sollte man sich den Datenpunkt des GIFs (Film), auch wenn er leer erscheint,
nicht mittels Browser ansehen wollen.<sup>(\*)</sup> Das kann zu hoher Systemlast, bis hin zum 
Absturz des Client-Browsers führen!  
<sup>(\*)</sup> ab V0.0.2 lassen sich die Datenpunkte nicht mehr ansehen/ändern

Die Anzeige kann dann bspw. in der VIS mit einem einfachen HTML-Widget erfolgen.
Es ist lediglich ein Binding auf den Datenpunkt nötig:
```
<img src="{0_userdata.0.Wetter.RegenRadar.Hessen}" width="240px">
``` 

Natürlich sind im HTML auch weitere Attribute (wie hier *width*) möglich.

<img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/rad_hes_akt.jpg" alt="DWD Wetterbild Hessen" height="200" /> <img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/radfilm_hes_akt.gif" height="200" alt="DWD Wetterfilm Hessen" /> <img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/satradar.png" height="200" alt="DWD Satellitenregenradar" /> <img src="https://github.com/SBorg2014/ioBroker-Addons/blob/master/Bilder/Foreca.png" height="200" alt="Foreca Regenradar" />


Das Abfrageintervall auf unter 10 Minuten zu setzen ist unnötig, da idR. der DWD die Bilder nur ca. alle 10 Minuten updated.
Im Script ist noch eine zufällige Zeitverzögerung von bis zu 60 Sekunden vorhanden. Damit wird vermieden, dass zu viele Anfragen von Nutzern *gleichzeitig* auf den Webserver vom Deutschen Wetterdienst einprasseln. So wird die Last wenigstens etwas verteilt. Der Fairness gegenüber allen Nutzern sollte man dies bitte so belassen. Sonst könnte die Art dieser Abfrage ev. gesperrt werden und keiner kann sich mehr etwas anzeigen lassen... 

## Versionen
**V0.2.0 / 15.06.2022**
```
  + GPS-Koordinaten aus Systemkonfig lesen
```

**V0.1.0 / 16.01.2022**
```
  + Foreca-Regenradar hinzugefügt
  ~ Codeoptimierungen
```
                        
**V0.0.3 / 10.01.2022**
```
  + Satellitenradarbild (optional) hinzugefügt
```

**V0.0.2 / 09.01.2022**
```
  ~ Schreibzugriff auf die Datenpunkte entfernt
```

**V0.0.1 - erstes Release**

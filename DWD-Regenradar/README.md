# DWD-Regenradar

Javascript welches im einstellbaren Raster ein Bild und eine annimierte GIF des 
Regenradars für das konfigurierte Bundesland herunterlädt.
Das Bild wird direkt im Datenpunkt abgelegt und nicht als Datei gespeichert.
Deswegen sollte man sich den Datenpunkt des GIFs (Film), auch wenn er leer erscheint,
nicht mittels Browser ansehen wollen. Das kann zu hoher Systemlast, bis hin zum 
Absturz des Client-Browsers führen!

Die Anzeige kann dann bspw. in der VIS mit einem einfachen HTML-Widget erfolgen.
Es ist lediglich ein Binding auf den Datenpunkt nötig:
```
<img src="{0_userdata.0.Wetter.RegenRadar.Hessen}" width="240px">
``` 

Natürlich sind im HTML auch weitere Attribute (wie hier *width*) möglich.

<img src="https://www.dwd.de/DWD/wetter/radar/rad_hes_akt.jpg" alt="DWD Wetterbild Hessen"><img src="https://www.dwd.de/DWD/wetter/radar/radfilm_hes_akt.gif" alt="DWD Wetterfilm Hessen">



## Versionen  
**V0.0.1 - erstes Release**

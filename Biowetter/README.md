<h1>ioBroker-Biowetter</h1>


### Info ###
Damit wird das Biowetter der konfigurierten Stadt/Städte ausgelesen und in Datenpunkten gespeichert.


### ToDo ###
\---


### Installation ###
Ein neues Javascript im ioB anlegen und den Inhalt von `Biowetter.js` hineinkopieren.

### Konfiguration ###
Im Skript die gewünschten Einstellungen vornehmen:
```
const pfad = "0_userdata.0.Wetter.Biowetter.";
const logging = false;

// Städte können natürlich auch gelöscht werden
const stadt = [
    // Hessen     
    { "URL_" : "frankfurt-am-main",
      "name" : "Frankfurt am Main" }
];
```

   
### Update von einer Vorgängerversion ###
Skript vorher anhalten. Skript kpl. ersetzen (ggf. vorher den Block der User-Einstellungen sichern, dann braucht man nicht alles neu konfigurieren, aber kontrollieren 
ob die Syntax noch stimmt bzw. neue Einträge hinzu gekommen oder weggefallen sind!). Skript wieder starten. 


## Versionen ##

**28.01.2026**
```
    ~ Umstellung auf URL-IDs, Änderung der URL, Timeout erhöht
```

**11.06.2024**
```
    + Anpassung an JS 6.x und Umstellung von "axios" => "httpGet"   
 ```
<br><br><br>
## License ##
The MIT License (MIT)

Copyright (c) 2016 steinwedel, pix  
Copyright (c) 2019-2026 SBorg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

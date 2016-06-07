# Semantische Analyse des AFD Parteiprogramms
Sammlung an Tools um das Parteiprogramm der AFD semantische zu untersuchen. Welche Aussagen lassen sich welchem politischen Spektrum (rechts/links) zuordnen? Wie steht die AFD im Vergleich zu anderen Parteien da?

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Zum Beispiel `node policyIndex.js` ausführen, um das Skript zu starten.

## Klassifizierung
Die Parteiprogramme werden mit Hilfe eines Maschine-Learning-Ansatzes nach eher linken und rechten Aussagen klassifiziert. Zu dem wird untersucht, zu welchem Politikfeld (Außenpolitik, Wirtschaft usw.) eine Aussage gehört. Als Classifier kommt [FIPI](https://github.com/felixbiessmann/fipi/tree/afdHackathon) zum Einsatz. Der Classifier wurde mit Daten aus dem [Manifesto](https://manifestoproject.wzb.eu/)-Projekt trainiert. Manifesto bietet eine strukturierte, wissenschaftliche Analyse verschiedener Parteiprogramme – europaweit und historisch.

## Rechts-Links-Index pro Partei und Politikfeld (policyIndex.js)

## Verbesserungen

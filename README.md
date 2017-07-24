# Analyse der Parteiprogramme
Sammlung an Tools um die Parteiprogramme zur Bundestagswahl 2017 zu untersuchen. Welche Aussagen lassen sich welchem politischen Spektrum (rechts/links) zuordnen? Wie steht die AFD im Vergleich zu anderen Parteien da?

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Zum Beispiel `node policyIndex.js` ausführen, um das Skript zu starten.

## Datengrundlage

## Klassifizierung
Die Parteiprogramme werden mit Hilfe eines Maschine-Learning-Ansatzes nach eher linken und rechten Aussagen klassifiziert. Zu dem wird untersucht, zu welchem Politikfeld (Außenpolitik, Wirtschaft usw.) eine Aussage gehört. Als Classifier kommt [FIPI](https://github.com/felixbiessmann/fipi/tree/afdHackathon) zum Einsatz. Der Classifier wurde mit Daten aus dem [Manifesto](https://manifestoproject.wzb.eu/)-Projekt trainiert. Manifesto bietet eine strukturierte, wissenschaftliche Analyse verschiedener Parteiprogramme – europaweit und historisch.

Beispiel für eine Aussage aus dem FDP-Parteiprogramm:

```javascript
"FDP": [
  {
    "text": "### (1) Liberale Politik gew\u00e4hrleistet individuelle Chancen und gesellschaftliche Ordnung\n\nDie Freiheit des Einzelnen ist Grund und Grenze liberaler Politik. Frei zu\nsein hei\u00dft, das eigene Leben ohne fremden Zwang selbst bestimmen zu\nk\u00f6nnen. Daf\u00fcr schafft liberale Politik die Voraussetzungen: Chancen f\u00fcr\njeden einzelnen Menschen und Freiheitsordnungen f\u00fcr die offene\nB\u00fcrgergesellschaft.\n\nJeder Mensch soll faire Chancen haben, sich gem\u00e4\u00df der eigenen Talente\nund Ideen zu entfalten, von eigener Arbeit zu leben und nach eigener\nFa\u00e7on gl\u00fccklich zu werden. Das ist das Ziel liberaler Chancenpolitik:\nBildung und Bef\u00e4higung von Menschen zu selbstbestimmtem Leben und\nzur selbstbestimmten verantwortungsbewussten Teilhabe in Wirtschaft,\nPolitik und B\u00fcrgergesellschaft.\n\nIn unserer Demokratie bilden der liberale Rechtsstaat und die Soziale\nMarktwirtschaft gemeinsam die liberale Grundordnung. Sie bestimmen\ndie Voraussetzungen und setzen zugleich die Grenzen f\u00fcr das freie Spiel\nder Kr\u00e4fte in Politik, Markt und Gesellschaft. Es ist das Ziel liberaler\nOrdnungspolitik, Grundrechte und Freir\u00e4ume zu sichern, Zwang\nabzuwehren und Bedrohungen der Freiheit durch Machtmonopole zu\nverhindern und zu brechen. So gew\u00e4hrleistet liberale Ordnungspolitik eine\nausgewogene Balance zwischen der Freiheit des Einzelnen und der\nFreiheit der Vielen.",
    "fipi": {
      "domain": [{
        "prediction": 5.400354255298179e-05,
        "label": "External Relations"
      }, {
        "prediction": 0.00040884901158477115,
        "label": "Fabric of Society"
      }, {
        "prediction": 0.0007676447987353296,
        "label": "Welfare and Quality of Life"
      }, {
        "prediction": 0.9980144224573827,
        "label": "Freedom and Democracy"
      }, {
        "prediction": 2.1596868551601482e-06,
        "label": "Political System"
      }, {
        "prediction": 0.0007529205028890152,
        "label": "Economy"
      }],
      "leftright": [{
        "prediction": 0.9996861880381213,
        "label": "right"
      }, {
        "prediction": 0.0003138119618786429,
        "label": "left"
      }],
      "max_domain": "Freedom and Democracy",
      "max_leftright": "right",
      "max_manifestocode": "freedom/human rights +",
      "manifestocode": [ ... ]
    },
    "real_party": "FDP",
    "party": {
      "gruene": 0.004174328763727373,
      "fdp": 0.9951323550426446,
      "linke": 8.801176914421329e-08,
      "spd": 1.342547659835647e-08,
      "cducsu": 0.0006932147563823538
    },
    "id": "d2p2",
    "max_party": "fdp"
  },
  { ... },
]
```

Die Daten der klassifizierten Aussagen finden sich in `input/documents-fipi.json`.

## Datenanalyse
Momentan wird nur analysiert, wie recht oder links bestimmte Aussagen sind. Mögliche andere Auswertungen sind die Ähnlichkeit bestimmter Aussagen, wichtige Schlagwörter und so weiter.

## Rechts-Links-Index
Der Rechts-Links-Index ist eine Aggregation der Links-Rechts-Vorhersage aller Aussagen pro Partei und Poltikfeld (Policy). Dabei gibt es grundsätzlich folgende Möglichkeiten:

1. **ungewichteter Index**: Jede Aussage wird dem Politikfeld zugeordnet, für das es die höchste Vorhersage (Prediction) gibt: `policyIndex.js`
2. **gewichteter Index**: Jede Aussage wird anteilig jedem Politikfeld zugeordnet. Die Vorhersage bestimmt dabei das Gewicht. `weightedPolicyIndex.js`

Grundsätzlich berechet sich der Links-Rechts-Wert aus der Differenz der Vorhersage für den Rechts-Wert (z.B. **0.3**) und dem Links-Wert (z.B. **0.7**). In diesem Fall wäre der Indexwert *Rechts - Links* gleich **-0.4**.

Für jedes Poltikfeld und jede Partei werden jeweils folgende Indikatoren berechnet:

```javascript
{
  "party": "FDP",
  "percent": 12.5, // relativer Anteil der Aussagen zu einem bestimmten Politikfeld 
  "min": -1, // minimaler Wert (meistens Links-Wert)
  "max": 1, // maximaler Wert (meistens Rechts-Wert) 
  "mean": -0.09, // durchschnittlicher Links-Rechts-Wert
  "median": -0.1, // Median der Links-Rechts-Wert
  "stdDev": 0.77 // Standardabweichung
}
```

Die Daten der Auswertung finden sich in `output/`.

## Visualisierung
Die Visualisierungen dienen zur Zeit vor allem der Auswertungen und der Analyse. Eine Visualsierung für den Endbenutzer sollte übersichtlicher und komprimierter sein.

![Bubble Chart](afd-parteiprogramm-analyse/chart/bubbles.png)

Bisher gibt es zwei Versionen:

1. durchschnittlicher Links-Rechts-Wert (y) mit Aussagenanteil (r): `bubbles.js`
2. durchschnittlicher Links-Rechts-Wert (y) mit Aussagenanteil (r) und Standardabweichung (1/2σ): `boxes.js`.

Die Visualisierungen finden sich im Ordner `chart/`.

## Verbesserungen
- statistische Funktion in eigene Library auslagern
- Charts in eigenes Repo ausgliedern

/*
  HIER WERDEN ALLE TEXTE, DOKUMENTE UND LOESUNGEN GEPFLEGT.

  Die Loesungen stehen nicht im Klartext hier, sondern nur als Pruefsumme
  (SHA-256). So koennen Teilnehmende sie nicht im Quelltext nachlesen.
  Neue Pruefsummen erzeugt das Skript werkzeuge/loesung_hashen.py.
*/
window.INHALTE = {

  /* ---------- Startseite ---------- */

  prolog: [
    "Seit sieben Jahren arbeitete er nun schon bei der HalluGen GmbH. Sieben Jahre lang derselbe Weg, derselbe Parkplatz, derselbe Kaffee aus derselben Maschine im dritten Stock. Nichts hätte ihn auf diesen Montagmorgen vorbereiten können.",
    "Es war kurz nach acht, als er auf den Firmenparkplatz einbog. Nebel hing noch zwischen den Laternen, und das Gebäude der HalluGen GmbH ragte grau und schweigend in den Morgenhimmel. Doch etwas stimmte nicht.",
    "Blaulicht. Zuckend, kalt, lautlos warf es seine Schatten über die Glasfassade. Zwei Streifenwagen standen quer vor dem Eingang, und ein Polizist sprach leise in sein Funkgerät. Er fing nur Wortfetzen auf: „… heute Nacht … keine Spuren … eindeutig Mord.“",
    "Mord. Das Wort blieb in der Luft hängen wie der Nebel.",
    "Drinnen war es seltsam still. Keine klappernden Tastaturen, kein Kaffeeduft, kein Lachen aus der Küche. Stattdessen drängten sich seine Kollegen im Flur, blass, mit aufgerissenen Augen, und alle schoben sich in dieselbe Richtung: hinunter, zum Serverraum. Irgendwo schluchzte jemand. Eine Hand legte sich tröstend auf eine Schulter. Niemand sprach.",
    "Sein Herz schlug schneller. Mit jedem Schritt wurde der Gang enger, das Licht schwächer, die Luft schwerer. Vor der schweren Metalltür blieb die Menge stehen und wich zögernd zur Seite, als wolle niemand der Erste sein.",
    "Er trat vor. Er hielt den Atem an. Und er blickte hinein.",
    "Dunkelheit.",
    "Wo sonst Hunderte kleiner Lämpchen grün und blau geblinkt hatten, wo Lüfter gesummt und Kabel geknistert hatten wie ein lebendiges Herz, herrschte nun Totenstille. Kein Leuchten. Kein Surren. Nur kaltes, schwarzes Schweigen.",
    "Er schluckte. Dann begriff er.",
    "Kein Mensch lag hier am Boden. Das Opfer war … der Server.",
    "Jemand hatte ihn in der Nacht ermordet. Kaltblütig. Und der Täter, so viel war sicher, befand sich noch unter ihnen – irgendwo hier, bei der HalluGen GmbH."
  ],
  // Bei diesem Absatz gehen die Lämpchen des Servers im Hintergrundbild aus.
  lichtAusBei: "Dunkelheit.",

  /* ---------- Übersicht ---------- */

  einleitung: "Die HalluGen GmbH aus Büsum hat ein großes Problem – zwei Wochen vor dem Launch ihres neuen KI-Modells hinsichtlich KI-Halluzinationen, wurde der Server zerstört, auf dem das Projekt gespeichert war. Alle Spuren wurden gründlich verwischt und die Unternehmensleitung weiß nicht, wie sie die verantwortlichen Mitarbeitenden ausfindig machen sollen, denn eins wissen sie genau: Das Projekt war unter Verschluss und gut gesichert, es kann nur ein Insider gewesen sein. Als unabhängige KI-Experten wurde euer Team herangezogen, um die spärlichen Hinweise auszuwerten und das Verbrechen aufzuklären.",
  akteHinweis: "Hier findet ihr die ersten Hinweise.",

  // Übergeordneter Tipp: steht auf der Übersicht und bei Rätseln mit "dateiTipp: true"
  dateiTipp: {
    titel: "Tipp: Dateien in Python einlesen",
    teile: [
      "Das Einlesen einer Datei ist dann einfach, wenn die Datei im gleichen Arbeitsverzeichnis liegt wie euer Python-Skript. Geht deshalb in euren Datei-Manager und zieht die heruntergeladene Text-Datei in den PyCharm-Projektordner, den ihr zum Lösen des Rätsels benutzt.",
      { datei: "beispiel.txt", code: "Zeile1 6 5 13\nZeile2 9 45.5 2" },
      { code: "with open(\"beispiel.txt\", encoding=\"utf-8\") as dat:\n    for line in dat:\n        einzelne_elemente = line.strip(\"\\n\").split(\" \")\n        print(einzelne_elemente)\n        print(einzelne_elemente[0])" },
      { ausgabe: "['Zeile1', '6', '5', '13']\nZeile1\n['Zeile2', '9', '45.5', '2']\nZeile2" },
      "Mit strip(\"\\n\") wird der Zeilenumbruch am Ende der Zeile entfernt, mit split(\" \") werden die einzelnen Elemente der Zeile am Leerzeichen getrennt und in eine Liste geschrieben. encoding=\"utf-8\" sorgt dafür, dass Sonderzeichen wie ß richtig gelesen werden.",
      "Mehr Informationen: Mit der split-Methode wird ein String in eine Liste von mehreren Teil-Strings aufgeteilt.",
      { code: "text = \"3,4,5,6\"\ncleaned = text.split(\",\")\nprint(cleaned)" },
      { ausgabe: "['3', '4', '5', '6']" },
      "Mit der strip-Methode werden standardmäßig Leerzeichen am Anfang und Ende des Strings entfernt. Es können aber auch andere Zeichen ausgewählt werden.",
      { code: "text = \"###Python###\"\ncleaned = text.strip(\"#\")\nprint(cleaned)" },
      { ausgabe: "Python" }
    ]
  },

  /* ---------- Fallakte ---------- */

  akteText: "Erste Unterlagen zum Fall. Lest sie gründlich: Ihr werdet sie noch brauchen.",
  dokumente: [
    {
      titel: "Personalakten",
      beschreibung: "Alle Mitarbeitende, die als Tatverdächtige in Frage kommen.",
      datei: "dokumente/Personalakten_HalluGen_GmbH.pdf"
    },
    {
      titel: "Unternehmensflyer",
      beschreibung: "So stellt sich das Unternehmen nach außen dar",
      datei: "dokumente/HalluGen_GmbH_Flyer.pdf"
    },
    {
      titel: "Liste gefundener Gegenstände",
      beschreibung: "Alles, was am Tatort sichergestellt wurde",
      datei: "dokumente/Liste_gefundener_Gegenstaende.pdf"
    }
  ],

  /* ---------- Rätsel ---------- */
  /*
    vergleich: "text"  -> Groß-/Kleinschreibung, Leerzeichen und Absätze egal
               "wort"  -> zusätzlich werden Satzzeichen ignoriert (für Namen)
  */
  raetsel: [
    {
      art: "chat",
      titel: "Abgefangene Chats",
      kurz: "Verschlüsselte Nachrichten aus dem Firmennetz",
      aufgabe: "Diese Nachrichten wurden im Firmennetz abgefangen. Niemand sollte sie je lesen. Gebt den entschlüsselten Text als Lösung ein.",
      downloads: [
        { titel: "Verschlüsselte Rohdaten herunterladen", datei: "dokumente/chatneu_verschluesselt.txt" },
        { titel: "Geheimcode herunterladen", datei: "dokumente/chatentschluesselung.py" }
      ],
      frage: "Entschlüsselter Text",
      mehrzeilig: true,
      vergleich: "text",
      // Entschlüsselter Chat (= Datei chat_verlauf), zusätzlich mit einer "6" am Ende,
      // falls die Datei mit abschließendem Zeilenumbruch entschlüsselt wird
      loesungsHashes: [
        "7a8a067032303a5eade16b046e9d542431b400f4183b28959d4b3e5e2ada0ab5",
        "ab28e59bcbd6ad4e64cc8c579acd469807f77649b011e8b6f220a2f4061aab24"
      ],
      dateiTipp: true,
      // Tipp 1 ist sofort sichtbar, jede falsche Eingabe schaltet den nächsten frei.
      hilfen: [
        { titel: "Tipp 1", teile: [
          "Mit der index()-Funktion ist es möglich, den Index eines Elements innerhalb einer Liste zu finden:",
          { code: "meine_liste = [\"Hallo\", \"Kakao\", \"Capybara\"]\nprint(meine_liste.index(\"Kakao\"))  # Index von Kakao ermitteln" },
          { ausgabe: "1" }
        ] },
        { titel: "Tipp 2", teile: [
          "Geht den verschlüsselten Text Zeichen für Zeichen durch. Ihr müsst dann noch herausfinden, welchen Index das jeweilige Zeichen in der Liste geheimzeichen hat (Tipp 1)."
        ] },
        { titel: "Tipp 3", teile: [
          "Sobald ihr den Index des verschlüsselten Zeichens in der Liste geheimzeichen habt, könnt ihr schauen, welches Zeichen in der Liste zeichen bei diesem Index steht. Dann habt ihr den entschlüsselten Buchstaben."
        ] },
        { titel: "Tipp 4", teile: [
          "Um all diese Zeichen zusammenzufügen, bietet sich ein String an, den ihr leer initialisiert: entschluesselter_text = \"\". Diesem könnt ihr dann jedes entschlüsselte Zeichen hinzufügen (das geht mit +=).",
          { code: "leerer_string = \"\"\nleerer_string += \"h\"\nleerer_string += \"a\"\nleerer_string += \"l\"\nleerer_string += \"l\"\nleerer_string += \"o\"\nprint(leerer_string)" },
          { ausgabe: "hallo" }
        ] }
      ],
      erfolg: "Das ist es. Die nächste Spur ist frei."
    },
    {
      art: "einstein",
      titel: "Wer isst gern Bagels?",
      kurz: "Ein Logikrätsel nach Einstein",
      aufgabe: "In der HalluGen GmbH gibt es fünf Büros, die in einer Reihe nebeneinander liegen. Ordnet jedem Büro seinen Namen, die Person, das Getränk, das Frühstück und die Handymarke zu. Dann wisst ihr, wer gern Bagels isst.",
      regeln: [
        "Es gibt fünf Büros, die jeweils nach Gegenständen vom Strand benannt sind.",
        "In jedem Büro sitzt ein anderer Mitarbeiter.",
        "Jeder Mitarbeiter bevorzugt ein anderes Getränk, ein anderes Frühstück und eine andere Handymarke.",
        "Keiner der Mitarbeitenden bevorzugt das gleiche Getränk, die gleiche Handymarke oder das gleiche Frühstück wie irgendein anderer Mitarbeitender.",
        "Büro 1 liegt ganz links, Büro 5 ganz rechts."
      ],
      hinweise: [
        "Peter trinkt gern Tee.",
        "Frida sitzt im Büro Möwe.",
        "Susanne frühstückt gern Marmeladentoast.",
        "Günther hat ein Huawei.",
        "Dörte sitzt im ersten Büro.",
        "Der Mitarbeitende, der ein Google Pixel hat, trinkt gern Saft.",
        "Die Person im Büro Strandkorb trinkt gern Kaffee.",
        "Dörtes Büro ist neben dem Büro Seeschwalbe.",
        "Die Person im Büro Muschel hat ein iPhone.",
        "Die Person, die ein Samsung hat, frühstückt gern Smoothie Bowls.",
        "Die Person im mittleren Büro trinkt gern Matcha.",
        "Das Büro Strandkorb befindet sich unmittelbar links vom Büro Krabbe.",
        "Die Person, die Schokobrötchen bevorzugt, hat das Büro neben der Person, die ein iPhone hat.",
        "Die Person mit dem Xiaomi sitzt in einem Büro direkt neben der Person, die Overnight Oats frühstückt.",
        "Die Person, die ein Xiaomi hat, hat ein Büro neben der Person, die gern Wasser trinkt."
      ],
      kategorien: [
        { id: "buero", titel: "Büro", werte: ["Krabbe", "Möwe", "Muschel", "Seeschwalbe", "Strandkorb"] },
        { id: "person", titel: "Mitarbeiter", werte: ["Dörte", "Frida", "Günther", "Peter", "Susanne"] },
        { id: "getraenk", titel: "Getränk", werte: ["Kaffee", "Matcha", "Saft", "Tee", "Wasser"] },
        { id: "fruehstueck", titel: "Frühstück", werte: ["Bagels", "Marmeladentoast", "Overnight Oats", "Schokobrötchen", "Smoothie Bowls"] },
        { id: "handy", titel: "Handy", werte: ["Google Pixel", "Huawei", "iPhone", "Samsung", "Xiaomi"] }
      ],
      // Die erste Hilfe ist immer sichtbar, jede falsche Abgabe schaltet die nächste frei.
      hilfen: [
        { titel: "Die richtige Strategie", text: "Versucht nicht, alle Informationen gleichzeitig zu verarbeiten. Zeichnet fünf Positionen von links nach rechts und tragt zuerst die Hinweise ein, die eine feste Position vorgeben." },
        { titel: "Kombiniert Kategorien", text: "Sucht nach Hinweisen, die zwei Kategorien miteinander verbinden. Zum Beispiel sind manche Getränke direkt an eine Handymarke gekoppelt, andere an ein bestimmtes Büro." },
        { titel: "Achtet auf Nachbarschaften", text: "Die Hinweise zu Xiaomi sind besonders hilfreich. Überlegt, welche Positionen für Xiaomi überhaupt noch infrage kommen, wenn die Person sowohl neben Overnight Oats als auch neben Wasser sitzen muss." },
        { titel: "Nutzt die festen Positionen", text: "Dörte sitzt ganz links. Welches Büro muss direkt neben ihrem liegen? Und welche Information ergibt sich dadurch für die Büros mit den Namen Seeschwalbe, Strandkorb und Krabbe?" },
        { titel: "Der letzte Schubs", text: "Wenn ihr eine Kategorie vollständig zugeordnet habt, prüft, welche Person noch kein Frühstück zugeordnet bekommen hat. Nicht jede Information muss direkt aus einem einzelnen Hinweis folgen – manchmal entsteht sie erst durch Ausschluss." }
      ],
      // Prüfsumme der kompletten Zuteilung aller fünf Büros
      loesungsHashes: ["a1ceaf8f2394b5f06a53b061d5bd4e82bc9a3912c9b20979f5ac6ccacad1b59d"],
      erfolg: "Richtig! Günther sitzt im Büro Strandkorb – und er isst gern Bagels. Die Krümel im Serverraum bekommen plötzlich einen Namen."
    },
    {
      art: "log",
      titel: "Die Zugangsprotokolle",
      kurz: "Wer war zur falschen Zeit im Serverraum?",
      aufgabe: "Günther hatte keinen Zutritt zum Serverraum. Jemand muss ihm geholfen haben. Findet in den Logdaten den Mitarbeitenden, der sich im Oktober 2026 zu einer ungewöhnlichen Zeit eingeloggt hat. Schreibt dafür ein Python-Programm, das die Logdaten einliest, mit einer Schleife durch alle Einträge geht und dabei nach merkwürdigen Einträgen sucht. Über die Personalnummer und die Personalakten findet ihr den Namen des Komplizen.",
      auszug: "Der Serverraum ist ausschließlich mit personalisierten Zugangskarten zugänglich. Jeder Zutritt wird mit Personalnummer und Zeitstempel protokolliert. Eine Weitergabe der Zugangskarten ist laut Unternehmensrichtlinie untersagt.",
      aufbau: [
        ["in / out", "Einloggen oder Ausloggen"],
        ["Personalnummer", "z. B. 023"],
        ["Wochentag", "0 = Montag … 6 = Sonntag"],
        ["Datum", "TT.MM.JJJJ"],
        ["Uhrzeit", "HH:MM"]
      ],
      vorschau: [
        "in 023 1 20.10.2026 13:16",
        "out 005 1 06.10.2026 16:28",
        "out 045 2 14.10.2026 11:36",
        "in 005 3 15.10.2026 08:42",
        "out 017 2 28.10.2026 16:45",
        "out 045 3 29.10.2026 17:41",
        "out 023 1 20.10.2026 17:25",
        "out 038 3 15.10.2026 18:33"
      ],
      anzahl: 442,
      downloads: [
        { titel: "Logdaten herunterladen", datei: "dokumente/Logdaten.txt" }
      ],
      frage: "Name des Komplizen",
      vergleich: "wort",
      loesungsHashes: ["026ad9b14a7453b7488daa0c6acbc258b1506f52c441c7c465474c1a564394ff"],
      dateiTipp: true,
      // Tipp 1 ist sofort sichtbar, eine falsche Eingabe schaltet Tipp 2 frei.
      hilfen: [
        { titel: "Tipp 1", teile: [
          "Schaut euch den Tipp zum Einlesen einer Datei an (hier auf der Seite oder auf der Übersichtsseite). Tauscht dann die beispiel.txt gegen die Logdaten-Datei, die in eurem Arbeitsverzeichnis liegen sollte."
        ] },
        { titel: "Tipp 2", teile: [
          "Ihr braucht die Uhrzeit, um zu ermitteln, welcher Eintrag auffällig ist. Nutzt den entschlüsselten Text aus Rätsel 1, um herauszufinden, welche Uhrzeit ihr euch anschauen müsst."
        ] }
      ],
      erfolg: "Peter. Seine Zugangskarte öffnete den Serverraum am Freitag, dem 23. Oktober, um 20:34 Uhr – genau zu der Zeit aus dem Chat."
    }
  ],

  /* ---------- Abschluss ---------- */
  /*
    Jeder Schritt ist eine eigene Ansicht. "weiter" führt zum nächsten Schritt,
    "wahl" bietet mehrere Wege an, "ende" schließt die Geschichte ab.
  */
  abschluss: {
    start: "glueckwunsch",
    schritte: {
      glueckwunsch: {
        marke: "Fall gelöst",
        titel: "Herzlichen Glückwunsch, ihr habt es geschafft!",
        absaetze: [
          "Peter und Günther wurden von der Polizei in Gewahrsam genommen …",
          "Die Beweise waren eindeutig: die abgefangenen Chats, die Bagel-Krümel im Serverraum und Peters Zugangskarte, die am Abend des 23. Oktober benutzt wurde. Peter hat die Kameras abgeschaltet und Günther die Tür geöffnet. Günther hat den Server zerstört.",
          "Im Flur der HalluGen GmbH löst sich langsam die Anspannung. Da öffnet sich die Tür zur Chefetage."
        ],
        weiter: { text: "Weiter", ziel: "chefin" }
      },
      chefin: {
        marke: "Chefetage",
        titel: "Ein großzügiges Angebot",
        absaetze: [
          "Sabine Neumann, die Geschäftsführerin der HalluGen GmbH, kommt mit ausgestreckter Hand auf euch zu.",
          "„Ich danke Ihnen von Herzen. Ohne Sie hätten wir die Täter nie gefunden. Als kleines Dankeschön lade ich Ihr ganzes Team nach Hawaii ein – selbstverständlich auf meine Kosten.“",
          "Sie lächelt. Dann fügt sie leise hinzu:"
        ],
        zitat: "„Dank unseres Modells wird die Welt eine neue Realität erleben.“",
        frage: "Wie reagiert ihr?",
        wahl: [
          { text: "Die Reise nach Hawaii annehmen", ziel: "hawaii" },
          { text: "Kritisch nachfragen: „Was genau meinen Sie damit?“", ziel: "nachfrage" }
        ]
      },
      hawaii: {
        art: "strand",
        marke: "Zwei Wochen später",
        titel: "Aloha!",
        absaetze: [
          "Weißer Sand, türkisblaues Wasser, eine Kokosnuss mit Strohhalm in der Hand. Der Fall ist gelöst, und die Sonne versinkt langsam im Pazifik.",
          "Ihr habt euch diesen Urlaub verdient. Über den seltsamen Satz der Chefin denkt hier niemand mehr nach.",
          "Oder?"
        ],
        ende: true
      },
      nachfrage: {
        marke: "Chefetage",
        titel: "Eine Frage zu viel",
        absaetze: [
          "Das Lächeln von Sabine Neumann gefriert.",
          "„Wie bitte? Ich bedanke mich bei Ihnen, und Sie zweifeln an meiner Integrität?“ Ihre Stimme wird scharf. „Dann vergessen Sie Hawaii. Das Angebot ist hiermit zurückgezogen. Guten Tag.“",
          "Die Tür fällt ins Schloss. Zurück bleibt ein ungutes Gefühl, das euch nicht mehr loslässt."
        ],
        weiter: { text: "Einige Wochen später …", ziel: "zeitung" }
      },
      zeitung: {
        art: "zeitung",
        zeitung: "Büsumer Wellenbote",
        datum: "Dienstag, 15. Dezember 2026",
        ressort: "Wirtschaft & Technik",
        titel: "Täuschung mit System: Was bei HalluGen wirklich geschah",
        unterzeile: "Zwei Mitarbeiter verhinderten den Start eines manipulativen KI-Modells – Ermittlungen gegen die Geschäftsführung",
        absaetze: [
          "Büsum. Neue Erkenntnisse stellen den Fall um den zerstörten Server der HalluGen GmbH in ein völlig anderes Licht. Interne Unterlagen, die unserer Redaktion vorliegen, zeigen: Das neue KI-Modell des Unternehmens sollte KI-Halluzinationen nicht erkennen, sondern gezielt erzeugen – besonders überzeugende Falschinformationen, mit denen Menschen manipuliert werden sollten.",
          "Die Mitarbeiter Peter und Günther hatten das offenbar herausgefunden. Weil ihre Warnungen intern ungehört blieben, zerstörten sie zwei Wochen vor dem geplanten Launch den Server, auf dem das Projekt gespeichert war.",
          "Ihr Einsatz hat die Veröffentlichung des Modells so weit verzögert, dass es keinen Schaden mehr anrichten konnte. Inzwischen ermitteln die Behörden gegen die Geschäftsführung, der Start des Modells wurde untersagt.",
          "Peter und Günther sind wieder auf freiem Fuß. Gegenüber unserer Zeitung sagte Günther nur: „Manchmal muss man etwas zerstören, um Schlimmeres zu verhindern.“ Dann biss er in einen Bagel."
        ],
        ende: true
      }
    }
  }
};

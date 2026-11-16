"""
Erzeugt die Pruefsumme (SHA-256) einer Loesung fuer js/inhalte.js.

Aufruf:
  py werkzeuge/loesung_hashen.py text "Der komplette Loesungstext"
  py werkzeuge/loesung_hashen.py text --datei pfad/zur/loesung.txt
  py werkzeuge/loesung_hashen.py wort "Peter"

"text": Gross-/Kleinschreibung, Leerzeichen und Absaetze werden ignoriert.
"wort": zusaetzlich werden alle Satzzeichen ignoriert (fuer Namen).
Die Normalisierung muss exakt der in js/app.js entsprechen.

Raetsel 2 (Lageplan): Pro Buero (1 bis 5) die Werte in der Reihenfolge
Buero|Mitarbeiter|Getraenk|Fruehstueck|Handy, Bueros mit ";" getrennt, z. B.
  py werkzeuge/loesung_hashen.py text "Muschel|Doerte|...;Seeschwalbe|Peter|..."
"""
import hashlib
import re
import sys
import unicodedata
from pathlib import Path


def norm_text(t):
    t = unicodedata.normalize("NFC", t).lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        t = t.replace(a, b)
    return re.sub(r"\s", "", t)


def norm_wort(t):
    return re.sub(r"[^a-z0-9]", "", norm_text(t))


if len(sys.argv) < 3 or sys.argv[1] not in ("text", "wort"):
    print(__doc__)
    sys.exit(1)

if sys.argv[2] == "--datei":
    eingabe = Path(sys.argv[3]).read_text(encoding="utf-8")
else:
    eingabe = " ".join(sys.argv[2:])

normal = norm_text(eingabe) if sys.argv[1] == "text" else norm_wort(eingabe)
print(hashlib.sha256(normal.encode("utf-8")).hexdigest())

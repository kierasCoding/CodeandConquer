(function () {
  "use strict";

  var I = window.INHALTE;
  var ansicht = document.getElementById("ansicht");
  var SPEICHER = "mord-im-serverraum-v1";
  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var laufendeTimer = [];
  var aufraeumen = [];

  /* ---------- Hilfen ---------- */

  function esc(t) {
    var d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }

  function spaeter(fn, ms) {
    var id = setTimeout(fn, ms);
    laufendeTimer.push(id);
    return id;
  }

  function seitenwechselAufraeumen() {
    laufendeTimer.forEach(clearTimeout);
    laufendeTimer = [];
    aufraeumen.forEach(function (fn) { fn(); });
    aufraeumen = [];
  }

  function lauschen(ziel, ereignis, fn) {
    ziel.addEventListener(ereignis, fn);
    aufraeumen.push(function () { ziel.removeEventListener(ereignis, fn); });
  }

  function dateiname(pfad) { return pfad.split("/").pop(); }

  function downloadsHtml(liste) {
    if (!liste || !liste.length) return "";
    return '<div class="downloads">' + liste.map(function (d) {
      return '<a class="download" href="' + esc(d.datei) + '" download="' + esc(dateiname(d.datei)) + '">' +
        '<span aria-hidden="true">↓</span> ' + esc(d.titel) + '</a>';
    }).join("") + '</div>';
  }

  /* ---------- Loesungen pruefen ---------- */

  // Muss exakt der Normalisierung in werkzeuge/loesung_hashen.py entsprechen.
  function normText(t) {
    return t.normalize("NFC").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/\s/g, "");
  }

  function normWort(t) { return normText(t).replace(/[^a-z0-9]/g, ""); }

  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  // SHA-256 ohne Browser-Krypto-API, damit es auch ohne HTTPS funktioniert.
  function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    var laenge = bytes.length;
    var n = ((laenge + 9 + 63) >> 6) << 6;
    var m = new Uint8Array(n);
    m.set(bytes);
    m[laenge] = 0x80;
    var dv = new DataView(m.buffer);
    dv.setUint32(n - 8, Math.floor(laenge / 0x20000000));
    dv.setUint32(n - 4, (laenge << 3) >>> 0);
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64);
    for (var o = 0; o < n; o += 64) {
      var i;
      for (i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        var t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (v) { return ("0000000" + (v >>> 0).toString(16)).slice(-8); }).join("");
  }

  function istRichtig(r, eingabe) {
    var normal = r.vergleich === "wort" ? normWort(eingabe) : normText(eingabe);
    return normal !== "" && r.loesungsHashes.indexOf(sha256(normal)) !== -1;
  }

  /* ---------- Spielstand ---------- */

  function leererStand() { return { geloest: [], angekuendigt: [1], brett2: {}, hilfen: {} }; }

  function stand() {
    try {
      var s = JSON.parse(localStorage.getItem(SPEICHER));
      if (s && s.geloest && s.angekuendigt) {
        s.brett2 = s.brett2 || {};
        s.hilfen = s.hilfen || {};
        if (s.hilfen2) { s.hilfen[2] = Math.max(s.hilfen[2] || 1, s.hilfen2); delete s.hilfen2; }
        return s;
      }
    } catch (e) { /* privater Modus o. Ae.: startet leer */ }
    return leererStand();
  }

  var spiel = stand();

  function speichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(spiel)); } catch (e) { /* ohne Speicher spielbar */ }
  }

  function istGeloest(n) { return spiel.geloest.indexOf(n) !== -1; }
  function istFrei(n) { return n === 1 || istGeloest(n - 1); }
  function istAngekuendigt(n) { return spiel.angekuendigt.indexOf(n) !== -1; }
  function alleGeloest() { return I.raetsel.every(function (r, i) { return istGeloest(i + 1); }); }

  function alsGeloestMerken(n) {
    if (!istGeloest(n)) spiel.geloest.push(n);
    speichern();
  }

  /* ---------- Tipps und Loesungshilfen ---------- */

  function hilfenOffen(n) { return spiel.hilfen[n] || 1; }

  // Schaltet die naechste Hilfe frei und gibt ihre Nummer zurueck (oder undefined)
  function naechsteHilfe(n, r) {
    var offen = hilfenOffen(n);
    if (!r.hilfen || offen >= r.hilfen.length) return undefined;
    spiel.hilfen[n] = offen + 1;
    speichern();
    return offen;
  }

  // Inhalt eines Tipps: Text, Code, Beispieldatei oder Ausgabe
  function teileHtml(teile) {
    return teile.map(function (t) {
      if (typeof t === "string") return '<p>' + esc(t) + '</p>';
      if (t.datei) return '<div class="code-block"><span class="code-titel">' + esc(t.datei) + '</span><pre>' + esc(t.code) + '</pre></div>';
      if (t.code) return '<div class="code-block"><span class="code-titel">Python</span><pre>' + esc(t.code) + '</pre></div>';
      if (t.ausgabe) return '<div class="code-block code-ausgabe"><span class="code-titel">Ausgabe</span><pre>' + esc(t.ausgabe) + '</pre></div>';
      return "";
    }).join("");
  }

  function hilfenHtml(r, offen, alleOffen) {
    return r.hilfen.map(function (h, i) {
      var sichtbar = i < offen || alleOffen;
      var inhalt = h.teile ? teileHtml(h.teile) : '<p>' + esc(h.text) + '</p>';
      return '<li class="hilfe ' + (sichtbar ? 'hilfe-offen' : 'hilfe-zu') + '" data-hilfe="' + i + '">' +
        '<strong>' + (sichtbar ? esc(h.titel) : (h.teile ? 'Tipp ' : 'Lösungshilfe ') + (i + 1)) + '</strong>' +
        (sichtbar ? inhalt : '<p>Wird nach einer falschen Eingabe freigeschaltet.</p>') + '</li>';
    }).join("");
  }

  function dateiTippHtml() {
    return '<details class="tipp-box"><summary>' + esc(I.dateiTipp.titel) + '</summary><div class="tipp-inhalt">' + teileHtml(I.dateiTipp.teile) + '</div></details>';
  }

  /* ---------- Startseite ---------- */

  var SZENE =
    '<svg class="szene" viewBox="0 0 800 800" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">' +
      '<defs>' +
        '<filter id="glut" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>' +
        '<filter id="weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>' +
        '<linearGradient id="boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset="1" stop-color="#000"/></linearGradient>' +
        '<linearGradient id="strahl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="gehaeuse" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a6a6a"/><stop offset=".08" stop-color="#2c2c2c"/><stop offset=".5" stop-color="#232323"/><stop offset=".92" stop-color="#2c2c2c"/><stop offset="1" stop-color="#6a6a6a"/></linearGradient>' +
        '<linearGradient id="einschub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset="1" stop-color="#2a2a2a"/></linearGradient>' +
      '</defs>' +
      '<rect width="800" height="800" fill="#0a0a0a"/>' +
      '<polygon points="170,620 630,620 800,800 0,800" fill="url(#boden)"/>' +
      '<g class="fenster">' +
        '<rect x="205" y="120" width="90" height="270" fill="#fff" filter="url(#glut)" opacity=".55"/>' +
        '<rect x="340" y="120" width="130" height="270" fill="#fff" filter="url(#glut)" opacity=".75"/>' +
        '<rect x="515" y="120" width="90" height="270" fill="#fff" filter="url(#glut)" opacity=".55"/>' +
        '<rect x="205" y="120" width="90" height="270" fill="#e9e9e9"/>' +
        '<rect x="340" y="120" width="130" height="270" fill="#f4f4f4"/>' +
        '<rect x="515" y="120" width="90" height="270" fill="#e9e9e9"/>' +
      '</g>' +
      '<g stroke="#0a0a0a" stroke-width="4">' +
        '<path d="M235 120v270M265 120v270M205 165h90M205 210h90M205 255h90M205 300h90M205 345h90"/>' +
        '<path d="M383 120v270M427 120v270M340 165h130M340 210h130M340 255h130M340 300h130M340 345h130"/>' +
        '<path d="M545 120v270M575 120v270M515 165h90M515 210h90M515 255h90M515 300h90M515 345h90"/>' +
      '</g>' +
      '<g class="strahlen">' +
        '<polygon points="205,390 295,390 340,700 140,700" fill="url(#strahl)"/>' +
        '<polygon points="515,390 605,390 680,700 470,700" fill="url(#strahl)"/>' +
      '</g>' +
      '<ellipse cx="405" cy="300" rx="140" ry="110" fill="#fff" opacity=".35" filter="url(#weich)"/>' +
      '<ellipse cx="405" cy="690" rx="150" ry="18" fill="#000" opacity=".8"/>' +
      '<g class="server">' +
        '<rect x="315" y="270" width="180" height="415" rx="3" fill="url(#gehaeuse)"/>' +
        '<rect x="315" y="270" width="180" height="415" rx="3" fill="none" stroke="#9a9a9a" stroke-width="2" opacity=".8"/>' +
        '<path d="M318 271h174" stroke="#e6e6e6" stroke-width="3"/>' +
        '<g fill="url(#einschub)" stroke="#5a5a5a" stroke-width="1.5">' +
          '<rect x="330" y="290" width="150" height="52"/><rect x="330" y="352" width="150" height="52"/>' +
          '<rect x="330" y="414" width="150" height="52"/><rect x="330" y="476" width="150" height="52"/>' +
          '<rect x="330" y="538" width="150" height="52"/><rect x="330" y="600" width="150" height="62"/>' +
        '</g>' +
        '<g stroke="#161616" stroke-width="3">' +
          '<path d="M398 300v32M406 300v32M414 300v32M422 300v32M430 300v32M438 300v32M446 300v32M454 300v32M462 300v32"/>' +
          '<path d="M398 362v32M406 362v32M414 362v32M422 362v32M430 362v32M438 362v32M446 362v32M454 362v32M462 362v32"/>' +
          '<path d="M398 424v32M406 424v32M414 424v32M422 424v32M430 424v32M438 424v32M446 424v32M454 424v32M462 424v32"/>' +
          '<path d="M398 486v32M406 486v32M414 486v32M422 486v32M430 486v32M438 486v32M446 486v32M454 486v32M462 486v32"/>' +
          '<path d="M398 548v32M406 548v32M414 548v32M422 548v32M430 548v32M438 548v32M446 548v32M454 548v32M462 548v32"/>' +
        '</g>' +
        '<g fill="#111"><rect x="340" y="300" width="44" height="12"/><rect x="340" y="362" width="44" height="12"/><rect x="340" y="424" width="44" height="12"/><rect x="340" y="486" width="44" height="12"/><rect x="340" y="548" width="44" height="12"/></g>' +
        '<g fill="#1a1a1a"><rect x="322" y="685" width="22" height="8"/><rect x="466" y="685" width="22" height="8"/></g>' +
      '</g>' +
      '<g class="leds">' +
        '<circle cx="345" cy="326" r="3" fill="#5dff8a"/><circle cx="356" cy="326" r="3" fill="#5dff8a"/><circle cx="367" cy="326" r="3" fill="#6fb6ff"/>' +
        '<circle cx="345" cy="388" r="3" fill="#5dff8a"/><circle cx="367" cy="388" r="3" fill="#6fb6ff"/>' +
        '<circle cx="345" cy="450" r="3" fill="#5dff8a"/><circle cx="356" cy="450" r="3" fill="#5dff8a"/>' +
        '<circle cx="345" cy="512" r="3" fill="#6fb6ff"/><circle cx="356" cy="512" r="3" fill="#5dff8a"/><circle cx="367" cy="512" r="3" fill="#5dff8a"/>' +
        '<circle cx="345" cy="574" r="3" fill="#5dff8a"/><circle cx="367" cy="574" r="3" fill="#6fb6ff"/>' +
      '</g>' +
    '</svg>';

  function zeigeStart() {
    var absaetze = I.prolog.map(function () { return '<p class="geister-absatz"></p>'; }).join("");
    ansicht.className = "seite seite-start";
    ansicht.innerHTML =
      SZENE +
      '<div class="start-schleier" aria-hidden="true"></div>' +
      '<h1 class="schiene" aria-label="Mord im Server-Raum"><span class="schiene-kontur" aria-hidden="true">Mord im</span><span class="schiene-voll" aria-hidden="true">Server-Raum</span></h1>' +
      '<section class="start-text">' +
        '<p class="nur-vorlesen">' + esc(I.prolog.join(" ")) + '</p>' +
        '<div class="geisterschrift" aria-hidden="true">' + absaetze + '<span class="geisterfeder"></span></div>' +
        '<div class="start-aktion"><a class="weiter-knopf" href="#uebersicht" hidden>Weiter zur Übersicht <span aria-hidden="true">→</span></a></div>' +
      '</section>' +
      '<button type="button" class="ueberspringen">Überspringen</button>';
    geisterschrift();
  }

  function geisterschrift() {
    var texte = I.prolog;
    var ziele = ansicht.querySelectorAll(".geister-absatz");
    var feder = ansicht.querySelector(".geisterfeder");
    var knopf = ansicht.querySelector(".ueberspringen");
    var weiter = ansicht.querySelector(".weiter-knopf");
    var box = ansicht.querySelector(".geisterschrift");
    var szene = ansicht.querySelector(".szene");
    var absatz = 0, zeichen = 0, fertig = false, letztesScrollen = 0;

    // Den Text vorab unsichtbar setzen: Der Umbruch steht so von Anfang an fest
    // und Woerter springen beim Schreiben nicht in die naechste Zeile.
    var buchstaben = texte.map(function (text, i) {
      var liste = [];
      text.split(" ").forEach(function (wort, w, alle) {
        var wortBox = document.createElement("span");
        wortBox.className = "wort";
        Array.from(wort).forEach(function (c) {
          var s = document.createElement("span");
          s.className = "wartet";
          s.textContent = c;
          wortBox.appendChild(s);
          liste.push(s);
        });
        ziele[i].appendChild(wortBox);
        if (w < alle.length - 1) ziele[i].appendChild(document.createTextNode(" "));
      });
      return liste;
    });

    function lichtAus() { szene.classList.add("aus"); }

    function abschluss() {
      fertig = true;
      feder.classList.remove("sichtbar");
      knopf.hidden = true;
      weiter.hidden = false;
      weiter.classList.add("auftritt");
    }

    function alles() {
      laufendeTimer.forEach(clearTimeout);
      laufendeTimer = [];
      buchstaben.forEach(function (liste) {
        liste.forEach(function (s) {
          if (s.classList.contains("wartet")) s.className = "sofort";
        });
      });
      lichtAus();
      abschluss();
      weiter.scrollIntoView({ block: "center", behavior: ruhig ? "auto" : "smooth" });
    }

    function mitscrollen(z) {
      var jetzt = Date.now();
      var unten = window.innerHeight - 150;
      // Nur folgen, wenn der Text gerade unten aus dem Bild laeuft (nicht, wenn
      // jemand selbst nach oben gescrollt hat).
      if (z.bottom > unten && z.bottom < window.innerHeight + 60 && jetzt - letztesScrollen > 700) {
        letztesScrollen = jetzt;
        window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" });
      }
    }

    function schreibe() {
      if (fertig) return;
      if (absatz >= texte.length) { abschluss(); return; }
      var liste = buchstaben[absatz];
      if (zeichen === 0 && texte[absatz] === I.lichtAusBei) lichtAus();
      if (zeichen >= liste.length) {
        absatz += 1;
        zeichen = 0;
        spaeter(schreibe, 520);
        return;
      }
      var s = liste[zeichen];
      var c = s.textContent;
      s.className = "geist";
      s.style.setProperty("--dreh", (Math.random() * 14 - 7).toFixed(1) + "deg");
      s.style.setProperty("--hub", (Math.random() * 7 - 8).toFixed(1) + "px");
      var bs = box.getBoundingClientRect(), z = s.getBoundingClientRect();
      feder.style.transform = "translate(" + (z.right - bs.left) + "px," + (z.top - bs.top) + "px)";
      feder.classList.add("sichtbar");
      mitscrollen(z);
      zeichen += 1;
      var pause = 16 + Math.random() * 30;
      if (/[,:;–]/.test(c)) pause += 170;
      if (/[.!?…]/.test(c)) pause += 360;
      spaeter(schreibe, pause);
    }

    knopf.addEventListener("click", alles);
    if (ruhig) { alles(); return; }
    spaeter(schreibe, 900);
  }

  /* ---------- Fallakte ---------- */

  function zeigeAkte() {
    var liste = I.dokumente.map(function (d, i) {
      return '<li class="dokument">' +
        '<span class="klammer" aria-hidden="true"></span>' +
        '<div class="dokument-text">' +
          '<span class="dokument-nr">Dokument ' + (i + 1) + '</span>' +
          '<h3>' + esc(d.titel) + '</h3>' +
          '<p>' + esc(d.beschreibung) + '</p>' +
        '</div>' +
        '<div class="dokument-aktionen">' +
          '<button type="button" class="akte-knopf" data-pdf="' + esc(d.datei) + '" data-titel="' + esc(d.titel) + '">Ansehen</button>' +
          '<a class="akte-knopf akte-knopf-voll" href="' + esc(d.datei) + '" download="' + esc(dateiname(d.datei)) + '">Herunterladen</a>' +
        '</div>' +
      '</li>';
    }).join("");

    ansicht.className = "seite seite-akte";
    ansicht.innerHTML =
      '<div class="mappe">' +
        '<a class="akte-schliessen" href="' + esc(letzteSeite) + '" aria-label="Fallakte schließen" title="Fallakte schließen">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></a>' +
        '<div class="mappe-reiter">Fallakte</div>' +
        '<div class="mappe-koerper">' +
          '<div class="blatt">' +
            '<div class="stempel" aria-hidden="true">Vertraulich</div>' +
            '<p class="blatt-marke">Ermittlungsakte</p>' +
            '<h1>Mord im Server-Raum</h1>' +
            '<p class="blatt-hinweis">' + esc(I.akteText) + '</p>' +
            '<ul class="dokumente">' + liste + '</ul>' +
            '<div class="blatt-fuss"><a class="akte-weiter" href="#uebersicht">Weiter zur Übersicht <span aria-hidden="true">→</span></a></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    ansicht.querySelectorAll("[data-pdf]").forEach(function (b) {
      b.addEventListener("click", function () { pdfOeffnen(b.getAttribute("data-pdf"), b.getAttribute("data-titel")); });
    });
  }

  var dialog = document.getElementById("pdf-dialog");
  var rahmen = document.getElementById("pdf-rahmen");

  function pdfOeffnen(datei, titel) {
    document.getElementById("pdf-titel").textContent = titel;
    var dl = document.getElementById("pdf-download");
    dl.href = datei;
    dl.setAttribute("download", dateiname(datei));
    rahmen.src = datei;
    dialog.showModal();
  }

  document.getElementById("pdf-schliessen").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () { rahmen.removeAttribute("src"); });

  /* ---------- Uebersicht ---------- */

  var SCHLOSS = '<svg class="schloss" viewBox="0 0 24 24" aria-hidden="true"><path class="buegel" d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="11" width="16" height="10" fill="currentColor"/></svg>';

  var ORDNER =
    '<svg class="ordner-bild" viewBox="0 0 170 140" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="ordner-hinten" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3b265"/><stop offset="1" stop-color="#c06f27"/></linearGradient>' +
        '<linearGradient id="ordner-vorne" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8bf78"/><stop offset=".55" stop-color="#e48d3b"/><stop offset="1" stop-color="#b35f1d"/></linearGradient>' +
      '</defs>' +
      '<path d="M22 20q0-9 9-9h34q7 0 10 6l5 8h62q9 0 9 9v86q0 9-9 9H31q-9 0-9-9z" fill="url(#ordner-hinten)"/>' +
      '<g class="ordner-blaetter">' +
        '<rect x="34" y="34" width="100" height="74" rx="4" fill="#e7ecf2" transform="rotate(-7 84 71)"/>' +
        '<rect x="42" y="28" width="100" height="80" rx="4" fill="#2f7fd8" transform="rotate(-3 92 68)"/>' +
        '<rect x="48" y="32" width="96" height="76" rx="4" fill="#d3dbe4"/>' +
        '<rect x="56" y="24" width="92" height="84" rx="4" fill="#5aa6f2"/>' +
      '</g>' +
      '<path d="M12 56q0-7 7-7h124q7 0 8 7l8 70q1 9-8 9H27q-8 0-9-8z" fill="url(#ordner-vorne)"/>' +
      '<path d="M22 58h120" stroke="#ffd9a8" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>' +
    '</svg>';

  function zeigeUebersicht() {
    var neu = [];
    var karten = I.raetsel.map(function (r, i) {
      var n = i + 1;
      var frei = istFrei(n);
      var ankuendigen = frei && !istAngekuendigt(n) && !ruhig;
      if (ankuendigen) neu.push(n);
      if (frei && !istAngekuendigt(n)) spiel.angekuendigt.push(n);
      var zustand = istGeloest(n) && !ankuendigen ? "geloest" : (frei && !ankuendigen ? "offen" : "gesperrt");
      var status = { geloest: "Gelöst", offen: "Offen", gesperrt: "Gesperrt" }[zustand];
      var pfeil = "";
      if (i > 0) {
        var pfeilFrei = frei && !ankuendigen;
        pfeil = '<div class="pfeil' + (pfeilFrei ? " pfeil-frei" : "") + '" data-nach="' + n + '" aria-hidden="true">' +
          '<svg viewBox="0 0 100 24" preserveAspectRatio="none"><line x1="0" y1="12" x2="92" y2="12" pathLength="100"/></svg>' +
          '<span class="pfeil-spitze"></span></div>';
      }
      var tag = zustand === "gesperrt" ? "div" : "a";
      var href = zustand === "gesperrt" ? ' aria-disabled="true"' : ' href="#raetsel/' + n + '"';
      return pfeil +
        '<' + tag + ' class="karte karte-' + zustand + '" data-nr="' + n + '"' + href + '>' +
          '<span class="karte-nr" aria-hidden="true">' + n + '</span>' +
          '<span class="karte-schloss">' + SCHLOSS + '</span>' +
          '<span class="karte-marke">Rätsel ' + n + '</span>' +
          '<strong class="karte-titel">' + esc(frei && !ankuendigen ? r.titel : "Unbekannt") + '</strong>' +
          '<span class="karte-kurz">' + esc(frei && !ankuendigen ? r.kurz : "Löst zuerst das vorherige Rätsel.") + '</span>' +
          '<span class="karte-status">' + status + '</span>' +
        '</' + tag + '>';
    }).join("");

    ansicht.className = "seite seite-uebersicht";
    ansicht.innerHTML =
      '<h1 class="uebersicht-titel"><span class="schiene-kontur">Mord im</span> <span class="schiene-voll">Server-Raum</span></h1>' +
      '<p class="uebersicht-einleitung">' + esc(I.einleitung) + '</p>' +
      '<hr class="goldlinie">' +
      '<section class="akte-zeile">' +
        '<div class="akte-zeile-text"><h2>Fallakte</h2><p>' + esc(I.akteHinweis) + '</p></div>' +
        '<a class="ordner" href="#akte">' + ORDNER + '<span class="ordner-text">Fallakte öffnen</span></a>' +
      '</section>' +
      '<hr class="goldlinie">' +
      '<div class="reihe-raetsel">' + karten + '</div>' +
      (alleGeloest()
        ? '<hr class="goldlinie"><div class="abschluss-zeile"><p>Alle drei Rätsel sind gelöst.</p><a class="weiter-rot" href="#abschluss">Zum Abschluss des Falls <span aria-hidden="true">→</span></a></div>'
        : '') +
      '<hr class="goldlinie">' +
      '<section class="tipp-bereich"><h2>Allgemeiner Tipp</h2>' + dateiTippHtml() + '</section>' +
      '<button type="button" class="zuruecksetzen">Spielstand zurücksetzen</button>';

    ansicht.querySelector(".zuruecksetzen").addEventListener("click", function () {
      if (window.confirm("Wirklich den gesamten Spielstand löschen?")) {
        spiel = leererStand();
        speichern();
        zeigeUebersicht();
      }
    });

    speichern();
    neu.forEach(function (n, i) { spaeter(function () { freischalten(n); }, 900 + i * 1800); });
  }

  function freischalten(n) {
    var r = I.raetsel[n - 1];
    var alt = ansicht.querySelector('.karte[data-nr="' + n + '"]');
    var pfeil = ansicht.querySelector('.pfeil[data-nach="' + n + '"]');
    if (!alt) return;
    if (pfeil) pfeil.classList.add("pfeil-frei", "pfeil-zeichnen");
    alt.classList.add("schloss-oeffnet");
    spaeter(function () {
      var neu = document.createElement("a");
      neu.href = "#raetsel/" + n;
      neu.className = "karte karte-auftritt " + (istGeloest(n) ? "karte-geloest" : "karte-offen");
      neu.setAttribute("data-nr", n);
      neu.innerHTML = alt.innerHTML;
      neu.querySelector(".karte-titel").textContent = r.titel;
      neu.querySelector(".karte-kurz").textContent = r.kurz;
      neu.querySelector(".karte-status").textContent = istGeloest(n) ? "Gelöst" : "Offen";
      alt.parentNode.replaceChild(neu, alt);
    }, 1100);
  }

  /* ---------- Raetsel 1 und 3 ---------- */

  function zerlegeChat(roh) {
    // Aufbau der Datei: Datumszeile, dann Nachrichten der Form ]X2[...]
    var tage = [];
    roh.split(/\r?\n/).forEach(function (zeile) {
      zeile.split("]").forEach(function (teil) {
        if (!teil) return;
        var m = /^([XY])2\[(.*)$/.exec(teil);
        if (m) {
          if (!tage.length) tage.push({ datum: "", nachrichten: [] });
          tage[tage.length - 1].nachrichten.push({ von: m[1], text: m[2] });
        } else {
          tage.push({ datum: teil, nachrichten: [] });
        }
      });
    });
    return tage;
  }

  function chatHtml() {
    var tage = zerlegeChat(window.CHAT_RAETSEL_1);
    return '<div class="chat" role="log" aria-label="Verschlüsselter Chatverlauf">' + tage.map(function (t) {
      return '<div class="chat-datum"><span>' + esc(t.datum) + '</span></div>' +
        t.nachrichten.map(function (n) {
          return '<div class="blase blase-' + n.von + '"><span class="blase-von">' + n.von + '</span><span class="blase-text">' + esc(n.text) + '</span></div>';
        }).join("");
    }).join("") + '</div>';
  }

  function logHtml(r) {
    return '<blockquote class="auszug"><p class="auszug-titel">Auszug aus dem IT-Sicherheitssystem</p><p>' + esc(r.auszug) + '</p></blockquote>' +
      '<div class="log-aufbau"><h2>Aufbau der Logdaten</h2><dl>' +
        r.aufbau.map(function (a) { return '<div><dt>' + esc(a[0]) + '</dt><dd>' + esc(a[1]) + '</dd></div>'; }).join("") +
      '</dl></div>' +
      '<div class="log" aria-label="Ausschnitt aus den Logdaten">' +
        '<div class="log-kopf">Logdaten.txt · Ausschnitt</div>' +
        '<pre>' + r.vorschau.map(esc).join("\n") + '</pre>' +
        '<div class="log-fuss">… insgesamt ' + r.anzahl + ' Einträge</div>' +
      '</div>';
  }

  function zeigeRaetsel(n) {
    var r = I.raetsel[n - 1];
    if (!r || !istFrei(n)) { location.replace("#uebersicht"); return; }
    if (r.art === "einstein") { zeigeEinstein(n, r); return; }

    var letztes = n === I.raetsel.length;
    var inhalt = r.art === "chat" ? chatHtml() : logHtml(r);
    var feld = r.mehrzeilig
      ? '<textarea id="loesung-feld" rows="9" autocomplete="off" spellcheck="false" aria-describedby="loesung-meldung"></textarea>'
      : '<input id="loesung-feld" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="loesung-meldung">';

    ansicht.className = "seite seite-raetsel";
    ansicht.innerHTML =
      '<div class="raetsel-spalte">' +
        '<p class="raetsel-marke">Rätsel ' + n + ' von ' + I.raetsel.length + '</p>' +
        '<h1>' + esc(r.titel) + '</h1>' +
        '<p class="raetsel-aufgabe">' + esc(r.aufgabe) + '</p>' +
        inhalt +
        downloadsHtml(r.downloads) +
        (r.hilfen || r.dateiTipp
          ? '<section class="tipps"><h2>Tipps</h2>' +
              (r.dateiTipp ? dateiTippHtml() : '') +
              (r.hilfen ? '<ol class="hilfen-liste r-hilfen"></ol>' : '') +
            '</section>'
          : '') +
        '<form class="loesung' + (r.mehrzeilig ? ' loesung-mehrzeilig' : '') + '" novalidate>' +
          '<label for="loesung-feld">' + esc(r.frage) + '</label>' +
          '<div class="loesung-zeile">' + feld + '<button type="submit">Prüfen</button></div>' +
          '<p id="loesung-meldung" class="meldung" role="status"></p>' +
        '</form>' +
        '<div class="geschafft" hidden>' +
          '<p class="geschafft-stempel">Gelöst</p>' +
          '<p class="geschafft-text">' + esc(r.erfolg) + '</p>' +
          (letztes
            ? '<a class="weiter-rot" href="#abschluss">Weiter zum Abschluss <span aria-hidden="true">→</span></a>'
            : '<a class="weiter-rot" href="#uebersicht">Zurück zur Übersicht <span aria-hidden="true">→</span></a>') +
        '</div>' +
      '</div>';

    var form = ansicht.querySelector(".loesung");
    var eingabe = ansicht.querySelector("#loesung-feld");
    var meldung = ansicht.querySelector("#loesung-meldung");
    var geschafft = ansicht.querySelector(".geschafft");
    var tippListe = ansicht.querySelector(".r-hilfen");

    function zeichneTipps(neu) {
      if (!tippListe) return;
      tippListe.innerHTML = hilfenHtml(r, hilfenOffen(n), istGeloest(n));
      if (neu !== undefined) {
        var el = tippListe.querySelector('[data-hilfe="' + neu + '"]');
        if (el) el.classList.add("hilfe-neu");
      }
    }

    function zeigeGeschafft() {
      form.hidden = true;
      geschafft.hidden = false;
      zeichneTipps();
    }

    zeichneTipps();
    if (istGeloest(n)) { zeigeGeschafft(); return; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!eingabe.value.trim()) { meldung.textContent = "Gebt zuerst eine Lösung ein."; return; }
      if (istRichtig(r, eingabe.value)) {
        alsGeloestMerken(n);
        zeigeGeschafft();
        geschafft.classList.add("auftritt");
      } else {
        var neu = naechsteHilfe(n, r);
        zeichneTipps(neu);
        meldung.textContent = "Das ist nicht die Lösung." + (neu !== undefined ? " Ein neuer Tipp ist freigeschaltet." : "");
        form.classList.remove("wackeln");
        void form.offsetWidth;
        form.classList.add("wackeln");
        eingabe.focus();
      }
    });
  }

  /* ---------- Raetsel 2: Einstein-Raetsel mit Lageplan ---------- */

  function zeigeEinstein(n, r) {
    var KAT = r.kategorien;
    var RAEUME = [1, 2, 3, 4, 5];
    var brett = spiel.brett2;
    var ausgewaehlt = null;
    var gezogen = null;
    var klickSperre = false;
    var fertig = istGeloest(n);

    function katVon(id) { return id.split(":")[0]; }
    function wertVon(id) { return id.slice(id.indexOf(":") + 1); }

    // Veraltete Eintraege (z. B. nach Textaenderungen) entfernen
    Object.keys(brett).forEach(function (id) {
      var k = KAT.filter(function (x) { return x.id === katVon(id); })[0];
      if (!k || k.werte.indexOf(wertVon(id)) === -1 || RAEUME.indexOf(brett[id]) === -1) delete brett[id];
    });

    function chipHtml(id) {
      return '<button type="button" class="chip chip-' + katVon(id) + (ausgewaehlt === id ? ' ausgewaehlt' : '') +
        '" data-chip="' + esc(id) + '" aria-pressed="' + (ausgewaehlt === id) + '">' + esc(wertVon(id)) + '</button>';
    }

    function imRaum(raum, katId) {
      return Object.keys(brett).filter(function (id) { return brett[id] === raum && katVon(id) === katId; })[0];
    }

    function planHtml() {
      return RAEUME.map(function (raum) {
        return '<div class="raum" data-raum="' + raum + '">' +
          '<button type="button" class="raum-kopf" data-ziel="' + raum + '">Büro ' + raum + '</button>' +
          '<div class="raum-slots">' + KAT.map(function (k) {
            var id = imRaum(raum, k.id);
            return '<div class="slot slot-' + k.id + '">' + (id ? chipHtml(id) : '<span class="slot-leer">' + esc(k.titel) + '</span>') + '</div>';
          }).join("") + '</div>' +
        '</div>';
      }).join("");
    }

    function vorratHtml() {
      return KAT.map(function (k) {
        var frei = k.werte.filter(function (w) { return !brett[k.id + ":" + w]; });
        return '<div class="vorrat-zeile"><span class="vorrat-titel">' + esc(k.titel) + '</span><div class="vorrat-chips">' +
          (frei.length ? frei.map(function (w) { return chipHtml(k.id + ":" + w); }).join("") : '<span class="vorrat-leer">alle verteilt</span>') +
          '</div></div>';
      }).join("");
    }

    ansicht.className = "seite seite-einstein";
    ansicht.innerHTML =
      '<div class="e-spalte">' +
        '<p class="e-marke">Rätsel ' + n + ' von ' + I.raetsel.length + '</p>' +
        '<h1>' + esc(r.titel) + '</h1>' +
        '<p class="e-aufgabe">' + esc(r.aufgabe) + '</p>' +
        '<div class="e-raster">' +
          '<section class="e-karte e-regeln"><h2>Die Ausgangslage</h2><ul>' + r.regeln.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul></section>' +
          '<section class="e-karte e-hinweise"><h2>Die Hinweise</h2><ol>' +
            r.hinweise.map(function (t) { return '<li><button type="button" class="hinweis" aria-pressed="false">' + esc(t) + '</button></li>'; }).join("") +
          '</ol><p class="e-klein">Tipp: Hinweise antippen, um sie abzuhaken.</p></section>' +
        '</div>' +
        '<section class="e-plan-bereich" aria-labelledby="plan-titel">' +
          '<h2 id="plan-titel">Lageplan</h2>' +
          '<p class="e-klein">Zieht die Eigenschaften in die Büros und wieder heraus. Oder: Eigenschaft antippen, dann ein Büro antippen.</p>' +
          '<div class="plan-scroll"><div class="plan-gebaeude"><div class="plan"></div><div class="flur">Flur</div></div></div>' +
        '</section>' +
        '<section class="e-vorrat" data-vorrat aria-label="Noch nicht verteilte Eigenschaften"></section>' +
        '<div class="e-aktionen">' +
          '<button type="button" class="e-pruefen">Zuteilung prüfen</button>' +
          '<button type="button" class="e-leeren">Lageplan leeren</button>' +
          '<p class="e-meldung" role="status"></p>' +
        '</div>' +
        '<div class="geschafft e-geschafft" hidden>' +
          '<p class="geschafft-stempel">Gelöst</p>' +
          '<p class="geschafft-text">' + esc(r.erfolg) + '</p>' +
          '<a class="e-weiter" href="#uebersicht">Zurück zur Übersicht <span aria-hidden="true">→</span></a>' +
        '</div>' +
        '<section class="e-hilfen"><h2>Lösungshilfen</h2><p class="e-klein">Nur nutzen, wenn ihr nicht weiterkommt. Jede falsche Abgabe schaltet eine weitere Hilfe frei.</p><ol class="hilfen-liste"></ol></section>' +
      '</div>';

    var plan = ansicht.querySelector(".plan");
    var vorrat = ansicht.querySelector("[data-vorrat]");
    var pruefen = ansicht.querySelector(".e-pruefen");
    var leeren = ansicht.querySelector(".e-leeren");
    var meldung = ansicht.querySelector(".e-meldung");
    var hilfen = ansicht.querySelector(".hilfen-liste");
    var geschafft = ansicht.querySelector(".e-geschafft");

    function zeichne() {
      plan.innerHTML = planHtml();
      vorrat.innerHTML = vorratHtml();
      var anzahl = Object.keys(brett).length;
      var gesamt = KAT.length * RAEUME.length;
      pruefen.disabled = fertig;
      pruefen.textContent = anzahl < gesamt ? "Zuteilung prüfen (" + anzahl + "/" + gesamt + ")" : "Zuteilung prüfen";
      ansicht.querySelector(".e-spalte").classList.toggle("e-fertig", fertig);
      ansicht.querySelector(".e-spalte").classList.toggle("e-auswahl", !!ausgewaehlt);
    }

    function zeichneHilfen(neu) {
      hilfen.innerHTML = hilfenHtml(r, hilfenOffen(n), fertig);
      if (neu !== undefined) {
        var el = hilfen.querySelector('[data-hilfe="' + neu + '"]');
        if (el) el.classList.add("hilfe-neu");
      }
    }

    function lege(id, raum) {
      if (fertig) return;
      if (raum) {
        var alt = imRaum(raum, katVon(id));
        if (alt && alt !== id) delete brett[alt];
        brett[id] = raum;
      } else {
        delete brett[id];
      }
      ausgewaehlt = null;
      meldung.textContent = "";
      speichern();
      zeichne();
    }

    // Antippen: Eigenschaft auswaehlen, dann Ziel antippen
    lauschen(ansicht, "click", function (e) {
      if (fertig || klickSperre) return;
      var chip = e.target.closest(".chip");
      if (chip && ansicht.contains(chip)) {
        var id = chip.getAttribute("data-chip");
        ausgewaehlt = ausgewaehlt === id ? null : id;
        zeichne();
        var neuerChip = ansicht.querySelector('.chip[data-chip="' + CSS.escape(id) + '"]');
        if (neuerChip) neuerChip.focus();
        return;
      }
      if (!ausgewaehlt) return;
      var raum = e.target.closest(".raum");
      if (raum) { lege(ausgewaehlt, parseInt(raum.getAttribute("data-raum"), 10)); return; }
      if (e.target.closest("[data-vorrat]")) lege(ausgewaehlt, null);
    });

    // Ziehen mit Maus, Stift oder Finger
    lauschen(ansicht, "pointerdown", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip || fertig || e.button !== 0) return;
      gezogen = { chip: chip, id: chip.getAttribute("data-chip"), x: e.clientX, y: e.clientY, geist: null, ziel: null };
    });

    function zielUnter(x, y) {
      var el = document.elementFromPoint(x, y);
      if (!el) return null;
      return el.closest(".raum") || el.closest("[data-vorrat]");
    }

    lauschen(document, "pointermove", function (e) {
      if (!gezogen) return;
      if (!gezogen.geist) {
        if (Math.abs(e.clientX - gezogen.x) + Math.abs(e.clientY - gezogen.y) < 6) return;
        var g = gezogen.chip.cloneNode(true);
        g.classList.add("chip-geist");
        g.classList.remove("ausgewaehlt");
        document.body.appendChild(g);
        gezogen.geist = g;
        gezogen.chip.classList.add("wird-gezogen");
        ansicht.querySelector(".e-spalte").classList.add("e-zieht");
      }
      e.preventDefault();
      var r2 = gezogen.geist.getBoundingClientRect();
      gezogen.geist.style.transform = "translate(" + (e.clientX - r2.width / 2) + "px," + (e.clientY - r2.height / 2) + "px)";
      var ziel = zielUnter(e.clientX, e.clientY);
      if (ziel !== gezogen.ziel) {
        if (gezogen.ziel) gezogen.ziel.classList.remove("ziel-aktiv");
        if (ziel) ziel.classList.add("ziel-aktiv");
        gezogen.ziel = ziel;
      }
    });

    function ziehenBeenden(e, abbrechen) {
      if (!gezogen) return;
      var g = gezogen;
      gezogen = null;
      if (!g.geist) return;
      g.geist.remove();
      ansicht.querySelector(".e-spalte").classList.remove("e-zieht");
      if (g.ziel) g.ziel.classList.remove("ziel-aktiv");
      klickSperre = true;
      setTimeout(function () { klickSperre = false; }, 0);
      if (abbrechen) { zeichne(); return; }
      var ziel = zielUnter(e.clientX, e.clientY);
      if (ziel && ziel.classList.contains("raum")) lege(g.id, parseInt(ziel.getAttribute("data-raum"), 10));
      else if (ziel) lege(g.id, null);
      else zeichne();
    }

    lauschen(document, "pointerup", function (e) { ziehenBeenden(e, false); });
    lauschen(document, "pointercancel", function (e) { ziehenBeenden(e, true); });
    aufraeumen.push(function () {
      var geist = document.querySelector(".chip-geist");
      if (geist) geist.remove();
    });

    // Hinweise abhaken
    ansicht.querySelectorAll(".hinweis").forEach(function (b) {
      b.addEventListener("click", function () {
        var an = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", an);
      });
    });

    leeren.addEventListener("click", function () {
      if (!Object.keys(brett).length || fertig) return;
      if (!window.confirm("Alle Eigenschaften aus dem Lageplan entfernen?")) return;
      Object.keys(brett).forEach(function (id) { delete brett[id]; });
      ausgewaehlt = null;
      speichern();
      zeichne();
    });

    pruefen.addEventListener("click", function () {
      var anzahl = Object.keys(brett).length;
      var gesamt = KAT.length * RAEUME.length;
      if (anzahl < gesamt && !window.confirm(
        "Der Lageplan ist noch nicht vollständig: " + anzahl + " von " + gesamt + " Feldern sind zugeteilt.\n\nTrotzdem abgeben?"
      )) return;
      var zeilen = RAEUME.map(function (raum) {
        return KAT.map(function (k) { return normText(wertVon(imRaum(raum, k.id) || "")); }).join("|");
      });
      if (r.loesungsHashes.indexOf(sha256(zeilen.join(";"))) !== -1) {
        fertig = true;
        alsGeloestMerken(n);
        zeichne();
        zeichneHilfen();
        meldung.textContent = "";
        geschafft.hidden = false;
        geschafft.classList.add("auftritt");
        geschafft.scrollIntoView({ block: "center", behavior: ruhig ? "auto" : "smooth" });
        return;
      }
      var neueHilfe = naechsteHilfe(n, r);
      zeichneHilfen(neueHilfe);
      meldung.textContent = "Die Zuteilung stimmt noch nicht." + (neueHilfe !== undefined ? " Eine neue Lösungshilfe ist freigeschaltet." : "");
      var aktionen = ansicht.querySelector(".e-aktionen");
      aktionen.classList.remove("wackeln");
      void aktionen.offsetWidth;
      aktionen.classList.add("wackeln");
    });

    zeichne();
    zeichneHilfen();
    if (fertig) geschafft.hidden = false;
  }

  /* ---------- Abschluss ---------- */

  // Palmwedel: zeigt nach rechts, Zacken an der Unterseite
  function wedel(x, y, winkel, groesse) {
    var spiegeln = winkel > 90 && winkel < 270 ? " scale(1,-1)" : "";
    return '<use href="#palmwedel" transform="translate(' + x + ' ' + y + ') rotate(' + winkel + ') scale(' + groesse + ')' + spiegeln + '"/>';
  }

  function krone(x, y, groesse, winkel) {
    return winkel.map(function (w) { return wedel(x, y, w, groesse); }).join("");
  }

  var STRAND =
    '<svg class="strand-bild" viewBox="0 0 2000 1125" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="s-himmel" x1="0" y1="0" x2="0" y2="680" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0" stop-color="#241640"/><stop offset=".3" stop-color="#5b2659"/><stop offset=".55" stop-color="#a8476a"/>' +
          '<stop offset=".75" stop-color="#e2735e"/><stop offset="1" stop-color="#fbbe6c"/>' +
        '</linearGradient>' +
        '<linearGradient id="s-meer" x1="0" y1="680" x2="0" y2="1125" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0" stop-color="#f2a368"/><stop offset=".35" stop-color="#c9686a"/><stop offset="1" stop-color="#6e2f63"/>' +
        '</linearGradient>' +
        '<radialGradient id="s-glut" cx="1000" cy="640" r="520" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0" stop-color="#ffd27e" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27e" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<path id="palmwedel" d="M0 0Q160-78 330 18L300 14L292 46L262 6L248 40L218 -2L204 32L174 -8L160 24L130 -10L116 18L88 -10L76 12L48 -8L38 8L14 -4Z"/>' +
      '</defs>' +
      '<rect width="2000" height="680" fill="url(#s-himmel)"/>' +
      '<rect width="2000" height="1125" fill="url(#s-glut)"/>' +
      '<g fill="#ffb7a6" opacity=".38">' +
        '<ellipse cx="440" cy="260" rx="270" ry="17"/><ellipse cx="590" cy="297" rx="180" ry="11"/>' +
        '<ellipse cx="1490" cy="208" rx="310" ry="20"/><ellipse cx="1355" cy="250" rx="175" ry="10"/>' +
        '<ellipse cx="1105" cy="396" rx="228" ry="9"/>' +
      '</g>' +
      '<circle cx="1000" cy="650" r="155" fill="#ffd788"/>' +
      '<rect y="678" width="2000" height="447" fill="url(#s-meer)"/>' +
      '<g stroke="#ffd788" stroke-width="5" stroke-linecap="round">' +
        '<path d="M878 692H1123M908 721H1092M857 750H1144M930 781H1071M888 815H1112M950 848H1049M908 882H1092"/>' +
      '</g>' +
      '<g stroke="#ffc59a" stroke-width="3" stroke-linecap="round" opacity=".55">' +
        '<path d="M330 731H476M586 834H706M1523 762H1708M1305 897H1456"/>' +
      '</g>' +
      '<path d="M1230 680Q1290 630 1380 624Q1430 606 1500 618Q1560 640 1593 680Z" fill="#3c1f47"/>' +
      '<path d="M1452 616Q1448 560 1458 520" stroke="#3c1f47" stroke-width="6" fill="none"/>' +
      '<g fill="#3c1f47">' + krone(1458, 518, .28, [195, 230, 300, 340, 20]) + '</g>' +
      '<g fill="none" stroke="#3a1f45" stroke-width="5" stroke-linecap="round">' +
        '<path d="M864 270q11-9 21 0q11-9 22 0M792 311q13-10 26 0q13-10 27 0M1198 345q11-9 22 0q11-9 23 0"/>' +
      '</g>' +
      '<path d="M0 940Q330 900 760 935Q1150 975 1460 990Q1760 1000 2000 925V1125H0Z" fill="#27142f"/>' +
      '<g fill="#1f0f26">' +
        '<path d="M212 1125Q262 720 452 398L478 412Q306 730 262 1125Z"/>' +
        krone(466, 404, 1.12, [196, 222, 250, 292, 318, 345, 18, 52, 118, 152]) +
        '<path d="M1782 1125Q1752 820 1650 532L1672 524Q1790 810 1810 1125Z"/>' +
        krone(1660, 528, .95, [200, 228, 262, 300, 330, 356, 28, 62, 120]) +
        '<path d="M1912 1125Q1925 960 1958 862L1972 868Q1945 965 1935 1125Z"/>' +
        krone(1963, 862, .5, [205, 240, 300, 335, 20, 60]) +
      '</g>' +
    '</svg>';

  function zeigeAbschluss() {
    if (!alleGeloest()) { location.replace("#uebersicht"); return; }
    zeigeSchritt(I.abschluss.start);
  }

  function zeigeSchritt(id) {
    var s = I.abschluss.schritte[id];
    if (!s) return;
    var art = s.art || "erzaehlung";
    var text = s.absaetze.map(function (a) { return '<p>' + esc(a) + '</p>'; }).join("");
    var aktionen = "";
    if (s.weiter) aktionen = '<button type="button" class="abschluss-weiter" data-ziel="' + esc(s.weiter.ziel) + '">' + esc(s.weiter.text) + ' <span aria-hidden="true">→</span></button>';
    if (s.wahl) aktionen = '<p class="abschluss-frage">' + esc(s.frage || "") + '</p><div class="abschluss-wahl">' +
      s.wahl.map(function (w) { return '<button type="button" class="wahl-knopf" data-ziel="' + esc(w.ziel) + '">' + esc(w.text) + '</button>'; }).join("") + '</div>';
    if (s.ende) aktionen = '<p class="abschluss-ende">Ende</p><a class="abschluss-zurueck" href="#uebersicht">Zurück zur Übersicht</a>';

    var inhalt;
    if (art === "zeitung") {
      inhalt =
        '<article class="zeitung">' +
          '<header class="zeitung-kopf"><p class="zeitung-name">' + esc(s.zeitung) + '</p>' +
          '<p class="zeitung-zeile"><span>' + esc(s.datum) + '</span><span>' + esc(s.ressort) + '</span></p></header>' +
          '<h1>' + esc(s.titel) + '</h1>' +
          '<p class="zeitung-unterzeile">' + esc(s.unterzeile) + '</p>' +
          '<div class="zeitung-text">' + text + '</div>' +
        '</article>' +
        '<div class="abschluss-aktionen">' + aktionen + '</div>';
    } else {
      inhalt =
        (art === "strand" ? STRAND : '') +
        '<div class="abschluss-karte">' +
          '<p class="abschluss-marke">' + esc(s.marke || "") + '</p>' +
          '<h1>' + esc(s.titel) + '</h1>' +
          text +
          (s.zitat ? '<blockquote class="abschluss-zitat">' + esc(s.zitat) + '</blockquote>' : '') +
          '<div class="abschluss-aktionen">' + aktionen + '</div>' +
        '</div>';
    }

    ansicht.className = "seite seite-abschluss abschluss-" + art;
    ansicht.innerHTML = inhalt;
    document.body.setAttribute("data-seite", "abschluss-" + art);
    window.scrollTo(0, 0);
    ansicht.querySelectorAll("[data-ziel]").forEach(function (b) {
      b.addEventListener("click", function () { zeigeSchritt(b.getAttribute("data-ziel")); });
    });
    var erster = ansicht.querySelector("h1");
    if (erster) { erster.setAttribute("tabindex", "-1"); erster.focus({ preventScroll: true }); }
  }

  /* ---------- Navigation ---------- */

  // Seite, zu der das Schließen-Kreuz der Fallakte zurückführt
  var letzteSeite = "#uebersicht";

  function route() {
    seitenwechselAufraeumen();
    if (dialog.open) dialog.close();
    var h = location.hash.replace(/^#/, "") || "start";
    if (h !== "akte") letzteSeite = "#" + h;
    var m = /^raetsel\/(\d+)$/.exec(h);
    document.body.setAttribute("data-seite", h.replace("/", "-"));
    window.scrollTo(0, 0);
    if (h === "akte") zeigeAkte();
    else if (h === "uebersicht") zeigeUebersicht();
    else if (h === "abschluss") zeigeAbschluss();
    else if (m) zeigeRaetsel(parseInt(m[1], 10));
    else { document.body.setAttribute("data-seite", "start"); zeigeStart(); }
    if (h !== "abschluss") ansicht.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", route);
  route();
})();

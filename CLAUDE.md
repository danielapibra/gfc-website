# Golden Fight Club (GFC) — Duitama, Boyacá, Kolumbien

Inhaberin: Daniela. Boxgym-Website, ausgeliefert über GitHub Pages direkt
aus Branch `main`.

## Sprache

- Website: Spanisch
- Gespräch mit dem Nutzer: Deutsch
- Code-Kommentare: Deutsch

## Technische Leitplanken — nicht ohne Rücksprache abweichen

- Kein Build-Schritt. Kein npm, kein Bundler, kein Framework. Was im Repo
  liegt, wird exakt so ausgeliefert.
- Eine Seite. `index.html` bleibt die Hauptseite; neue Bereiche als
  `<section>` mit Kommentar-Überschrift ergänzen, keine neuen Dateien.
- Farben und Schriften ausschließlich über die Design-Tokens in `:root`
  (`assets/css/styles.css`, Abschnitt 1). Keine Hex-Werte irgendwo sonst
  — Ausnahme: einmalige, klar kommentierte Sonderfälle wie die
  WhatsApp-Markenfarbe im Floating-Button (`.fab`), die kein Teil des
  GFC-Designsystems ist.
- Barrierefreiheit: semantisches HTML, sichtbarer Fokus, Kontrast >= 4.5:1
  für Text, `prefers-reduced-motion` respektieren (inkl. Video-Autoplay —
  kein natives `autoplay`-Attribut, Wiedergabe wird per JS nur bei nicht
  reduzierter Bewegung gestartet).
- Bei CSS Grid immer `minmax(0, 1fr)` statt bloßem `1fr` — sonst bricht das
  Layout auf dem Handy.
- `styles.css` und `script.js` werden in `index.html` mit `?v=N` verlinkt.
  Nach jeder Änderung an diesen Dateien N hochzählen -- sonst liefern
  Browser (und GitHub Pages) noch tagelang die alte Version aus. Genau das
  hat einmal so ausgesehen, als sei ein Fix nicht angekommen.
- Bilder vor dem Commit komprimieren, als `.webp` ablegen, Ziel < 300 KB.
  Videos bleiben `.mp4`, möglichst < 3 MB.
- Keine Tokens, Passwörter oder privaten Mitgliederdaten im Repo.

## Marke

Das tatsächliche, aktuelle Design ist dunkel mit Gold **und einem
Lila-Akzent** — nicht die reine Gold/Schwarz-Palette aus einer früheren
Planungsphase. Diese Sektion beschreibt bewusst die IST-Optik.

- Basis: `--ink #0b0b0d` (Hintergrund), `--panel #18181c` /
  `--panel-2 #1f1f24` (Karten), `--bone #f3eee2` (Haupttext hell),
  `--ash #a6a2ad` / `--ash-dim #82808a` (Sekundärtext).
- Gold: `--gold #cda45c`, `--gold-2 #e4c377`, `--gold-deep #8a6a30`.
- Lila-Akzent (bewusst, kein Fehler): `--purple #6d28d9`,
  `--purple-2 #4c1d95` — für Rahmen, Hintergründe, Badges, Glow-Effekte.
  Für **Text** ausschließlich `--purple-text #9d76ea` verwenden: reines
  `--purple`/`--purple-2` fällt auf `--ink`/`--panel` unter 4.5:1 Kontrast
  (z. B. `--purple-2` auf `--panel` nur 1.6:1).
- Schriften: **Anton** (Display/Headlines, versal), Oswald (Labels/
  Eyebrows, versal), Inter (Fließtext).
- Wiederkehrendes Formmotiv: abgeschrägte "Notch"-Ecke (`--notch` in
  Abschnitt 1), lehnt sich an die Diagonale im Logo an — bei neuen
  Buttons/Badges/Karten mitdenken statt einfacher `border-radius`.
- Tonalität: direkt, kurze Sätze, kein Marketing-Sprech.
- Jede Sektion hat ein Eyebrow-Label ("Round 01", "Round 02", ...) und
  einen zweifarbigen Section-Title (`.round-title` mit `.ghost` + `.fg`).
- Ausnahme vom Designsystem: Der WhatsApp-Floating-Button (`.fab`) nutzt
  das offizielle WhatsApp-Grün — das ist eine fremde Markenfarbe, bewusst
  nicht durch GFC-Tokens ersetzt.

## Navigation

Es gibt **keine waagerechte Menüleiste** mehr. Neun Einträge nebeneinander
wirkten in der Kopfzeile überladen, deshalb liegt die komplette Navigation
auf jeder Bildschirmgröße hinter dem Menü-Button (`#mobileMenu`, trotz des
Klassennamens auch auf dem Desktop). Oben stehen nur Logo, WhatsApp-Button
und der Menü-Button. Auf breiten Schirmen öffnet das Menü zweispaltig.
Neue Bereiche dort **und** im Footer verlinken.

## Struktur

```
index.html
assets/
  css/styles.css   -- Abschnitt 1 = Design-Tokens
  js/script.js     -- Rundenuhr, Live-Status, Menü, Karussells, Tabs, Lightbox
  img/             -- .webp, < 300 KB
  video/           -- nosotros.mp4 (Karussell), espacios.mp4 (Galería)
```

### Bereiche auf der Seite (in dieser Reihenfolge)

1. Hero mit Live-Rundenuhr (`#roundTimer`) und Live-Status-Badge
   (offen/geschlossen). Rechnet über `horaColombia()` in `script.js`
   **immer nach der Uhr in Duitama**, nie nach der des Geräts -- sonst
   sähe jemand im Ausland "abierto ahora", während das Gym zu hat.
   Kolumbien liegt fest auf UTC-5 ohne Sommerzeit.
2. Laufendes Ticker-Band + Valores-Marquee (dekorativ, `aria-hidden`)
3. **Nosotros** (`#nosotros`) — Historia-Text + Karussell mit 3 Fotos
   und 1 Video als viertem Slide (`#historyTrack`). Reihenfolge: Fassade
   ("Nuestra casa"), Sparring, Comunidad, Video.
4. **Entrenamientos** (`#entrenamientos`) — vier Karten (Boxeo,
   Acondicionamiento, Competencia, Entrenamiento libre) unter dem Titel
   "Encuentra tu ritmo". Inhalt kommt aus einem Entwurf von Daniela.
5. Horarios (`#horarios`) — Live-Status-Karte + Wochenplan.
   **Echte Zeiten: Mo–Fr 6–10 Uhr und 15–20 Uhr, Sa+So 8–11 Uhr,
   Feiertage geschlossen.** Stehen an zwei Stellen und müssen zusammen
   geändert werden: als Text in `index.html` (`.schedule-row`) und als
   Zahlen in `getWindows()` in `script.js` — **und ein drittes Mal** als
   Fließtext in der Ubicación-Karte. Alle drei zusammen ändern, sonst
   widersprechen sich die Angaben (genau das war einmal wochenlang der
   Fall: Sa+So standen dort noch bis 23 Uhr).
6. **Clases grupales** (`#clases`, früher "Eventos") — fester Stundenplan
   der geführten Klassen: Mo-Fr 6:00 Funcional, 7:00 Boxeo, 17:00 Boxeo,
   18:00 Funcional, 19:00 Boxeo; Sa+So 8:00 Funcional, 9:00 Boxeo. Farbcode: Gold = Boxeo, Lila = Funcional.
   Darunter der Block "Clases especiales y eventos" für Ankündigungen --
   Zum Ankündigen eine `.event-card` einhängen (Kommentar steht über der
   Sektion in `index.html`); steht nichts an, kommt der Leer-Hinweis
   `.avisos-vacio` zurück. Erfundene Termine gibt es hier bewusst nicht.
   **Termine verfallen von selbst**: `data-hasta` am Element, immer mit
   fester Zeitzone Kolumbien (`-05:00`) -- ohne die liest jeder Browser
   die Uhrzeit als seine eigene Ortszeit. Ist der Zeitpunkt vorbei,
   entfernt `script.js` Karte und Ankündigungsleiste und blendet den
   Leer-Hinweis (`[data-vacio]`) ein. Aufräumen ist trotzdem sinnvoll,
   aber nicht mehr dringend. Aktuell steht
   dort die Jornada de sparring vom Freitag, 4.9.2026, 16:30 Uhr ($5.000).
   Derselbe Termin steht zusätzlich in der goldenen Ankündigungsleiste
   unter der Kopfzeile (`.aviso-barra`, direkt hinter `</header>`): fest
   statt mitlaufend, weil ein Datum lesbar sein muss, ohne dass man auf
   das Laufband wartet. Das X blendet sie nur bis zum nächsten Seitenaufruf
   aus -- **bewusst ohne Gedächtnis**: erst merkte sie sich das Wegklicken
   dauerhaft (localStorage), aber Daniela will, dass der Termin bei jedem
   Besuch wieder auftaucht. Beim Entfernen des Termins beide Stellen
   zurückbauen (Kommentare stehen jeweils darüber in `index.html`).
7. Planes (`#planes`) — Tabs (Membresías/Promos/Clases), **echte
   Preise** ($100.000 / $150.000 pro Monat, Stand siehe Git-Historie —
   bei Änderung durch Daniela hier direkt in `index.html` anpassen)
8. Equipo (`#equipo`) — **auf Wunsch von Daniela ausgeblendet**. Der
   fertige Abschnitt (echtes Team: Camilo, Juan, Natalia, Salomé) steckt
   in `index.html` in einem `<template id="equipoOculto">` -- so bleibt er
   erhalten, wird aber weder gerendert noch vorgelesen. Ein HTML-Kommentar
   taugt dafür nicht: Bindestriche im Markup beenden ihn vorzeitig.
   Zurückholen: template-Tag entfernen, Menü- und Footer-Eintrag wieder
   einsetzen, Round-Nummern ab Galería um eins hochzählen.
9. Galería (`#galeria`) — 1 Video + 5 Fotos, darunter zwei vom Aufbau des
   Gyms. Bewusste Regeln von Daniela: **keine Fotos mit Kindern** und
   **keine Motive, die schon im Nosotros-Karussell laufen** (Sparring,
   Fassade, Presentación im Ring).
   - Erste Kachel ist der Rundgang (`assets/video/espacios.mp4`,
     `.gallery-tile.feature` mit `data-video`), belegt einen 2x2-Block.
     Dahinter zwei `.tall` (je 1x2), eine `.wide` (2x1) und zwei einfache:
     4+2+2+2+1+1 = 12 Rasterfelder — geht bei 4, 3 und 2 Spalten glatt
     auf. Wer Kacheln hinzufügt oder entfernt, muss diese Rechnung neu
     aufmachen, sonst entstehen Löcher im Raster.
   - Fotos in `assets/img/galeria-1/-4/-6/-7/-8.webp` (die Nummern 2, 3
     und 5 hat Daniela aussortiert), Poster des Videos in
     `galeria-video-poster.webp`.
   - Klick öffnet die Lightbox — dort per Pfeilbutton, Pfeiltaste oder
     Wischgeste durchblättern, Escape schließt. Die Video-Kachel öffnet
     einen echten Player mit Bedienleiste; beim Schließen wird der Inhalt
     geleert, sonst läuft der Ton unsichtbar weiter.
10. Reseñas (`#resenas`) — **keine Zitate auf der Seite**. Es gibt erst
    zwei echte Google-Bewertungen; erfundene Beispiele wirkten unglaub-
    würdig. Stattdessen zwei Buttons auf Danielas Google-Profil
    (`https://share.google/4BZ4WOa6u5VgfICZA`): ansehen und selbst
    schreiben. Google-Bewertungen automatisch einzubinden geht hier
    nicht -- die Places API bräuchte einen Schlüssel, der im offenen
    Repo läge, kostet Geld und liefert nur 5 Bewertungen. Kommen genug
    echte zusammen: Zitat-Karussell aus Commit ff39d61 zurückholen.
11. Ubicación (`#ubicacion`) — echte Adresse, WhatsApp, Instagram,
    eingebettete Google-Maps-Karte (kein API-Key nötig, nur `?q=...&output=embed`)

## Arbeitsweise

- Vor jedem Push: Seite lokal rendern (`python3 -m http.server 8000`) und
  in Desktop- UND Handybreite per Screenshot prüfen.
- Commit-Nachrichten auf Deutsch, sprechend.
- Die Original-Fotos (Kamera-JPEGs, 5-20 MB) liegen bewusst außerhalb des
  Repos unter `~/Desktop/Golden Fight Club/Fotos`. Für die Website mit
  Pillow auf 1400 px lange Kante verkleinern und als WebP q82 speichern
  (`python3` + `PIL`) -- ergibt 35-90 KB pro Bild. `sips` kann kein WebP
  schreiben, `cwebp`/ImageMagick sind nicht installiert.
- Videos: auf dem Rechner ist **kein ffmpeg**. `avconvert` (Bordmittel)
  kennt nur Presets und trifft die Zielgröße nicht -- aus dem 237-MB-4K-
  Original wurden damit entweder 32 MB oder 1 MB. Dafür liegt ein kleines
  Swift-Werkzeug unter `~/Desktop/Golden Fight Club/vidtool.swift`
  (`swiftc -O -o vidtool vidtool.swift`), das Bitrate und Höhe direkt
  setzt und ein Poster-Bild zieht:
  `./vidtool --in gross.mov --out klein.mp4 --maxHeight 960 --bitrate 380000 --audioBitrate 48000 --poster poster.jpg --posterAt 1`
  Ergebnis für `espacios.mp4`: 540x960, 2,8 MB aus 237 MB. Wichtig im
  Werkzeug: Video- und Tonspur **abwechselnd** füttern -- füllt man erst
  die Videospur komplett, blockiert der Writer und wartet ewig auf Ton.
- Vor dem ersten Push in einer neuen Session einmal fragen, ob es losgehen
  darf. Danach eigenständig pushen.

## Offene Punkte

- Logo als Vektor (SVG) statt PNG→WebP-Export
- Eigene Domain verbinden
- Kontaktformular (GitHub Pages kann das nicht selbst)
- Preise (Planes) regelmäßig mit Daniela abgleichen, falls sie sich ändern

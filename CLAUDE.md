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

## Struktur

```
index.html
assets/
  css/styles.css   -- Abschnitt 1 = Design-Tokens
  js/script.js     -- Rundenuhr, Live-Status, Menü, Karussells, Tabs, Lightbox
  img/             -- .webp, < 300 KB
  video/           -- Nosotros-Karussell, 4. Slide
```

### Bereiche auf der Seite (in dieser Reihenfolge)

1. Hero mit Live-Rundenuhr (`#roundTimer`) und Live-Status-Badge
   (offen/geschlossen, aus Gerätezeit berechnet, `script.js`)
2. Laufendes Ticker-Band + Valores-Marquee (dekorativ, `aria-hidden`)
3. **Nosotros** (`#nosotros`) — Historia-Text + Karussell mit 3 Fotos
   und 1 Video als viertem Slide (`#historyTrack`)
4. Horarios (`#horarios`) — Live-Status-Karte + Wochenplan
5. Planes (`#planes`) — Tabs (Membresías/Promos/Clases), **echte
   Preise** ($100.000 / $150.000 pro Monat, Stand siehe Git-Historie —
   bei Änderung durch Daniela hier direkt in `index.html` anpassen)
6. Equipo (`#equipo`) — echtes Team (Camilo, Juan, Natalia, Salomé)
7. Galería (`#galeria`) — Platzhalter-Kacheln, erwarten
   `fotos/galeria-1.jpg` … `galeria-6.jpg` (noch nicht im Repo)
8. Eventos (`#eventos`) — als Beispiel gekennzeichnet
   (`.placeholder-flag`), Daten sind erfunden
9. Reseñas (`#resenas`) — als Beispiel gekennzeichnet, Zitate sind erfunden
10. Ubicación (`#ubicacion`) — echte Adresse, WhatsApp, Instagram,
    eingebettete Google-Maps-Karte (kein API-Key nötig, nur `?q=...&output=embed`)

## Arbeitsweise

- Vor jedem Push: Seite lokal rendern (`python3 -m http.server 8000`) und
  in Desktop- UND Handybreite per Screenshot prüfen.
- Commit-Nachrichten auf Deutsch, sprechend.
- Vor dem ersten Push in einer neuen Session einmal fragen, ob es losgehen
  darf. Danach eigenständig pushen.

## Offene Punkte

- Galería: echte Fotos statt Platzhalter-Kacheln (`fotos/galeria-*.jpg`
  fehlen aktuell komplett im Repo)
- Eventos: echte Termine statt Beispieldaten
- Reseñas: echte Kundenstimmen statt Beispiel-Zitate
- Logo als Vektor (SVG) statt PNG→WebP-Export
- Eigene Domain verbinden
- Kontaktformular (GitHub Pages kann das nicht selbst)
- Preise (Planes) regelmäßig mit Daniela abgleichen, falls sie sich ändern

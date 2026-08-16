# baustelle

Werkzeuge für die Kolonne und die persönliche Startseite jedes Mitarbeiters.
Kein Login, kein Firmen-Account, keine App aus dem Store.

**Öffentlich auf GitHub Pages**, `baustelle.ichbindeinmaler.de`. Das ist
bewusst so: Ein Login vor einem QR-Scan auf der Baustelle ist nicht zumutbar.
Geschützt wird nicht die Seite, sondern die Daten – n8n prüft bei jedem
schreibenden Aufruf den Token, nicht der Browser.

Tools mit echten Kundendaten oder Zahlen (Controlling, Wiedervorlage) liegen
dagegen im privaten `buero`-Repo hinter Cloudflare Access. `index.html`
verlinkt nur dorthin – die Prüfung, wer rein darf, macht das Ziel selbst.

## Zwei Wege, wie ein Aufruf hier ankommt

**Persönlich, über `index.html`.** Jeder Mitarbeiter bekommt einmal per
WhatsApp seinen Link: `index.html?m=k7f3`. Der Token landet in localStorage,
n8n schlägt ihn in NocoDB nach, zurück kommen `vorname` und `rolle` – daraus
baut sich die persönliche Startseite mit Gruß, Einsatzkarte und den Kacheln,
die zur Rolle passen. Ab dem zweiten Aufruf reicht der nackte Link.

**Ortsbezogen, direkt in ein Tool.** Manche Tools – Protokoll, Gerätecheck,
Baustellendoku – gehören zu einer konkreten Baustelle, nicht nur zu einer
Person. Die tragen zusätzlich Baustellen-Infos in der URL:

```
protokoll.html?b=2026-041&bn=Schulstraße%2012&t=TOKEN
```

| Parameter | Bedeutung |
|---|---|
| `b`  | Baustellen-ID |
| `bn` | Klartextname der Baustelle, nur für die Anzeige |
| `t`  | persönlicher Token des Mitarbeiters |

Auch die landen in localStorage. Woher `b`/`bn` kommen: entweder ein
QR-Code, der an der Baustelle hängt, oder – sobald gebaut – ein Sprung aus
der Einsatzkarte auf `index.html` heraus, die ja schon weiß, wo jemand heute
ist. Das ist noch offen, siehe unten.

Kein Passwort, keine Session im klassischen Sinn. Der Token ist der
Schlüssel. Wer ihn hat, sieht die Oberfläche der Person, der er gehört –
das ist eine bewusste Grenze, kein Zufall.

## Wo was liegt

| Ebene | Ort | Ändert sich |
|---|---|---|
| Welche Kacheln es gibt, wer sie sieht | `index.html`, Konstante `KACHELN` | selten – Commit |
| Wer ist wer, welche Rolle | NocoDB-Tabelle `mitarbeiter` | laufend – kein Commit |
| Token → Person | n8n-Workflow, Zweig `mitarbeiter_laden` | selten |
| Wer heute wo eingeteilt ist | NocoDB-Tabelle `einsatzplan` | täglich, über Kapazitätstool |

Neuer Mitarbeiter heißt: Zeile in `mitarbeiter` anlegen, Token vergeben,
fertig. Kein Deploy nötig.

## Mitarbeiter-Tabelle (NocoDB)

- `vorname`, `nachname`, `spitzname` – angezeigt wird `spitzname`, fällt
  zurück auf `vorname`, wenn leer
- `rolle` – `geselle` / `vorarbeiter` / `meister` / `inhaber` / `buero`
- `token` – 6 Zeichen, ohne `l 1 o 0 i`, einmalig pro Person
- `aktiv` – Checkbox, im Filter noch nicht scharf geschaltet

## Neue Kachel hinzufügen

In `index.html`, Konstante `KACHELN`, einen Eintrag ergänzen:

```js
{ gruppe:'baustelle', datei:'neues-tool.html', icon:'liste',
  name:'Anzeigename', text:'Kurzer Untertext',
  rollen:['geselle','vorarbeiter'] }
```

`icon` muss ein Schlüssel aus `ICONS` sein. `marke` ist optional
(`offen` / `geplant` / `schutz`) für einen kleinen Hinweis-Chip – entspricht
dem, was in einem früheren Entwurf `zustand` hieß (`laeuft`/`arbeit`/`geplant`).

## Was hier nie hineingehört

- **Dateinamen ändern.** Sobald QR-Codes auf Geräten oder Fahrzeugen kleben,
  zeigen sie auf einen Dateinamen. Neuer Name = Aufkleber neu drucken.
  Inhalte dürfen sich beliebig ändern, Adressen nicht.
- **NocoDB-API-Token.** Das Repo ist öffentlich lesbar. Alle Aufrufe laufen
  über n8n, nie direkt an die Datenbank.
- **Zeiterfassung.** Sobald Arbeitsstunden erfasst werden, ist es
  GoBD-relevant und gehört nach WinWorker, nicht hierhin.

## Aktueller Stand

- [x] `index.html` – persönliche Startseite, Rollenlogik, Zeitgruß
- [x] Einsatzkarte (Heute/Morgen, manueller Umschalter)
- [x] n8n `mitarbeiter_laden` – läuft
- [x] Token-Feld in NocoDB angelegt
- [ ] Tokens für alle Mitarbeiter vergeben
- [ ] Allowed Origins im Webhook-Node von `*` auf
      `https://baustelle.ichbindeinmaler.de` einschränken
- [ ] n8n `einsatzplan_laden` / `einsatzplan_speichern` (Kapazitätstool)
- [ ] n8n `einsatzplan_tage` (Einsatzkarte mit echten Daten)
- [ ] Baustellen-ID in die Einsatzkarte holen, damit sie beim Klick auf
      Protokoll & Co. `?b=` mitgeben kann statt nur Klartext-Ort
- [ ] Dateinamen der einzelnen Tools festlegen und im Katalog abgleichen
      (aktuell geraten: `checkin.html`, `protokoll.html`, `geraetecheck.html`,
      `baustellendoku.html`)
- [ ] Erste echte Kachel dahinter (Kandidat: Gerätecheck oder Protokoll)

## Technik

- Self-contained HTML, kein Build-Prozess, kein Framework
- Logo als Base64 eingebettet
- n8n: `https://n8n.ichbindeinmaler.de` (Tunnel steht)
- NocoDB: nur intern, n8n greift darauf zu – nicht die Browser-Seite

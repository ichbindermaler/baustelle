# baustelle

Werkzeuge für die Kolonne. Werden per QR-Code auf dem Handy geöffnet.

**Öffentlich auf GitHub Pages.** Läuft unter `baustelle.ichbindeinmaler.de`.
Das ist bewusst so: Ein Login vor einem QR-Scan auf der Baustelle ist
nicht zumutbar. Geschützt wird nicht die Seite, sondern die Daten —
n8n prüft bei jedem Aufruf den Token.

---

## Wie ein Mitarbeiter hierher kommt

```
baustelle.ichbindeinmaler.de/protokoll.html?b=2026-041&bn=Schulstraße%2012&t=TOKEN
```

| Parameter | Bedeutung |
|---|---|
| `b`  | Baustellen-ID |
| `bn` | Klartextname der Baustelle, nur für die Anzeige |
| `t`  | persönlicher Token des Mitarbeiters |

Alle drei landen im localStorage. Beim zweiten Aufruf reicht die nackte
URL, das Handy weiß Bescheid.

Token stehen in NocoDB in der Tabelle `mitarbeiter`. Wer ausscheidet,
wird dort deaktiviert — es muss kein Aufkleber angefasst werden.

---

## Dateien

| Datei | Zweck | Zustand |
|---|---|---|
| `index.html` | Startseite, zeigt nur was wirklich läuft | läuft |
| `protokoll.html` | Leistungen, Material, Fotos, Bemerkung | wartet auf n8n |
| `geraetecheck.html` | Gerätezustand nach QR-Scan | geplant |
| `baustellendoku.html` | Fotos vor / während / nach | geplant |
| `checkin.html` | An- und Abmelden | geplant |

---

## Wenn ich hier etwas ändere

Ganz oben in jeder Datei steht ein Block mit `WEBHOOK_URL`,
`BETRIEB_ID` und Listen wie `TAETIGKEITEN`. **Das ist alles, was zum
Umstellen angefasst werden muss.** Der Rest darunter ist Technik.

In `index.html` steuert das Feld `zustand` je Werkzeug, ob die Kachel
erscheint: `laeuft` wird angezeigt, `arbeit` und `geplant` bleiben für
Mitarbeiter unsichtbar. Ein Werkzeug freischalten = ein Wort ändern.

---

## Was hier nie hineingehört

- **Dateinamen ändern.** Sie stecken in gedruckten QR-Codes auf Geräten
  und Fahrzeugen. Neuer Name = Aufkleber neu drucken. Inhalte dürfen
  sich beliebig ändern, Adressen nicht.
- **NocoDB-API-Token.** Das Repo ist öffentlich lesbar. Alle Aufrufe
  gehen über n8n, nie direkt an die Datenbank.
- **Zeiterfassung.** Sobald Arbeitsstunden erfasst werden, ist es
  GoBD-relevant und gehört nach WinWorker.

---

## Offen

- n8n läuft noch nicht — `WEBHOOK_URL` ist überall Platzhalter
- Solange der Platzhalter steht, sammeln die Formulare Einträge im
  Handyspeicher und senden automatisch nach, sobald die echte URL drin ist
- LV-Positionen sollen die feste Tätigkeitsliste ersetzen
  (blockiert: WinWorker-Exportformat unklar)

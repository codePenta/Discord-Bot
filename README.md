# Discord-Bot

Persönlicher Discord-Bot, gebaut mit [Bun](https://bun.sh) und [discord.js](https://discord.js.org),
nach SOLID-Prinzipien und einer modularen Feature-Architektur.

## Architektur

Jede Fähigkeit des Bots lebt als eigenständiges Modul unter `src/modules/<name>/`,
mit einer eigenen internen Struktur:

```
src/modules/<name>/
├── entities/    # reine Datentypen
├── services/    # Geschäftslogik, unabhängig von discord.js/DB
├── infra/       # Repository-Implementierungen (z.B. MariaDB)
├── commands/    # Slash-Commands des Moduls
└── index.ts     # createXModule(), fügt alles zusammen
```

`bot.ts` bleibt als Composition Root unabhängig von der Anzahl der Module schlank:
Jedes Modul wird dort einmal instanziiert und seine Commands sowie Event-Handler
registriert.

**Verwendete Muster:**
- **Command-Pattern + Registry** für Slash-Commands (`core/commands`, `core/services/CommandRegistry`)
- **Repository-Pattern** für Datenzugriff (`IxRepository` → `MariaDbXRepository`), damit sich der
  Speicher-Backend austauschen lässt, ohne Services oder Commands anzufassen
- **Auto-Deploy:** `CommandDeployer` registriert Commands bei Discord nur neu, wenn sich ihr Hash
  geändert hat (`.commands-hash`)

## Module

- **welcome** – sendet eine konfigurierbare Willkommensnachricht bei neuen Mitgliedern
  (`/welcome set`, `/welcome off`, `/welcome test`)
<!-- - **calendar-presence** – reaktiver Status-Antworter auf Basis von Google Calendar (`/busy`, `/back`) -->

## Setup

### Voraussetzungen

- [Bun](https://bun.sh) ≥ 1.x
- Eine MariaDB-Instanz (lokal oder per NAS/Docker erreichbar)
- Ein registrierter Bot im [Discord Developer Portal](https://discord.com/developers/applications)

### Umgebungsvariablen

Kopiere `.env.example` nach `.env.local` und trage die Werte ein:

| Variable | Beschreibung |
|---|---|
| `DISCORD_TOKEN` | Bot-Token aus dem Developer Portal |
| `DISCORD_CLIENT_ID` | Application-ID |
| `DISCORD_GUILD_ID` | Server-ID für Guild-Command-Deploy (optional, sonst global) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MariaDB-Zugangsdaten |

### Discord Developer Portal

Je nach genutzten Modulen müssen privilegierte Intents aktiviert sein:

- **Server Members Intent** – benötigt für `welcome` (Event `GuildMemberAdd`)
- **Message Content Intent** – benötigt, falls ein Modul auf Nachrichteninhalte reagiert

### Datenbank

Die Tabellen der einzelnen Module liegen als `schema.sql` im jeweiligen Modulordner
(z.B. `src/modules/welcome/schema.sql`) und müssen einmalig gegen die MariaDB ausgeführt werden.

### Lokal starten

```bash
bun install
bun run bot.ts
```

### Mit Docker

```bash
docker compose up -d --build
```

Der Bot läuft dann im Docker-Netzwerk `mariadb-default`. Dieses Netzwerk muss bereits existieren
und die MariaDB-Instanz enthalten (`docker network create mariadb-default`, falls noch nicht vorhanden).
Innerhalb des Netzwerks wird die Datenbank über ihren Container-Namen als `DB_HOST` erreicht,
nicht über eine externe IP oder einen gemappten Port.

## Neues Modul hinzufügen

1. Ordner `src/modules/<name>/` nach obigem Schema anlegen
2. `createXModule()` implementieren, das Commands und ggf. Event-Handler zurückgibt
3. In `bot.ts` instanziieren und die Commands bei der `CommandRegistry` registrieren
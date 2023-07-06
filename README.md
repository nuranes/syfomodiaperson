# Syfomodiaperson

Frontend i Modia for en bruker sin sykefraværsoppfølging

## TL;DR

React-app for oversikt med all informasjon om en gitt person sitt sykefravaer i Modia for syfoveiledere.
Node-app som kjører på Naiserator, og bygges med GitHub Actions

## Kjøre lokalt

Applikasjonen har en mock som kan brukes lokalt. Her mockes diverse endepunkter, dog ikke alle.

Du må ha Node v18 og npm v9 installert.

- For å kjøre koden lokalt:
  - `$ npm install --legacy-peer-deps`
  - `$ npm start`
  - Eventuelt kan komandoene kjøres fra `package.json` i intellij.
- Kjør tester med `npm test` eller `npm test:watch`
- Lint JS-kode med `npm run lint` eller `npm run lint:fix`

Appen nås på [http://localhost:8080/sykefravaer](http://localhost:8080/sykefravaer)

Ved første kjøring:

```sh
$ cp .env.template .env # for å sette opp lokale miljøvariabler
$ npm install --legacy-peer-deps # installerer avhengigheter
```

## Redis Cache

Brukes for å cache bruker-sessions. Nais-oppsettet ligger i `redis.yaml`.
Redis pod deployes automatisk ved endringer i workflow eller config i master, men kan også deployes manuelt i NAIS ved å kjøre følgdende kommando: `kubectl apply -f .nais/redis.yaml`.

## Logger

- Feil-logger: https://sentry.gc.nav.no/nav/syfomodiaperson/

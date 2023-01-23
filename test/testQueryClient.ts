import { QueryClient } from "@tanstack/react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../mock/syfotilgangskontroll/tilgangtilbrukerMock";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import {
  AKTIV_BRUKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../mock/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "../mock/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { unleashMock } from "../mock/unleash/unleashMock";
import { behandlerDeltaker } from "./dialogmote/testData";
import { brukerinfoMock } from "../mock/syfoperson/brukerinfoMock";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";

export const testQueryClient = (): QueryClient => {
  return new QueryClient({
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {
        /*empty*/
      },
    },
  });
};

export const queryClientWithAktivBruker = (): QueryClient => {
  const queryClient = testQueryClient();
  queryClient.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );

  return queryClient;
};

export const queryClientWithMockData = (): QueryClient => {
  const queryClient = queryClientWithAktivBruker();
  queryClient.setQueryData(
    brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => brukerinfoMock
  );
  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfo,
    () => VEILEDER_DEFAULT
  );
  queryClient.setQueryData(
    behandlendeEnhetQueryKeys.behandlendeEnhet(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => BEHANDLENDE_ENHET_DEFAULT
  );
  queryClient.setQueryData(
    tilgangQueryKeys.tilgang(ARBEIDSTAKER_DEFAULT.personIdent),
    () => tilgangBrukerMock
  );
  queryClient.setQueryData(
    ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => LEDERE_DEFAULT
  );
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonMock
  );
  queryClient.setQueryData(
    unleashQueryKeys.toggles(
      BEHANDLENDE_ENHET_DEFAULT.enhetId,
      VEILEDER_IDENT_DEFAULT
    ),
    () => unleashMock
  );
  queryClient.setQueryData(
    unleashQueryKeys.toggles(
      BEHANDLENDE_ENHET_DEFAULT.enhetId,
      VEILEDER_IDENT_DEFAULT,
      behandlerDeltaker.behandlerRef
    ),
    () => unleashMock
  );

  queryClient.setQueryData(
    behandlereQueryKeys.behandlere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => []
  );

  return queryClient;
};

import { QueryClient } from "@tanstack/react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../mock/istilgangskontroll/tilgangtilbrukerMock";
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
import { mockUnleashResponse } from "../mock/unleashMocks";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import {
  behandlerByBehandlerRefMock,
  behandlereDialogmeldingMock,
  behandlerRefDoktorLegesen,
} from "../mock/isdialogmelding/behandlereDialogmeldingMock";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { behandlerdialogMock } from "../mock/isbehandlerdialog/behandlerdialogMock";
import {
  brukerinfoMock,
  diskresjonskodeMock,
  isEgenansattMock,
  maksdatoMock,
} from "../mock/syfoperson/persondataMock";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import { personinfoQueryKeys } from "@/data/personinfo/personAdresseQueryHooks";
import { personAdresseMock } from "../mock/syfoperson/personAdresseMock";
import { maksdatoQueryKeys } from "@/data/maksdato/useMaksdatoQuery";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { sykmeldingerMock } from "../mock/syfosmregister/sykmeldingerMock";

export const testQueryClient = (): QueryClient => {
  return new QueryClient();
};

export const queryClientWithAktivBruker = (): QueryClient => {
  const queryClient = testQueryClient();
  queryClient.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );

  return queryClient;
};

export const setQueryDataWithPersonkortdata = (
  existingClient: QueryClient
): void => {
  existingClient.setQueryData(
    brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => brukerinfoMock
  );
  existingClient.setQueryData(
    diskresjonskodeQueryKeys.diskresjonskode(ARBEIDSTAKER_DEFAULT.personIdent),
    () => diskresjonskodeMock
  );
  existingClient.setQueryData(
    egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
    () => isEgenansattMock
  );
  existingClient.setQueryData(
    personinfoQueryKeys.personadresse(ARBEIDSTAKER_DEFAULT.personIdent),
    () => personAdresseMock
  );
  existingClient.setQueryData(
    maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
    () => maksdatoMock
  );
};

export const queryClientWithMockData = (): QueryClient => {
  const queryClient = queryClientWithAktivBruker();
  setQueryDataWithPersonkortdata(queryClient);

  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfo,
    () => VEILEDER_DEFAULT
  );
  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
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
    () => mockUnleashResponse
  );

  queryClient.setQueryData(
    behandlereQueryKeys.behandlere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => behandlereDialogmeldingMock
  );

  queryClient.setQueryData(
    behandlerdialogQueryKeys.behandlerdialog(ARBEIDSTAKER_DEFAULT.personIdent),
    () => behandlerdialogMock
  );

  queryClient.setQueryData(
    behandlereQueryKeys.behandlerRef(behandlerRefDoktorLegesen),
    () => behandlerByBehandlerRefMock
  );

  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmeldingerMock.slice(0, 2)
  );

  return queryClient;
};

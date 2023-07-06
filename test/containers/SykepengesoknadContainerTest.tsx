import React from "react";
import { expect } from "chai";
import SykepengesoknadContainer from "../../src/components/speiling/sykepengsoknader/container/SykepengesoknadContainer";
import mockSoknader from "../mockdata/mockSoknader";
import { screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/syfotilgangskontroll/tilgangtilbrukerMock";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { sykepengesoknaderQueryKeys } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { renderWithRouter } from "../testRouterUtils";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../mock/syfoperson/persondataMock";

const NAERINGSDRIVENDESOKNAD_ID = "faadf7c1-3aac-4758-8673-e9cee1316a3c";
const OPPHOLD_UTLAND_ID = "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: any;

describe("SykepengesoknadContainer", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(fnr),
      () => tilgangBrukerMock
    );
    queryClient.setQueryData(sykmeldingerQueryKeys.sykmeldinger(fnr), () => []);
  });

  describe("Visning av sykepengesøknad for arbeidstakere", () => {
    it("Skal vise SendtSoknadArbeidstakerNy", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => mockSoknader
      );
      renderWithRouter(
        <QueryClientProvider client={queryClient}>
          <SykepengesoknadContainer />
        </QueryClientProvider>,
        "/sykefravaer/sykepengesoknader/:sykepengesoknadId",
        [`/sykefravaer/sykepengesoknader/${OPPHOLD_UTLAND_ID}`]
      );

      expect(
        screen.getByRole("heading", {
          name: "Søknad om sykepenger under opphold utenfor Norge",
        })
      ).to.exist;
    });
  });

  describe("Håndtering av feil", () => {
    it("Skal vise feilmelding hvis søknaden er en selvstendig-søknad og henting av selvstendig-søknader feiler", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => []
      );

      renderWithRouter(
        <QueryClientProvider client={queryClient}>
          <SykepengesoknadContainer />
        </QueryClientProvider>,
        "/sykefravaer/sykepengesoknader/:sykepengesoknadId",
        [`/sykefravaer/sykepengesoknader/${NAERINGSDRIVENDESOKNAD_ID}`]
      );

      expect(
        screen.getByRole("heading", {
          name: "Beklager, det oppstod en feil",
        })
      ).to.exist;
    });
  });
});

import React from "react";
import { expect } from "chai";
import Motelandingsside from "../../src/components/mote/components/Motelandingsside";
import { QueryClientProvider } from "react-query";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { stubTilgangApi } from "../stubs/stubSyfotilgangskontroll";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/syfotilgangskontroll/tilgangtilbrukerMock";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { MemoryRouter } from "react-router-dom";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../mock/syfoperson/brukerinfoMock";
import { dialogmoteunntakQueryKeys } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: any;
let apiMockScope: any;

const motebehovData = [
  {
    UUID: "33333333-c987-4b57-a401-a3915ec11411",
    id: "33333333-ee10-44b6-bddf-54d049ef25f2",
    opprettetDato: "2019-01-08T13:53:57.047+01:00",
    aktorId: "1",
    opprettetAv: "1",
    virksomhetsnummer: "000999000",
    tildeltEnhet: "0330",
    behandletTidspunkt: "2019-01-10T13:53:57.047+01:00",
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  },
];

const renderMotelandingsside = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: "", setValgtEnhet: () => void 0 }}
      >
        <MemoryRouter>
          <Motelandingsside />
        </MemoryRouter>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("MotelandingssideContainer", () => {
  describe("MotelandingssideSide", () => {
    beforeEach(() => {
      queryClient = queryClientWithAktivBruker();
      queryClient.setQueryData(
        brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
        () => brukerinfoMock
      );
      queryClient.setQueryData(dialogmoterQueryKeys.dialogmoter(fnr), () => []);
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
        () => []
      );
      queryClient.setQueryData(
        motebehovQueryKeys.motebehov(fnr),
        () => motebehovData
      );
      queryClient.setQueryData(
        ledereQueryKeys.ledere(fnr),
        () => LEDERE_DEFAULT
      );
      queryClient.setQueryData(dialogmoteunntakQueryKeys.unntak(fnr), () => []);
      apiMockScope = apiMock();
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it("Skal vise AppSpinner når henter data", () => {
      stubTilgangApi(apiMockScope);
      renderMotelandingsside();

      expect(screen.getByLabelText("Vent litt mens siden laster")).to.exist;
    });

    it("Skal vise AppSpinner når henter tilgang", async () => {
      stubTilgangApi(apiMockScope);
      renderMotelandingsside();

      expect(await screen.findByLabelText("Vent litt mens siden laster")).to
        .exist;
    });

    it("Skal vise feilmelding hvis ikke tilgang", async () => {
      stubTilgangApi(apiMockScope, {
        harTilgang: false,
      });
      renderMotelandingsside();

      expect(
        await screen.findByRole("heading", {
          name: "Du har ikke tilgang til denne tjenesten",
        })
      ).to.exist;
    });

    it("Skal vise Planlegg nytt dialogmøte når det ikke finnes møter", () => {
      queryClient.setQueryData(
        tilgangQueryKeys.tilgang(fnr),
        () => tilgangBrukerMock
      );
      renderMotelandingsside();

      expect(
        screen.getByRole("heading", {
          name: "Planlegg nytt dialogmøte",
        })
      ).to.exist;
    });
  });
});

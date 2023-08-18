import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import React from "react";
import {
  defaultMelding,
  defaultMeldingInnkommende,
  defaultMeldingInnkommendeLegeerklaring,
  defaultMeldingLegeerklaring,
} from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  personOppgaveBehandletBehandlerdialogUbesvartMelding,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import { getButton } from "../testUtils";

let queryClient: QueryClient;

const renderMeldingerISamtale = (meldinger: MeldingDTO[]) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MeldingerISamtale meldinger={meldinger} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const meldingTilBehandler = {
  ...defaultMelding,
  tidspunkt: new Date(),
};
const meldingFraBehandler = {
  ...defaultMeldingInnkommende,
  tidspunkt: new Date(),
};
const foresporselLegeerklaringTilBehandler = {
  ...defaultMeldingLegeerklaring,
  tidspunkt: new Date(),
};
const legeerklaringFraBehandler = {
  ...defaultMeldingInnkommendeLegeerklaring,
  tidspunkt: new Date(),
};

const paminnelseButtonText = "Vurder påminnelse til behandler";
const returLegeerklaringButtonText = "Vurder retur av legeerklæring";

describe("MeldingerISamtale", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Påminnelse button", () => {
    it("render no paminnelse button when no meldinger", () => {
      renderMeldingerISamtale([]);

      expect(screen.queryByRole("button", { name: paminnelseButtonText })).to
        .not.exist;
    });
    it("render no paminnelse button when no ubesvart melding-oppgave", () => {
      renderMeldingerISamtale([meldingTilBehandler]);

      expect(screen.queryByRole("button", { name: paminnelseButtonText })).to
        .not.exist;
    });
    it("render no paminnelse button for melding til behandler med behandlet ubesvart melding-oppgave", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
            referanseUuid: meldingTilBehandler.uuid,
          },
        ]
      );
      renderMeldingerISamtale([meldingTilBehandler]);

      expect(screen.queryByRole("button", { name: paminnelseButtonText })).to
        .not.exist;
    });
    it("render paminnelse button for melding til behandler med ubehandlet ubesvart melding-oppgave", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
            referanseUuid: meldingTilBehandler.uuid,
          },
        ]
      );

      renderMeldingerISamtale([meldingTilBehandler]);

      expect(getButton(paminnelseButtonText)).to.exist;
    });
  });

  describe("Retur legeerklæring button", () => {
    it("renders no retur legeeklæring button when no meldinger", () => {
      renderMeldingerISamtale([]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders no retur legeeklæring button when no meldinger of type legeerklaring", () => {
      renderMeldingerISamtale([meldingTilBehandler, meldingFraBehandler]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders no retur legeeklæring button when no melding fra behandler legeerklaring", () => {
      renderMeldingerISamtale([foresporselLegeerklaringTilBehandler]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders retur legeeklæring button when melding fra behandler is legeerklæring", () => {
      renderMeldingerISamtale([
        foresporselLegeerklaringTilBehandler,
        legeerklaringFraBehandler,
      ]);

      expect(getButton(returLegeerklaringButtonText)).to.exist;
    });
  });
});

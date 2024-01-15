import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import { MeldingerISamtale } from "@/sider/behandlerdialog/meldinger/MeldingerISamtale";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  personOppgaveBehandletBehandlerdialogUbesvartMelding,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import { getButton } from "../testUtils";
import {
  foresporselLegeerklaringFraBehandler,
  foresporselLegeerklaringTilBehandler,
  foresporselPasientFraBehandler,
  foresporselPasientToBehandler,
  returLegeerklaring,
} from "./meldingTestdataGenerator";

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
      renderMeldingerISamtale([foresporselPasientToBehandler]);

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
            referanseUuid: foresporselPasientToBehandler.uuid,
          },
        ]
      );
      renderMeldingerISamtale([foresporselPasientToBehandler]);

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
            referanseUuid: foresporselPasientToBehandler.uuid,
          },
        ]
      );

      renderMeldingerISamtale([foresporselPasientToBehandler]);

      expect(getButton(paminnelseButtonText)).to.exist;
    });
  });

  describe("Retur legeerklæring button", () => {
    it("renders no retur legeerklæring button when no meldinger", () => {
      renderMeldingerISamtale([]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders no retur legeerklæring button when no meldinger of type legeerklaring", () => {
      renderMeldingerISamtale([
        foresporselPasientToBehandler,
        foresporselPasientFraBehandler,
      ]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders no retur legeerklæring button when no melding fra behandler legeerklaring", () => {
      renderMeldingerISamtale([foresporselLegeerklaringTilBehandler]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders no retur legeerklæring button when retur already sent for legeerklæring fra behandler", () => {
      renderMeldingerISamtale([
        foresporselLegeerklaringTilBehandler,
        foresporselLegeerklaringFraBehandler,
        returLegeerklaring,
      ]);

      expect(
        screen.queryByRole("button", { name: returLegeerklaringButtonText })
      ).to.not.exist;
    });
    it("renders retur legeerklæring button when melding fra behandler is legeerklæring", () => {
      renderMeldingerISamtale([
        foresporselLegeerklaringTilBehandler,
        foresporselLegeerklaringFraBehandler,
      ]);

      expect(getButton(returLegeerklaringButtonText)).to.exist;
    });
    it("renders retur legeerklæring button when retur sent for legeerklaring fra behandler but received new legeerklaring", () => {
      const newLegeerklaringFraBehandler = {
        ...foresporselLegeerklaringFraBehandler,
        uuid: "new-uuid",
        parentRef: returLegeerklaring.uuid,
      };
      renderMeldingerISamtale([
        foresporselLegeerklaringTilBehandler,
        foresporselLegeerklaringFraBehandler,
        returLegeerklaring,
        newLegeerklaringFraBehandler,
      ]);

      expect(getButton(returLegeerklaringButtonText)).to.exist;
    });
  });
});

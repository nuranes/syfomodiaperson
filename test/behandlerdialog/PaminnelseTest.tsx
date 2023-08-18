import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { expect } from "chai";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { queryClientWithMockData } from "../testQueryClient";
import { defaultMelding } from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { clickButton, getButton } from "../testUtils";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  personOppgaveBehandletBehandlerdialogUbesvartMelding,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import { expectedPaminnelseDocument } from "./testDataDocuments";

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
const paminnelseButtonText = "Vurder påminnelse til behandler";
const sendButtonText = "Send påminnelse";
const fjernOppgaveButtonText = "Fjern oppgave uten å sende påminnelse";
const cancelButtonText = "Lukk";

describe("Melding til behandler påminnelse", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("render no paminnelse button when no meldinger", () => {
    renderMeldingerISamtale([]);

    expect(screen.queryByRole("button", { name: paminnelseButtonText })).to.not
      .exist;
  });
  it("render no paminnelse button when no ubesvart melding-oppgave", () => {
    renderMeldingerISamtale([meldingTilBehandler]);

    expect(screen.queryByRole("button", { name: paminnelseButtonText })).to.not
      .exist;
  });
  it("render no paminnelse button for melding til behandler med behandlet ubesvart melding-oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
          referanseUuid: meldingTilBehandler.uuid,
        },
      ]
    );
    renderMeldingerISamtale([meldingTilBehandler]);

    expect(screen.queryByRole("button", { name: paminnelseButtonText })).to.not
      .exist;
  });
  it("render paminnelse button for melding til behandler med ubehandlet ubesvart melding-oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
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
  describe("paminnelse button", () => {
    beforeEach(() => {
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
    });
    it("click opens preview with send, fjern oppgave and cancel button", () => {
      renderMeldingerISamtale([meldingTilBehandler]);

      clickButton(paminnelseButtonText);

      const previewModal = screen.getByRole("dialog");
      expect(previewModal).to.exist;

      const expectedTexts = expectedPaminnelseDocument(
        meldingTilBehandler
      ).flatMap((documentComponent) => documentComponent.texts);
      expectedTexts.forEach((text) => {
        expect(within(previewModal).getByText(text)).to.exist;
      });

      expect(within(previewModal).getByRole("button", { name: sendButtonText }))
        .to.exist;
      expect(
        within(previewModal).getByRole("button", {
          name: fjernOppgaveButtonText,
        })
      ).to.exist;
      expect(
        within(previewModal).getByRole("button", { name: cancelButtonText })
      ).to.exist;
    });
    it("click cancel in preview closes preview", () => {
      renderMeldingerISamtale([meldingTilBehandler]);

      clickButton(paminnelseButtonText);

      const previewModal = screen.getByRole("dialog");
      expect(previewModal).to.exist;

      clickButton("Lukk");

      expect(screen.queryByRole("dialog")).to.not.exist;
      expect(screen.queryByRole("button", { name: sendButtonText })).to.not
        .exist;
      expect(screen.queryByRole("button", { name: cancelButtonText })).to.not
        .exist;
    });
    it("click send in preview sends paminnelse with expected values", () => {
      const expectedPaminnelseDTO: PaminnelseDTO = {
        document: expectedPaminnelseDocument(meldingTilBehandler),
      };

      renderMeldingerISamtale([meldingTilBehandler]);

      clickButton(paminnelseButtonText);

      clickButton(sendButtonText);

      const paminnelseMutation = queryClient.getMutationCache().getAll()[0];

      expect(paminnelseMutation.options.variables).to.deep.equal(
        expectedPaminnelseDTO
      );
    });
    it("click fjern oppgave in preview behandler oppgave", () => {
      renderMeldingerISamtale([meldingTilBehandler]);

      clickButton(paminnelseButtonText);

      clickButton(fjernOppgaveButtonText);

      const paminnelseMutation = queryClient.getMutationCache().getAll()[0];

      expect(paminnelseMutation.options.variables).to.deep.equal(
        personOppgaveUbehandletBehandlerdialogUbesvartMelding.uuid
      );
    });
  });
});
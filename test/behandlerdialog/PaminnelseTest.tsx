import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { expect } from "chai";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { queryClientWithMockData } from "../testQueryClient";
import { clickButton } from "../testUtils";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { personOppgaveUbehandletBehandlerdialogUbesvartMelding } from "../../mock/ispersonoppgave/personoppgaveMock";
import { expectedPaminnelseDocument } from "./testDataDocuments";
import { foresporselPasientToBehandler } from "./meldingTestdataGenerator";
import { MeldingTilBehandler } from "@/sider/behandlerdialog/meldinger/MeldingerISamtale";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;

const renderPaminnelseMelding = (melding: MeldingDTO) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MeldingTilBehandler melding={melding} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const meldingTilBehandler = foresporselPasientToBehandler;
const paminnelseButtonText = "Vurder påminnelse til behandler";
const sendButtonText = "Send påminnelse";
const fjernOppgaveButtonText = "Fjern oppgave uten å sende påminnelse";
const cancelButtonText = "Lukk";

describe("PåminnelseMelding", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
          referanseUuid: meldingTilBehandler.uuid,
        },
      ]
    );
  });

  it("click opens preview with send and cancel button", () => {
    renderPaminnelseMelding(meldingTilBehandler);

    clickButton(paminnelseButtonText);

    const previewModal = screen.getAllByRole("dialog", { hidden: true })[1];
    expect(previewModal).to.exist;

    const expectedTexts = expectedPaminnelseDocument(
      meldingTilBehandler
    ).flatMap((documentComponent) => documentComponent.texts);
    expectedTexts.forEach((text) => {
      expect(within(previewModal).getByText(text)).to.exist;
    });

    expect(
      within(previewModal).getByRole("button", {
        name: sendButtonText,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(previewModal).getAllByRole("button", {
        name: cancelButtonText,
        hidden: true,
      })
    ).to.not.be.empty;
  });
  it("click cancel in preview closes preview", () => {
    renderPaminnelseMelding(meldingTilBehandler);

    clickButton(paminnelseButtonText);

    const previewModal = screen.getAllByRole("dialog", { hidden: true })[1];
    expect(previewModal).to.exist;

    const closeButton = within(previewModal).getAllByRole("button", {
      name: cancelButtonText,
      hidden: true,
    })[0];
    userEvent.click(closeButton);

    expect(screen.queryByRole("dialog")).to.not.exist;
    expect(screen.queryByRole("button", { name: sendButtonText })).to.not.exist;
    expect(screen.queryByRole("button", { name: cancelButtonText })).to.not
      .exist;
  });
  it("click send in preview sends paminnelse with expected values", () => {
    const expectedPaminnelseDTO: PaminnelseDTO = {
      document: expectedPaminnelseDocument(meldingTilBehandler),
    };

    renderPaminnelseMelding(meldingTilBehandler);

    clickButton(paminnelseButtonText);

    const sendButton = screen.getByRole("button", {
      name: sendButtonText,
      hidden: true,
    });
    userEvent.click(sendButton);

    const paminnelseMutation = queryClient.getMutationCache().getAll()[0];

    expect(paminnelseMutation.state.variables).to.deep.equal(
      expectedPaminnelseDTO
    );
  });
  it("click fjern oppgave behandler oppgave", () => {
    renderPaminnelseMelding(meldingTilBehandler);

    clickButton(fjernOppgaveButtonText);

    const paminnelseMutation = queryClient.getMutationCache().getAll()[0];

    expect(paminnelseMutation.state.variables).to.deep.equal(
      personOppgaveUbehandletBehandlerdialogUbesvartMelding.uuid
    );
  });
});

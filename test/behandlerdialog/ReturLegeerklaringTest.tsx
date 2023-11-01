import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { render, screen, waitFor, within } from "@testing-library/react";
import { expect } from "chai";
import {
  MeldingDTO,
  ReturLegeerklaringDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { ReturLegeerklaring } from "@/components/behandlerdialog/legeerklaring/ReturLegeerklaring";
import { queryClientWithMockData } from "../testQueryClient";
import { foresporselLegeerklaringFraBehandler } from "./meldingTestdataGenerator";
import { expectedReturLegeerklaringDocument } from "./testDataDocuments";

let queryClient: QueryClient;

const renderReturLegeerklaring = (melding: MeldingDTO) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ReturLegeerklaring melding={melding} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const returButtonText = "Vurder retur av legeerklæring";
const sendButtonText = "Send retur";
const cancelButtonText = "Lukk";
const enBegrunnelseTekst = "For dårlig legeerklæring";

describe("ReturLegeerklaring", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("click opens preview with send and cancel button", () => {
    renderReturLegeerklaring(foresporselLegeerklaringFraBehandler);

    clickButton(returButtonText);

    const previewModal = screen.getByRole("dialog");
    expect(previewModal).to.exist;

    const expectedTexts = expectedReturLegeerklaringDocument().flatMap(
      (documentComponent) => documentComponent.texts
    );
    expectedTexts.forEach((text) => {
      expect(within(previewModal).getByText(text)).to.exist;
    });

    expect(within(previewModal).getByRole("button", { name: sendButtonText }))
      .to.exist;
    expect(within(previewModal).getByRole("button", { name: cancelButtonText }))
      .to.exist;
  });
  it("click cancel in preview closes preview", () => {
    renderReturLegeerklaring(foresporselLegeerklaringFraBehandler);

    clickButton(returButtonText);

    const previewModal = screen.getByRole("dialog");
    expect(previewModal).to.exist;

    clickButton("Lukk");

    expect(screen.queryByRole("dialog")).to.not.exist;
    expect(screen.queryByRole("button", { name: sendButtonText })).to.not.exist;
    expect(screen.queryByRole("button", { name: cancelButtonText })).to.not
      .exist;
  });
  it("previews begrunnelse", () => {
    renderReturLegeerklaring(foresporselLegeerklaringFraBehandler);

    clickButton(returButtonText);

    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, enBegrunnelseTekst);

    // Vises i forhåndsvisning og i textarea
    expect(screen.getAllByText(enBegrunnelseTekst)).to.have.length(2);
  });
  it("click send validates begrunnelse", async () => {
    renderReturLegeerklaring(foresporselLegeerklaringFraBehandler);

    clickButton(returButtonText);
    clickButton(sendButtonText);

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;

    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, enBegrunnelseTekst);
    clickButton(sendButtonText);

    await waitFor(() => {
      expect(screen.queryByText("Vennligst angi begrunnelse")).to.not.exist;
    });
  });
  it("click send in preview sends retur with expected values", async () => {
    const expectedReturLegeerklaringDTO: ReturLegeerklaringDTO = {
      document: expectedReturLegeerklaringDocument(enBegrunnelseTekst),
      tekst: enBegrunnelseTekst,
    };

    renderReturLegeerklaring(foresporselLegeerklaringFraBehandler);

    clickButton(returButtonText);

    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, enBegrunnelseTekst);

    clickButton(sendButtonText);

    await waitFor(() => {
      const returLegeerklaringMutation = queryClient
        .getMutationCache()
        .getAll()[0];

      expect(returLegeerklaringMutation.options.variables).to.deep.equal(
        expectedReturLegeerklaringDTO
      );
    });
  });
});

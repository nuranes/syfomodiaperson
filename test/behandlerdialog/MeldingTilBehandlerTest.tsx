import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { MeldingTilBehandler } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandler";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";

let queryClient: QueryClient;

const renderMeldingTilBehandler = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MeldingTilBehandler />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("MeldingTilBehandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser MeldingTilBehandler side", () => {
    renderMeldingTilBehandler();

    expect(screen.getByRole("heading", { name: "Skriv til behandler" })).to
      .exist;
  });

  describe("MeldingTilBehandlerSkjema", () => {
    it("Viser radiobuttons med behandlervalg, der det ikke er mulig å velge 'Ingen behandler'", () => {
      renderMeldingTilBehandler();

      expect(screen.queryByText("Ingen behandler")).to.not.exist;
      expect(screen.getByText("Søk etter behandler")).to.exist;
    });

    it("Viser behandlersøk ved klikk på radiobutton 'Søk etter behandler'", () => {
      renderMeldingTilBehandler();

      const sokBehandlerRadioButton = screen.getByText("Søk etter behandler");
      fireEvent.click(sokBehandlerRadioButton);

      expect(
        screen.getByText("Finner du ikke behandleren du leter etter?", {
          exact: false,
        })
      ).to.exist;
    });

    it("Validerer MeldingTilBehandlerSkjema ved innsending", () => {
      renderMeldingTilBehandler();

      clickButton("Send til behandler");

      expect(
        screen.getAllByText("Innholdet i meldingen er tomt")
      ).to.have.length(2);
      expect(screen.getAllByText("Vennligst velg behandler")).to.have.length(2);

      const meldingInput = getTextInput("Skriv inn tekst");
      changeTextInput(meldingInput, "En testmelding");
      expect(screen.queryByText("Innholdet i meldingen er tomt")).to.not.exist;

      const velgBehandlerRadioButton = screen.getAllByText("Fastlege:", {
        exact: false,
      })[0];
      fireEvent.click(velgBehandlerRadioButton);
      expect(screen.queryByText("Vennligst velg behandler")).to.not.exist;
    });
  });

  describe("MeldingTilBehandler innsending", () => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      behandlerRef: behandlereDialogmeldingMock[0].behandlerRef,
      tekst: "En testmelding",
    };

    it("Send melding med verdier fra skjema", () => {
      renderMeldingTilBehandler();

      const velgBehandlerRadioButton = screen.getAllByText("Fastlege:", {
        exact: false,
      })[0];
      fireEvent.click(velgBehandlerRadioButton);

      const meldingInput = getTextInput("Skriv inn tekst");
      changeTextInput(meldingInput, meldingTilBehandlerDTO.tekst);

      clickButton("Send til behandler");

      const meldingTilBehandlerMutation = queryClient
        .getMutationCache()
        .getAll()[0];

      expect(meldingTilBehandlerMutation.options.variables).to.deep.equal(
        meldingTilBehandlerDTO
      );
    });
  });
});
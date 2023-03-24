import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { SkrivTilBehandler } from "@/components/behandlerdialog/skrivtilbehandler/SkrivTilBehandler";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";

let queryClient: QueryClient;

const renderSkrivTilBehandler = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <SkrivTilBehandler />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("Skriv til behandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser SkrivTilBehandler side", () => {
    renderSkrivTilBehandler();

    expect(screen.getByRole("heading", { name: "Skriv til behandler" })).to
      .exist;
  });

  it("Viser radiobuttons med behandlervalg, der det ikke er mulig å velge 'Ingen behandler'", () => {
    renderSkrivTilBehandler();

    expect(screen.queryByText("Ingen behandler")).to.not.exist;
    expect(screen.getByText("Søk etter behandler")).to.exist;
  });

  it("Viser behandlersøk ved klikk på radiobutton 'Søk etter behandler'", () => {
    renderSkrivTilBehandler();

    const sokBehandlerRadioButton = screen.getByText("Søk etter behandler");
    fireEvent.click(sokBehandlerRadioButton);

    expect(
      screen.getByText("Finner du ikke behandleren du leter etter?", {
        exact: false,
      })
    ).to.exist;
  });

  it("Validerer SkrivTilBehandlerSkjema ved innsending", () => {
    renderSkrivTilBehandler();

    clickButton("Send til behandler");

    expect(screen.getAllByText("Innholdet i meldingen er tomt")).to.have.length(
      2
    );
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

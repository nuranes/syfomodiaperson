import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { FattVedtak } from "@/sider/frisktilarbeid/FattVedtak";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { clickButton, getTextInput } from "../testUtils";

let queryClient: QueryClient;

const renderFattVedtak = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <FattVedtak />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("FattVedtak", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser skjema for å fatte vedtak", () => {
    renderFattVedtak();

    expect(getTextInput("Friskmeldingen gjelder fra")).to.exist;
    const tilDatoInput = getTextInput(
      "Til dato (automatisk justert 12 uker frem)"
    );
    expect(tilDatoInput).to.exist;
    expect(tilDatoInput).to.have.property("readOnly", true);
    expect(getTextInput("Begrunnelse")).to.exist;
    expect(screen.getByRole("button", { name: "Fatt vedtak" })).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
  });
  it("validerer fra-dato og begrunnelse", async () => {
    renderFattVedtak();

    clickButton("Fatt vedtak");

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    expect(await screen.findByText("Vennligst angi dato")).to.exist;
  });
  it("åpner forhåndsvisning", () => {
    renderFattVedtak();

    clickButton("Forhåndsvisning");

    const forhandsvisModal = screen.getAllByRole("dialog", {
      hidden: true,
    })[2];
    expect(forhandsvisModal).to.exist;
    expect(
      within(forhandsvisModal).getByRole("button", {
        name: "Lukk",
        hidden: true,
      })
    ).to.exist;
  });
});

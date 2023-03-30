import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { Meldinger } from "@/components/behandlerdialog/meldinger/Meldinger";

let queryClient: QueryClient;

const renderMeldinger = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Meldinger />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("Meldinger panel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser meldinger", () => {
    renderMeldinger();

    expect(screen.getByRole("heading", { name: "Meldinger" })).to.exist;
  });

  it("Viser accordion med en samtale", () => {
    renderMeldinger();

    const samtaleAccordion = screen.getByText("behandlerRef3", {
      exact: false,
    });
    expect(samtaleAccordion).to.exist;
    expect(screen.getAllByText("Dette er en melding")).to.have.length(3);
  });

  it("Meldinger sorteres i riktig rekkefølge med nyeste samtale først", () => {
    renderMeldinger();

    const accordions = screen.getAllByRole("button");
    expect(accordions).to.have.length(3);
    expect(accordions[0].textContent).to.contain("behandlerRef3");
    expect(accordions[1].textContent).to.contain("behandlerRef2");
    expect(accordions[2].textContent).to.contain("behandlerRef");
  });
});

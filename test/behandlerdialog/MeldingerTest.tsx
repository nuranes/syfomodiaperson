import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { Meldinger } from "@/components/behandlerdialog/meldinger/Meldinger";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  behandlerdialogMockEmpty,
  defaultMelding,
} from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { MeldingResponseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

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

    const samtaleAccordion = screen.getByText("Doktor Legesen 3. januar", {
      exact: false,
    });
    expect(samtaleAccordion).to.exist;
    expect(screen.getAllByText("Dette er en melding")).to.have.length(4);
  });

  it("Meldinger sorteres i riktig rekkefølge med nyeste samtale først", () => {
    renderMeldinger();

    const accordions = screen.getAllByRole("button");
    expect(accordions).to.have.length(3);
    expect(accordions[0].textContent).to.contain("3. januar");
    expect(accordions[1].textContent).to.contain("2. januar");
    expect(accordions[2].textContent).to.contain("1. januar");
  });

  it("Viser GuidePanel når det ikke finnes dialogmeldinger på personen", () => {
    queryClient.setQueryData(
      behandlerdialogQueryKeys.behandlerdialog(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => behandlerdialogMockEmpty
    );
    renderMeldinger();

    expect(
      screen.getByText(
        "Her kommer meldingene som blir sendt til og fra behandler(e) som er knyttet til personen."
      )
    ).to.exist;
  });

  it("Viser riktig behandlerNavn for behandlere", () => {
    renderMeldinger();

    expect(screen.getAllByText("Skrevet av Lego Las Legesen")).to.have.length(
      2
    );
    expect(screen.getByText("Skrevet av Doktor Legesen")).to.exist;
  });

  it("Skal ikke vise 'Skrevet av {navn}' hvis behandlerNavn på innkommende melding er null", () => {
    const meldingResponse: MeldingResponseDTO = {
      conversations: {
        ...behandlerdialogMockEmpty.conversations,
        ["conversationRef000"]: [
          {
            ...defaultMelding,
            innkommende: true,
            tidspunkt: new Date(),
          },
        ],
      },
    };
    queryClient.setQueryData(
      behandlerdialogQueryKeys.behandlerdialog(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => meldingResponse
    );

    renderMeldinger();

    expect(screen.queryByText("Skrevet av", { exact: false })).to.not.exist;
  });
});

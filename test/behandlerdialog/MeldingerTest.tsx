import { render, screen, within } from "@testing-library/react";
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
import userEvent from "@testing-library/user-event";
import { clickButton } from "../testUtils";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  personOppgaveBehandletBehandlerdialogSvar,
  personOppgaveUbehandletBehandlerdialogSvar,
} from "../../mock/ispersonoppgave/personoppgaveMock";

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

const seMeldingButtonTekst = "Se utfyllende melding";

const meldingTilOgFraBehandler = (meldingFraBehandlerUuid: string) => [
  defaultMelding,
  {
    ...defaultMelding,
    uuid: meldingFraBehandlerUuid,
    innkommende: true,
    antallVedlegg: 1,
  },
];

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

  it("Viser 'Se melding'-knapp for melding til behandler i alle samtaler", () => {
    renderMeldinger();

    const accordions = screen.getAllByRole("button");
    expect(accordions).to.have.length(3);
    accordions.forEach((accordion) => userEvent.click(accordion));
    const seMeldingButtons = screen.getAllByRole("button", {
      name: seMeldingButtonTekst,
    });
    expect(seMeldingButtons).to.have.length(3);
  });

  it("Viser melding til behandler ved klikk på 'Se melding'-knapp", () => {
    renderMeldinger();

    const accordions = screen.getAllByRole("button");
    userEvent.click(accordions[0]);
    clickButton(seMeldingButtonTekst);

    const seMeldingModal = screen.getByRole("dialog", {
      name: "Vis melding",
    });
    expect(seMeldingModal).to.exist;

    expect(
      within(seMeldingModal).getByText(
        "Spørsmål om tilleggsopplysninger vedrørende pasient"
      )
    ).to.exist;
  });

  it("Viser ny-tag på samtale hvis det er en ny melding i samtalen", () => {
    const innkommendeMeldingUuid = "456uio";
    const meldingResponse = {
      conversations: {
        ["conversationRef000"]: meldingTilOgFraBehandler(
          innkommendeMeldingUuid
        ),
      },
    };
    queryClient.setQueryData(
      behandlerdialogQueryKeys.behandlerdialog(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => meldingResponse
    );
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveUbehandletBehandlerdialogSvar,
          referanseUuid: innkommendeMeldingUuid,
        },
      ]
    );

    renderMeldinger();
    const accordions = screen.getAllByRole("button");
    accordions.forEach((accordion) => userEvent.click(accordion));

    expect(screen.getByText("Ny")).to.exist;
  });

  it("Viser venter svar-tag på samtale hvis det mangler melding fra behandler i samtalen", () => {
    const meldingResponse = {
      conversations: {
        ["conversationRef123"]: [defaultMelding],
      },
    };
    queryClient.setQueryData(
      behandlerdialogQueryKeys.behandlerdialog(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => meldingResponse
    );

    renderMeldinger();
    const accordions = screen.getAllByRole("button");
    accordions.forEach((accordion) => userEvent.click(accordion));

    expect(screen.getByText("Venter på svar fra lege")).to.exist;
  });

  it("viser ingen tags på samtale hvis det er melding fra behandler i samtalen og oppgaven for denne er behandlet", () => {
    const innkommendeMeldingUuid = "456uio";
    const meldingResponse = {
      conversations: {
        ["conversationRef000"]: meldingTilOgFraBehandler(
          innkommendeMeldingUuid
        ),
      },
    };
    queryClient.setQueryData(
      behandlerdialogQueryKeys.behandlerdialog(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => meldingResponse
    );
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [
        {
          ...personOppgaveBehandletBehandlerdialogSvar,
          referanseUuid: innkommendeMeldingUuid,
        },
      ]
    );

    renderMeldinger();
    const accordions = screen.getAllByRole("button");
    accordions.forEach((accordion) => userEvent.click(accordion));

    expect(screen.queryByText("Venter på svar fra lege")).to.not.exist;
    expect(screen.queryByText("Ny")).to.not.exist;
  });

  it("Viser vedlegg-ikon og tekst for meldinger fra behandler med vedlegg", () => {
    const meldingResponse = {
      conversations: {
        ["conversationRef123"]: [
          defaultMelding,
          {
            ...defaultMelding,
            innkommende: true,
            antallVedlegg: 2,
          },
          {
            ...defaultMelding,
            innkommende: true,
            antallVedlegg: 5,
          },
        ],
        ["conversationRef000"]: [
          defaultMelding,
          {
            ...defaultMelding,
            innkommende: true,
            antallVedlegg: 1,
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

    const meldingerMedVedlegg = Object.values(
      meldingResponse.conversations
    ).flatMap((meldinger) =>
      meldinger.filter(
        (melding) => melding.innkommende && melding.antallVedlegg > 0
      )
    );
    renderMeldinger();

    const accordions = screen.getAllByRole("button");
    accordions.forEach((accordion) => userEvent.click(accordion));

    const vedleggIkoner = screen.getAllByRole("img", {
      name: "Binders-ikon for vedlegg",
    });
    expect(vedleggIkoner).to.have.length(meldingerMedVedlegg.length);

    meldingerMedVedlegg.forEach((melding) => {
      const vedleggTekst = screen.getByText(
        `${melding.antallVedlegg} vedlegg. Se i Gosys.`
      );
      expect(vedleggTekst).to.exist;
    });
  });
});

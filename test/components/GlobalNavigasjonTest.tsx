import { render, screen } from "@testing-library/react";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  queryClientWithAktivBruker,
  queryClientWithMockData,
} from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import {
  personoppgaverMock,
  personOppgaveUbehandletBehandlerdialogSvar,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: any;

const renderGlobalNavigasjon = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <GlobalNavigasjon aktivtMenypunkt={Menypunkter.NOKKELINFORMASJON} />
        </ValgtEnhetContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("GlobalNavigasjon", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
      () => []
    );
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(fnr),
      () => []
    );
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => []
    );
  });
  it("viser linker for alle menypunkter uten toggle", () => {
    renderGlobalNavigasjon();
    const navnMenypunkter = [
      "Nøkkelinformasjon",
      "Aktivitetskrav",
      "Dialog med behandler",
      "Logg",
      "Sykmeldinger",
      "Søknader om sykepenger",
      "Oppfølgingsplaner",
      "Dialogmøter",
      "Vedtak",
    ];

    const linker = screen.getAllByRole("link");
    linker.forEach((link, index) => {
      expect(link.textContent).to.equal(navnMenypunkter[index]);
    });
  });
  it("viser aktivt menypunkt", () => {
    renderGlobalNavigasjon();

    const currentMenypunkt = screen.getByRole("listitem", {
      current: true,
    });
    expect(currentMenypunkt.textContent).to.equal("Nøkkelinformasjon");
  });
  it("viser rød prikk for menypunkt Dialogmøter når ubehandlet oppgave dialogmøte-svar", () => {
    queryClient.setQueryData(personoppgaverQueryKeys.personoppgaver(fnr), () =>
      personoppgaverMock()
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialogmøter 1" })).to.exist;
  });

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave behandlerdialog-svar", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogSvar]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave ubesvart melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogUbesvartMelding]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser to røde prikker for menypunkt Dialog med behandler når ubehandlet oppgave ubesvart melding og ubehandlet oppgave behandlerdialog-svar", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [
        personOppgaveUbehandletBehandlerdialogSvar,
        personOppgaveUbehandletBehandlerdialogUbesvartMelding,
      ]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 2" })).to
      .exist;
  });
});

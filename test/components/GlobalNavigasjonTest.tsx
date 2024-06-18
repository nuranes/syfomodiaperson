import { render, screen } from "@testing-library/react";
import {
  GlobalNavigasjon,
  Menypunkter,
} from "@/components/globalnavigasjon/GlobalNavigasjon";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, describe, it, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  queryClientWithAktivBruker,
  queryClientWithMockData,
} from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import {
  personoppgaverMock,
  personOppgaveUbehandletBehandlerdialogAvvistMelding,
  personOppgaveUbehandletBehandlerdialogSvar,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  createForhandsvarsel,
  createVurdering,
} from "../arbeidsuforhet/arbeidsuforhetTestData";
import { addWeeks } from "@/utils/datoUtils";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient: QueryClient;

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
      "Arbeidsuførhet",
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

  it("viser én rød prikk for menypunkt Dialog med behandler når ubehandlet oppgave avvist melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [personOppgaveUbehandletBehandlerdialogAvvistMelding]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 1" })).to
      .exist;
  });

  it("viser tre røde prikker for menypunkt Dialog med behandler når ubehandlet oppgave ubesvart melding, ubehandlet behandlerdialog-svar og ubehandlet avvist melding", () => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(fnr),
      () => [
        personOppgaveUbehandletBehandlerdialogSvar,
        personOppgaveUbehandletBehandlerdialogUbesvartMelding,
        personOppgaveUbehandletBehandlerdialogAvvistMelding,
      ]
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Dialog med behandler 3" })).to
      .exist;
  });

  it("viser rød prikk for menypunkt Aktivitetskrav når ubehandlet oppgave vurder stans", () => {
    queryClient.setQueryData(personoppgaverQueryKeys.personoppgaver(fnr), () =>
      personoppgaverMock()
    );

    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Aktivitetskrav 1" })).to.exist;
  });

  it("viser rød prikk for menypunkt Arbeidsuforhet når siste vurdering er utløpt forhåndsvarsel", () => {
    const expiredForhandsvarsel = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), -3),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [expiredForhandsvarsel]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Arbeidsuførhet 1" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er ikke-utløpt forhåndsvarsel", () => {
    const notExpiredForhandsvarsel = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), 5),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [notExpiredForhandsvarsel]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er oppfylt", () => {
    const oppfyltVurdering = createVurdering({
      type: VurderingType.OPPFYLT,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [oppfyltVurdering]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når siste vurdering er avslag", () => {
    const avslagVurdering = createVurdering({
      type: VurderingType.AVSLAG,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => [avslagVurdering]
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Arbeidsuførhet" })).to.exist;
  });

  it("viser ikke rød prikk for menypunkt Arbeidsuforhet når ingen vurdering", () => {
    queryClient.setQueryData(
      arbeidsuforhetQueryKeys.arbeidsuforhet(fnr),
      () => []
    );
    renderGlobalNavigasjon();

    expect(screen.getByRole("link", { name: "Arbeidsuførhet" })).to.exist;
  });
});

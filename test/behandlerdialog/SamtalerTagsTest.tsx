import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { Samtaler } from "@/components/behandlerdialog/meldinger/Samtaler";
import { queryClientWithMockData } from "../testQueryClient";
import {
  defaultMeldingResponse,
  meldingResponseMedPaminnelse,
  meldingTilBehandlerMedMeldingStatus,
  meldingTilOgFraBehandler,
} from "./meldingTestdataGenerator";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  personOppgaveBehandletBehandlerdialogSvar,
  personOppgaveBehandletBehandlerdialogUbesvartMelding,
  personOppgaveUbehandletBehandlerdialogSvar,
  personOppgaveUbehandletBehandlerdialogUbesvartMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import { MeldingStatusType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { defaultMelding } from "../../mock/isbehandlerdialog/behandlerdialogMock";

let queryClient: QueryClient;

const renderSamtaler = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Samtaler />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("Samtaletags", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Visning av tags på samtaler", () => {
    it("Viser ny-tag på samtale hvis det er en ny melding i samtalen", () => {
      const innkommendeMeldingUuid = "456uio";
      const meldingResponse = meldingTilOgFraBehandler(innkommendeMeldingUuid);
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveUbehandletBehandlerdialogSvar,
            referanseUuid: innkommendeMeldingUuid,
          },
        ]
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.getByText("Ny")).to.exist;
    });

    it("Viser venter svar-tag på samtale hvis det mangler melding fra behandler og ingen ubesvart melding-oppgave", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => defaultMeldingResponse
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.getByText("Venter på svar")).to.exist;
      expect(screen.queryByText("Påminnelse sendt")).to.not.exist;
    });

    it("Viser påminnelse sendt-tag på samtale hvis påminnelse sendt og det mangler melding fra behandler", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseMedPaminnelse
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.getByText("Påminnelse sendt")).to.exist;
      expect(screen.queryByText("Venter på svar")).to.not.exist;
    });

    it("Viser ingen tags på samtale hvis det er melding til og fra behandler uten oppgave for ny melding", () => {
      const meldingResponse = meldingTilOgFraBehandler("456uio");
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.queryByText("Ny")).to.not.exist;
      expect(screen.queryByText("Påminnelse sendt")).to.not.exist;
      expect(screen.queryByText("Venter på svar")).to.not.exist;
    });

    it("Viser ingen tags på samtale hvis det er melding til og fra behandler (inkl påminnelse) uten oppgave for ny melding", () => {
      const meldingResponse = meldingTilOgFraBehandler("456uio", true);
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.queryByText("Ny")).to.not.exist;
      expect(screen.queryByText("Påminnelse sendt")).to.not.exist;
      expect(screen.queryByText("Venter på svar")).to.not.exist;
    });

    it("Viser 'Melding ikke levert'-tag på samtale hvis status for melding er avvist", () => {
      const meldingResponse = meldingTilBehandlerMedMeldingStatus(
        MeldingStatusType.AVVIST
      );
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.getByText("Melding ikke levert")).to.exist;
    });

    it("Viser alert under melding dersom man har statusTekst for melding som er avvist", () => {
      const meldingResponse = meldingTilBehandlerMedMeldingStatus(
        MeldingStatusType.AVVIST,
        "Statustekst"
      );
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      userEvent.click(accordions[0]);
      expect(screen.getByText("Statustekst")).to.exist;
    });

    it("viser ingen tags på samtale hvis det er melding fra behandler i samtalen og oppgaven for denne er behandlet", () => {
      const innkommendeMeldingUuid = "456uio";
      const meldingResponse = meldingTilOgFraBehandler(innkommendeMeldingUuid);
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogSvar,
            referanseUuid: innkommendeMeldingUuid,
          },
        ]
      );

      renderSamtaler();
      const accordions = screen.getAllByRole("button");
      accordions.forEach((accordion) => userEvent.click(accordion));

      expect(screen.queryByText("Venter på svar")).to.not.exist;
      expect(screen.queryByText("Ny")).to.not.exist;
    });

    it("Viser vurder påminnelse tag når man har en ubehandlet ubesvart melding oppgave", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [personOppgaveUbehandletBehandlerdialogUbesvartMelding]
      );

      renderSamtaler();

      expect(screen.getByText("Vurder påminnelse")).to.exist;
    });

    it("Viser ingen tags på samtale hvis det mangler melding fra behandler, ingen påminnelse sendt og ubesvart melding-oppgave behandlet", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => defaultMeldingResponse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
            referanseUuid: defaultMelding.uuid,
          },
        ]
      );

      renderSamtaler();

      expect(screen.queryByText("Ny")).to.not.exist;
      expect(screen.queryByText("Påminnelse sendt")).to.not.exist;
      expect(screen.queryByText("Venter på svar")).to.not.exist;
      expect(screen.queryByText("Vurder påminnelse")).to.not.exist;
    });
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { Samtaler } from "@/components/behandlerdialog/meldinger/Samtaler";
import { queryClientWithMockData } from "../testQueryClient";
import {
  defaultMeldingResponse,
  meldingFraNAVConversation,
  meldingResponseLegeerklaringMedRetur,
  meldingResponseLegeerklaringMedReturOgNyLegeerklaring,
  meldingResponseLegeerklaringMedReturOgPaminnelse,
  meldingResponseMedPaminnelse,
  meldingTilBehandlerMedMeldingStatus,
  meldingTilOgFraBehandler,
  returLegeerklaring,
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
import { expect } from "chai";
import { MeldingStatusType } from "@/data/behandlerdialog/behandlerdialogTypes";
import {
  defaultMelding,
  defaultMeldingInnkommendeLegeerklaringNy,
} from "../../mock/isbehandlerdialog/behandlerdialogMock";

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
    const nyMeldingTagText = "Ny melding";
    const venterPaSvarTagText = "Venter på svar";
    const paminnelseSendtTagText = "Påminnelse sendt";
    const vurderPaminnelseTagText = "Vurder påminnelse";
    const meldingStatusFeiletTagText = "Melding ikke levert";
    const returSendtTagText = "Retur sendt";

    const assertNoTags = () => {
      expect(screen.queryByText(nyMeldingTagText)).to.not.exist;
      expect(screen.queryByText(paminnelseSendtTagText)).to.not.exist;
      expect(screen.queryByText(venterPaSvarTagText)).to.not.exist;
      expect(screen.queryByText(vurderPaminnelseTagText)).to.not.exist;
      expect(screen.queryByText(returSendtTagText)).to.not.exist;
      expect(screen.queryByText(meldingStatusFeiletTagText)).to.not.exist;
    };

    it("Viser ny melding-tag på samtale hvis det er en ny melding i samtalen med ubehandlet oppgave", () => {
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

      expect(screen.getByText(nyMeldingTagText)).to.exist;
    });

    it("Viser venter svar-tag på samtale hvis det mangler melding fra behandler og ingen ubesvart melding-oppgave", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => defaultMeldingResponse
      );

      renderSamtaler();

      expect(screen.getByText(venterPaSvarTagText)).to.exist;
      expect(screen.queryByText(paminnelseSendtTagText)).to.not.exist;
    });

    it("Viser ikke venter svar-tag på samtale hvis det mangler melding fra behandler, men er en 'melding fra NAV' som ikke nødvendigvis forventer svar", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingFraNAVConversation
      );

      renderSamtaler();

      expect(screen.queryByText(venterPaSvarTagText)).to.not.exist;
    });

    it("Viser påminnelse sendt-tag på samtale hvis påminnelse sendt og det mangler melding fra behandler", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseMedPaminnelse
      );

      renderSamtaler();

      expect(screen.getByText(paminnelseSendtTagText)).to.exist;
      expect(screen.queryByText(venterPaSvarTagText)).to.not.exist;
    });

    it("Viser retur sendt-tag på samtale hvis retur sendt på eneste legeerklæring fra behandler", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedRetur
      );

      renderSamtaler();

      expect(screen.getByText(returSendtTagText)).to.exist;
      expect(screen.queryByText(venterPaSvarTagText)).to.not.exist;
    });

    it("Viser ny melding-tag på samtale hvis retur sendt på legeerklæring, men fått ny legeerklæring fra behandler med ubehandlet oppgave", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedReturOgNyLegeerklaring
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveUbehandletBehandlerdialogSvar,
            referanseUuid: defaultMeldingInnkommendeLegeerklaringNy.uuid,
          },
        ]
      );

      renderSamtaler();

      expect(screen.getByText(nyMeldingTagText)).to.exist;
      expect(screen.queryByText(returSendtTagText)).to.not.exist;
    });

    it("Viser ingen tags på samtale hvis retur sendt på legeerklæring og fått ny legeerklæring fra behandler med behandlet oppgave", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedReturOgNyLegeerklaring
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogSvar,
            referanseUuid: defaultMeldingInnkommendeLegeerklaringNy.uuid,
          },
        ]
      );

      renderSamtaler();

      assertNoTags();
    });

    it("Viser vurder påminnelse-tag på samtale hvis retur sendt på legeerklæring med ubehandlet ubesvart melding oppgave for retur", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedRetur
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
            referanseUuid: returLegeerklaring.uuid,
          },
        ]
      );

      renderSamtaler();

      expect(screen.getByText(vurderPaminnelseTagText)).to.exist;
      expect(screen.queryByText(returSendtTagText)).to.not.exist;
    });

    it("Viser retur sendt-tag på samtale hvis retur sendt på legeerklæring og behandlet ubesvart melding oppgave for retur uten påminnelse", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedRetur
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
            referanseUuid: returLegeerklaring.uuid,
          },
        ]
      );

      renderSamtaler();

      expect(screen.getByText(returSendtTagText)).to.exist;
      expect(screen.queryByText(paminnelseSendtTagText)).to.not.exist;
    });

    it("Viser påminnelse sendt-tag hvis retur sendt på legeerklæring og behandlet ubesvart melding oppgave for retur med påminnelse", () => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedReturOgPaminnelse
      );
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogUbesvartMelding,
            referanseUuid: returLegeerklaring.uuid,
          },
        ]
      );

      renderSamtaler();

      expect(screen.getByText(paminnelseSendtTagText)).to.exist;
      expect(screen.queryByText(returSendtTagText)).to.not.exist;
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

      assertNoTags();
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

      assertNoTags();
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

      expect(screen.getByText(meldingStatusFeiletTagText)).to.exist;
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

      assertNoTags();
    });

    it("Viser vurder påminnelse tag når man har en ubehandlet ubesvart melding oppgave", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [personOppgaveUbehandletBehandlerdialogUbesvartMelding]
      );

      renderSamtaler();

      expect(screen.getByText(vurderPaminnelseTagText)).to.exist;
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

      assertNoTags();
    });
  });
});

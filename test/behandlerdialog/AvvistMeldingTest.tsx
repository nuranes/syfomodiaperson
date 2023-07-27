import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { expect } from "chai";
import { MeldingStatusType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { queryClientWithMockData } from "../testQueryClient";
import { defaultMelding } from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { AvvistMelding } from "@/components/behandlerdialog/meldinger/AvvistMelding";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  personOppgaveBehandletBehandlerdialogAvvistMelding,
  personOppgaveUbehandletBehandlerdialogAvvistMelding,
} from "../../mock/ispersonoppgave/personoppgaveMock";

let queryClient: QueryClient;

const renderAvvistMelding = (
  avvistMeldingStatusTekst: string | null,
  meldingUuid: string
) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AvvistMelding
          avvistMeldingStatusTekst={avvistMeldingStatusTekst}
          meldingUuid={meldingUuid}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

const meldingTilBehandler = {
  ...defaultMelding,
  tidspunkt: new Date(),
};

describe("Avvist melding", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  const avvistOppgaveText =
    "Jeg har registrert at meldingen ikke ble sendt og funnet andre måter å kontakte behandleren på.";
  const statusTekst = "Mottaker finnes ikke";
  const avvistStatus = {
    type: MeldingStatusType.AVVIST,
    tekst: statusTekst,
  };
  const avvistMelding = {
    ...meldingTilBehandler,
    status: avvistStatus,
  };

  it("render nothing when melding with meldingstatus OK", () => {
    renderAvvistMelding(
      meldingTilBehandler.status.tekst,
      meldingTilBehandler.uuid
    );

    expect(screen.queryByRole("div")).to.not.exist;
  });

  it("render alert with tekst when melding with meldingstatus AVVIST", () => {
    renderAvvistMelding(avvistMelding.status.tekst, avvistMelding.uuid);

    expect(screen.getByText(statusTekst)).to.exist;
    expect(screen.queryByText(avvistOppgaveText)).to.not.exist;
  });

  it("render alert with tekst and checkbox when melding with meldingstatus AVVIST and has personoppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [personOppgaveUbehandletBehandlerdialogAvvistMelding]
    );

    const melding = {
      ...avvistMelding,
      uuid: personOppgaveUbehandletBehandlerdialogAvvistMelding.referanseUuid,
    };
    renderAvvistMelding(melding.status.tekst, melding.uuid);

    expect(screen.getByText(statusTekst)).to.exist;
    expect(screen.getByText(avvistOppgaveText)).to.exist;
  });

  it("render checkbox when melding with meldingstatus AVVIST and has personoppgave, but no alert when no text", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [personOppgaveUbehandletBehandlerdialogAvvistMelding]
    );

    const melding = {
      ...avvistMelding,
      status: {
        type: MeldingStatusType.AVVIST,
        tekst: null,
      },
      uuid: personOppgaveUbehandletBehandlerdialogAvvistMelding.referanseUuid,
    };
    renderAvvistMelding(melding.status.tekst, melding.uuid);

    expect(screen.queryByText(statusTekst)).to.not.exist;
    expect(screen.getByText(avvistOppgaveText)).to.exist;
  });

  it("render alert with tekst and checkbox when melding with meldingstatus AVVIST and has behandlet personoppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [personOppgaveBehandletBehandlerdialogAvvistMelding]
    );

    const melding = {
      ...avvistMelding,
      uuid: personOppgaveBehandletBehandlerdialogAvvistMelding.referanseUuid,
    };
    renderAvvistMelding(melding.status.tekst, melding.uuid);

    expect(screen.getByText(statusTekst)).to.exist;
    expect(screen.getByText("Ferdigbehandlet av", { exact: false })).to.exist;
  });
});

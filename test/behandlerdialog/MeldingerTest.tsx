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
import { behandlerdialogMockEmpty } from "../../mock/isbehandlerdialog/behandlerdialogMock";
import { MeldingResponseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import userEvent from "@testing-library/user-event";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  personOppgaveBehandletBehandlerdialogSvar,
  personOppgaveBehandletDialogmotesvar,
  personOppgaveUbehandletBehandlerdialogSvar,
} from "../../mock/ispersonoppgave/personoppgaveMock";
import dayjs from "dayjs";
import {
  meldingFraBehandlerUtenBehandlernavn,
  meldingResponseMedPaminnelse,
  meldingResponseMedVedlegg,
} from "./meldingTestdataGenerator";

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

const seMeldingButtonTekst = "Se hele meldingen";

describe("Meldinger panel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Visning med flere samtaler", () => {
    it("Viser meldinger", () => {
      renderMeldinger();

      expect(screen.getByRole("heading", { name: "Meldinger" })).to.exist;
    });

    it("Viser accordion med en samtale", () => {
      renderMeldinger();

      const samtaleAccordion = screen.getByText("Doktor Legesen 5. januar", {
        exact: false,
      });
      expect(samtaleAccordion).to.exist;
      expect(screen.getAllByText("Dette er en melding")).to.have.length(7);
    });

    it("Meldinger sorteres i riktig rekkefølge med nyeste samtale først", () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(4);
      expect(accordions[0].textContent).to.contain("6. januar");
      expect(accordions[1].textContent).to.contain("5. januar");
      expect(accordions[2].textContent).to.contain("2. januar");
      expect(accordions[3].textContent).to.contain("1. januar");
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
        screen.getByText("Her kommer meldinger sendt til og fra behandler.")
      ).to.exist;
    });
  });

  describe("Visning av avsender", () => {
    it("Viser riktig behandlerNavn for behandlere", () => {
      renderMeldinger();

      expect(screen.getAllByText("Skrevet av Lego Las Legesen")).to.have.length(
        2
      );
      expect(screen.getByText("Skrevet av Doktor Legesen")).to.exist;
    });

    it("Skal ikke vise 'Skrevet av {navn}' hvis behandlerNavn på innkommende melding er null", () => {
      const meldingResponse: MeldingResponseDTO =
        meldingFraBehandlerUtenBehandlernavn;
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );

      renderMeldinger();

      expect(screen.queryByText("Skrevet av", { exact: false })).to.not.exist;
    });

    it("Skal vise veileders navn på utgåene meldinger", () => {
      renderMeldinger();

      expect(screen.getAllByText("Skrevet av Vetle Veileder")).to.have.length(
        7
      );
    });
  });

  describe("Forhåndsvisning av sendt meldingenTilBehandler i modal", () => {
    it("Viser 'Se melding'-knapp for melding til behandler i alle samtaler", () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(4);
      accordions.forEach((accordion) => userEvent.click(accordion));
      const seMeldingButtons = screen.getAllByRole("button", {
        name: seMeldingButtonTekst,
      });
      expect(seMeldingButtons).to.have.length(7);
    });

    it("Viser melding til behandler ved klikk på 'Se melding'-knapp", () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(4);

      const seMeldingButton = screen.getAllByRole("button", {
        name: seMeldingButtonTekst,
      })[0];
      userEvent.click(seMeldingButton);

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
  });

  describe("Visning av paminnelse i samtale og modal", () => {
    beforeEach(() => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseMedPaminnelse
      );
    });
    it("Viser overskrift for påminnelse i samtalen", () => {
      renderMeldinger();

      expect(
        screen.getByText("Påminnelse om manglende svar vedrørerende pasient")
      ).to.exist;
      expect(
        screen.getAllByRole("img", {
          name: "Bjelle-ikon for påminnelse",
        })
      ).to.have.length(2);
    });

    it("Viser påminnelse ved klikk på 'Se melding'-knapp", () => {
      renderMeldinger();

      const seMeldingButton = screen.getAllByRole("button", {
        name: seMeldingButtonTekst,
      })[1];
      userEvent.click(seMeldingButton);

      const seMeldingModal = screen.getByRole("dialog", {
        name: "Vis melding",
      });
      expect(seMeldingModal).to.exist;

      expect(
        within(seMeldingModal).getByText(
          "Påminnelse om manglende svar vedrørerende pasient"
        )
      ).to.exist;
    });
  });

  describe("Visning av vedlegg", () => {
    it("Viser vedlegg-ikon og tekst for meldinger fra behandler med vedlegg", () => {
      const meldingResponse = meldingResponseMedVedlegg;

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
      expect(`Vedlegg ${meldingerMedVedlegg[0].antallVedlegg}`).to.exist;
      expect(`Vedlegg ${meldingerMedVedlegg[1].antallVedlegg}`).to.exist;
      expect(`Vedlegg ${meldingerMedVedlegg[2].antallVedlegg}`).to.exist;
    });
  });

  describe("Behandling av personoppgave", () => {
    const ubehandletCheckboxTekst =
      "Marker nye svar som lest. Oppgaven vil da fjernes fra oversikten.";
    it("Viser ubehandlet personoppgave for behandlerdialog svar", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveUbehandletBehandlerdialogSvar,
          },
          personOppgaveBehandletBehandlerdialogSvar,
        ]
      );

      renderMeldinger();

      expect(screen.getByText(ubehandletCheckboxTekst)).to.exist;
    });

    it("Viser behandlet personoppgave for behandlerdialog svar", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogSvar,
          },
        ]
      );
      renderMeldinger();

      expect(screen.getByText("Siste svar lest av", { exact: false })).to.exist;
    });

    it("Viser siste ferdigbehandlede personoppgave for behandlerdialog svar når alle oppgaver behandlet", () => {
      const twoDaysAgo = dayjs(new Date()).subtract(2, "days");
      const threeDaysAgo = dayjs(new Date()).subtract(3, "days");
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [
          {
            ...personOppgaveBehandletBehandlerdialogSvar,
            behandletTidspunkt: twoDaysAgo.toDate(),
          },
          {
            ...personOppgaveBehandletBehandlerdialogSvar,
            behandletTidspunkt: threeDaysAgo.toDate(),
          },
        ]
      );
      renderMeldinger();

      const expectedFerdigbehandledText = `Siste svar lest av Z991100 ${twoDaysAgo.format(
        "DD.MM.YYYY"
      )}`;
      expect(screen.getByText(expectedFerdigbehandledText)).to.exist;
    });

    it("Viser ingen oppgave når ingen behandlerdialog-oppgaver", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [{ ...personOppgaveBehandletDialogmotesvar }]
      );

      renderMeldinger();

      expect(screen.queryByText("Siste svar lest av", { exact: false })).to.not
        .exist;
      expect(screen.queryByText(ubehandletCheckboxTekst, { exact: false })).to
        .not.exist;
    });

    it("Viser ingen oppgave når ingen oppgaver", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => []
      );

      renderMeldinger();

      expect(screen.queryByText("Siste svar lest av", { exact: false })).to.not
        .exist;
      expect(screen.queryByText(ubehandletCheckboxTekst, { exact: false })).to
        .not.exist;
    });
  });
});

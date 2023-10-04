import { render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { Meldinger } from "@/components/behandlerdialog/meldinger/Meldinger";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { behandlerdialogMockEmpty } from "../../mock/isbehandlerdialog/behandlerdialogMock";
import {
  MeldingResponseDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
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
  meldingResponseLegeerklaring,
  meldingResponseLegeerklaringMedTreVedlegg,
  meldingResponseLegeerklaringMedRetur,
  meldingResponseMedPaminnelse,
  meldingResponseMedVedlegg,
  meldingTilOgFraBehandler,
  returLegeerklaring,
  meldingFraNAVConversationMedSvar,
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
      expect(screen.getAllByText("Dette er en melding")).to.have.length(11);
    });

    it("Meldinger sorteres i riktig rekkefølge med nyeste samtale først", () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(7);
      expect(accordions[0].textContent).to.contain("7. januar");
      expect(accordions[1].textContent).to.contain("6. januar");
      expect(accordions[2].textContent).to.contain("5. januar");
      expect(accordions[3].textContent).to.contain("4. januar");
      expect(accordions[4].textContent).to.contain("3. januar");
      expect(accordions[5].textContent).to.contain("2. januar");
      expect(accordions[6].textContent).to.contain("1. januar");
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
      expect(screen.getAllByText("Skrevet av Doktor Legesen")).to.have.length(
        3
      );
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

    it("Skal vise veileders navn på utgående meldinger", () => {
      renderMeldinger();

      expect(screen.getAllByText("Skrevet av Vetle Veileder")).to.have.length(
        11
      );
    });
  });

  describe("Visning av type melding", () => {
    it("Viser type inkl takst på meldinger forespørsel og svar tilleggsopplysninger", () => {
      const meldingResponse = meldingTilOgFraBehandler("123uid");
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      const antallMeldinger = Object.values(
        meldingResponse.conversations
      ).flat().length;

      renderMeldinger();

      expect(screen.getAllByText("Tilleggsopplysninger L8")).to.have.length(
        antallMeldinger
      );
    });

    it("Viser type inkl takst på meldinger forespørsel og svar legeerklaring", () => {
      const meldingResponse = meldingResponseLegeerklaring;
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      const antallMeldinger = Object.values(
        meldingResponse.conversations
      ).flat().length;

      renderMeldinger();

      expect(screen.getAllByText("Legeerklæring L40")).to.have.length(
        antallMeldinger
      );
    });

    it("Viser at antall melding som finnes av meldingtype 'melding fra NAV', rendres", () => {
      const meldingResponse = meldingFraNAVConversationMedSvar;
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );
      const antallMeldinger = Object.values(
        meldingResponse.conversations
      ).flat().length;

      renderMeldinger();

      expect(screen.getAllByText("Melding fra NAV")).to.have.length(
        antallMeldinger
      );
    });

    it("Viser type inkl takst på påminnelse-meldinger", () => {
      const meldingResponse = meldingTilOgFraBehandler("123uid", true);
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponse
      );

      const antallPaminnelseMeldinger = Object.values(
        meldingResponse.conversations
      )
        .flat()
        .filter(
          (melding) =>
            melding.type === MeldingType.FORESPORSEL_PASIENT_PAMINNELSE
        ).length;
      renderMeldinger();

      expect(screen.getAllByText("Påminnelse")).to.have.length(
        antallPaminnelseMeldinger
      );
    });
  });

  describe("Forhåndsvisning av sendt meldingenTilBehandler i modal", () => {
    it("Viser 'Se melding'-knapp for melding til behandler i alle samtaler", async () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(7);
      accordions.forEach((accordion) => userEvent.click(accordion));
      const seMeldingButtons = screen.getAllByRole("button", {
        name: seMeldingButtonTekst,
      });
      expect(seMeldingButtons).to.have.length(11);
    });

    it("Viser melding til behandler ved klikk på 'Se melding'-knapp", () => {
      renderMeldinger();

      const accordions = screen.getAllByRole("button", {
        name: /januar/,
      });
      expect(accordions).to.have.length(7);

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

  describe("Visning av retur i samtale og modal", () => {
    const expectedReturBegrunnelse = returLegeerklaring.tekst;
    beforeEach(() => {
      queryClient.setQueryData(
        behandlerdialogQueryKeys.behandlerdialog(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => meldingResponseLegeerklaringMedRetur
      );
    });
    it("Viser begrunnelse for retur i samtalen", () => {
      renderMeldinger();

      expect(screen.getByText(expectedReturBegrunnelse)).to.exist;
      expect(
        screen.getAllByRole("img", {
          name: "Tilbakepil-ikon for retur",
        })
      ).to.have.length(2);
    });

    it("Viser retur ved klikk på 'Se melding'-knapp", () => {
      renderMeldinger();

      const seMeldingButton = screen.getAllByRole("button", {
        name: seMeldingButtonTekst,
      })[1];
      userEvent.click(seMeldingButton);

      const seMeldingModal = screen.getByRole("dialog", {
        name: "Vis melding",
      });
      expect(seMeldingModal).to.exist;

      expect(within(seMeldingModal).getByText(expectedReturBegrunnelse)).to
        .exist;
    });
  });

  describe("Visning av vedlegg", () => {
    describe("for meldinger fra behandler (tilleggsopplysninger)", () => {
      it("Viser vedlegg-ikon og tekst med vedlegg-nummer", () => {
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
        expect(
          screen.getAllByRole("link", {
            name: `Vedlegg ${meldingerMedVedlegg[0].antallVedlegg}`,
          })
        ).to.not.be.empty;
        expect(
          screen.getAllByRole("link", {
            name: `Vedlegg ${meldingerMedVedlegg[1].antallVedlegg}`,
          })
        ).to.not.be.empty;
        expect(
          screen.getAllByRole("link", {
            name: `Vedlegg ${meldingerMedVedlegg[2].antallVedlegg}`,
          })
        ).to.not.be.empty;
      });
    });
    describe("for melding fra behandler (legeerklæring)", () => {
      it("Viser vedlegg-ikon og tekst 'Legeerklæring' for første vedlegg", () => {
        queryClient.setQueryData(
          behandlerdialogQueryKeys.behandlerdialog(
            ARBEIDSTAKER_DEFAULT.personIdent
          ),
          () => meldingResponseLegeerklaring
        );

        renderMeldinger();

        const accordions = screen.getAllByRole("button");
        accordions.forEach((accordion) => userEvent.click(accordion));

        expect(screen.getByRole("img", { name: "Binders-ikon for vedlegg" })).to
          .exist;
        expect(screen.getByRole("link", { name: "Legeerklæring" })).to.exist;
        expect(screen.queryByRole("link", { name: "Vedlegg 1" })).to.not.exist;
      });
      it("Viser vedlegg-ikon og tekst med vedlegg-nummer for andre vedlegg enn første", () => {
        const meldingResponse = meldingResponseLegeerklaringMedTreVedlegg;

        queryClient.setQueryData(
          behandlerdialogQueryKeys.behandlerdialog(
            ARBEIDSTAKER_DEFAULT.personIdent
          ),
          () => meldingResponse
        );

        renderMeldinger();

        const accordions = screen.getAllByRole("button");
        accordions.forEach((accordion) => userEvent.click(accordion));

        expect(screen.getByRole("img", { name: "Binders-ikon for vedlegg" })).to
          .exist;
        expect(screen.getByRole("link", { name: "Legeerklæring" })).to.exist;
        expect(screen.getByRole("link", { name: "Vedlegg 1" })).to.exist;
        expect(screen.getByRole("link", { name: "Vedlegg 2" })).to.exist;
      });
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

      const expectedFerdigbehandledText = `Siste svar lest av ${
        VEILEDER_DEFAULT.navn
      } ${twoDaysAgo.format("DD.MM.YYYY")}`;
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

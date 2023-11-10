import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../testQueryClient";
import {
  createAktivitetskrav,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import {
  changeTextInput,
  clickButton,
  clickTab,
  daysFromToday,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
  SendForhandsvarselDTO,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect } from "chai";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";
import { Modal } from "@navikt/ds-react";
import { getSendForhandsvarselDocument } from "./varselDocuments";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { personOppgaveUbehandletVurderStans } from "../../mock/ispersonoppgave/personoppgaveMock";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { begrunnelseMaxLength } from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";
import { apiMock } from "../stubs/stubApi";
import {
  stubVurderAktivitetskravApi,
  stubVurderAktivitetskravForhandsvarselApi,
} from "../stubs/stubIsaktivitetskrav";
import nock from "nock";

let queryClient: QueryClient;
let apiMockScope: any;

const aktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.NY
);
const forhandsvarselAktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.FORHANDSVARSEL
);
const tilfelleStart = daysFromToday(-50);
const tilfelleEnd = daysFromToday(50);
const oppfolgingstilfelle = generateOppfolgingstilfelle(
  tilfelleStart,
  tilfelleEnd
);

const buttonTexts = {
  [AktivitetskravStatus.AVVENT]: "Avvent",
  [AktivitetskravStatus.IKKE_AKTUELL]: "Ikke aktuell",
};

const tabTexts = {
  [AktivitetskravStatus.UNNTAK]: "Sett unntak",
  [AktivitetskravStatus.OPPFYLT]: "Er i aktivitet",
  [AktivitetskravStatus.FORHANDSVARSEL]: "Send forhåndsvarsel",
  [AktivitetskravStatus.IKKE_OPPFYLT]: "Ikke oppfylt",
};

const enBeskrivelse = "Her er en beskrivelse";

const renderVurderAktivitetskrav = (
  aktivitetskravDto: AktivitetskravDTO,
  oppfolgingstilfelleDto: OppfolgingstilfelleDTO | undefined
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VurderAktivitetskrav
          aktivitetskrav={aktivitetskravDto}
          oppfolgingstilfelle={oppfolgingstilfelleDto}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
describe("VurderAktivitetskrav", () => {
  Modal.setAppElement(document.createElement("div"));
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("renders buttons for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    expect(screen.queryByRole("button", { name: "Avvent" })).to.exist;
    expect(screen.queryByRole("button", { name: "Ikke aktuell" })).to.exist;
  });

  it("renders tabs for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.not.exist;
  });

  it("renders ikke-oppfylt when ubehandlet vurder-stans oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [personOppgaveUbehandletVurderStans]
    );

    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.exist;
  });

  it("renders periode for oppfølgingstilfelle", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
  });

  describe("Oppfylt", () => {
    it("Validerer årsak og maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickTab(tabTexts["OPPFYLT"]);
      const tooLongBeskrivelse = getTooLongText(begrunnelseMaxLength);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      stubVurderAktivitetskravApi(apiMockScope);

      clickTab(tabTexts["OPPFYLT"]);

      expect(screen.getByRole("heading", { name: "Er i aktivitet" })).to.exist;

      const arsakRadioButton = screen.getByText("Friskmeldt");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      await waitFor(() => {
        const vurderOppfyltMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enBeskrivelse,
          status: AktivitetskravStatus.OPPFYLT,
          arsaker: [OppfyltVurderingArsak.FRISKMELDT],
        };
        expect(vurderOppfyltMutation.options.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(enBeskrivelse)).to.not.exist;
    });
  });
  describe("Unntak", () => {
    it("Validerer årsak og maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickTab(tabTexts["UNNTAK"]);
      const tooLongBeskrivelse = getTooLongText(begrunnelseMaxLength);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      stubVurderAktivitetskravApi(apiMockScope);

      clickTab(tabTexts["UNNTAK"]);

      expect(
        screen.getByRole("heading", {
          name: "Sett unntak fra aktivitetskravet",
        })
      ).to.exist;

      const arsakRadioButton = screen.getByText("Tilrettelegging ikke mulig");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      await waitFor(() => {
        const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enBeskrivelse,
          status: AktivitetskravStatus.UNNTAK,
          arsaker: [UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG],
        };
        expect(vurderUnntakMutation.options.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(enBeskrivelse)).to.not.exist;
    });
  });
  describe("Avvent", () => {
    it("Validerer årsaker, beskrivelse og dato", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["AVVENT"]);
      const lagreButton = within(screen.getByRole("dialog")).getByRole(
        "button",
        { name: "Lagre" }
      );
      fireEvent.click(lagreButton);

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText(/Vennligst angi en gyldig dato/)).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      stubVurderAktivitetskravApi(apiMockScope);

      clickButton(buttonTexts["AVVENT"]);

      expect(
        screen.getByRole("heading", {
          name: "Avvent",
        })
      ).to.exist;

      const arsakOppfolgingsplanRadioButton = screen.getByText(
        "Har bedt om oppfølgingsplan fra arbeidsgiver"
      );
      fireEvent.click(arsakOppfolgingsplanRadioButton);
      const arsakBehandlerRadioButton = screen.getByText(
        "Har bedt om mer informasjon fra behandler"
      );
      fireEvent.click(arsakBehandlerRadioButton);
      const arsakDroftesMedROLRadioButton = screen.getByText("Drøftes med ROL");
      fireEvent.click(arsakDroftesMedROLRadioButton);
      const arsakDroftesInterntRadioButton =
        screen.getByText("Drøftes internt");
      fireEvent.click(arsakDroftesInterntRadioButton);

      const beskrivelseInputs = screen.getByRole("textbox", {
        name: "Begrunnelse",
      });
      changeTextInput(beskrivelseInputs, enBeskrivelse);

      const today = dayjs();
      const datoInput = getTextInput("Avventer til");
      changeTextInput(datoInput, today.format("DD.MM.YYYY"));

      const lagreButton = within(screen.getByRole("dialog")).getByRole(
        "button",
        { name: "Lagre" }
      );
      fireEvent.click(lagreButton);

      await waitFor(() => {
        const vurderAvventMutation = queryClient.getMutationCache().getAll()[0];
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enBeskrivelse,
          status: AktivitetskravStatus.AVVENT,
          arsaker: [
            AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
            AvventVurderingArsak.INFORMASJON_BEHANDLER,
            AvventVurderingArsak.DROFTES_MED_ROL,
            AvventVurderingArsak.DROFTES_INTERNT,
          ],
          frist: today.format("YYYY-MM-DD"),
        };
        expect(vurderAvventMutation.options.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(enBeskrivelse)).to.not.exist;
    });
  });
  describe("Ikke oppfylt", () => {
    it("Is not showing when status is not FORHANDSVARSEL", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      expect(screen.queryByRole("button", { name: "Ikke oppfylt" })).to.not
        .exist;
    });
  });
  describe("Send forhåndsvarsel", () => {
    it("Does not show AVVENT choice when forhandsvarsel is sent", () => {
      renderVurderAktivitetskrav(
        forhandsvarselAktivitetskrav,
        oppfolgingstilfelle
      );

      expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to
        .exist;
      expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.not.exist;
      expect(screen.queryByRole("button", { name: "Avvent" })).to.not.exist;
    });

    it("Send forhåndsvarsel with beskrivelse filled in, and reset form after submit", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      stubVurderAktivitetskravForhandsvarselApi(apiMockScope);
      const beskrivelseLabel = "Begrunnelse (obligatorisk)";

      clickTab(tabTexts["FORHANDSVARSEL"]);

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: beskrivelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(beskrivelseLabel);
      changeTextInput(beskrivelseInput, enBeskrivelse);

      clickButton("Send");

      await waitFor(() => {
        const sendForhandsvarselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: SendForhandsvarselDTO = {
          fritekst: enBeskrivelse,
          document: getSendForhandsvarselDocument(enBeskrivelse),
        };
        expect(sendForhandsvarselMutation.options.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(enBeskrivelse)).to.not.exist;
    });
    it("IKKE_OPPFYLT is present when status is forhandsvarsel and it is expired", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [personOppgaveUbehandletVurderStans]
      );
      renderVurderAktivitetskrav(
        forhandsvarselAktivitetskrav,
        oppfolgingstilfelle
      );

      clickTab(tabTexts["IKKE_OPPFYLT"]);

      expect(
        screen.getByRole("heading", {
          name: "Ikke oppfylt",
        })
      ).to.exist;

      expect(
        screen.getByText(/Innstilling må skrives og sendes til NAY i Gosys/)
      ).to.exist;
      clickButton("Lagre");

      const vurderIkkeOppfyltMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        status: AktivitetskravStatus.IKKE_OPPFYLT,
        arsaker: [],
      };
      expect(vurderIkkeOppfyltMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
    it("Fails to send forhåndsvarsel when no beskrivelse is filled in", async () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      clickTab(tabTexts["FORHANDSVARSEL"]);
      clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });
  });
  describe("Ikke aktuell", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["IKKE_AKTUELL"]);

      const ikkeAktuellModal = screen.getByRole("dialog");

      expect(ikkeAktuellModal).to.exist;
      expect(
        within(ikkeAktuellModal).getByRole("heading", {
          name: "Ikke aktuell",
        })
      ).to.exist;
      expect(
        within(ikkeAktuellModal).getByText(
          /Aktivitetskravet skal ikke vurderes for denne personen/
        )
      ).to.exist;

      const lagreButton = within(screen.getByRole("dialog")).getByRole(
        "button",
        { name: "Lagre" }
      );
      fireEvent.click(lagreButton);

      const vurderIkkeAktuellMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        status: AktivitetskravStatus.IKKE_AKTUELL,
        arsaker: [],
      };
      expect(vurderIkkeAktuellMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
});

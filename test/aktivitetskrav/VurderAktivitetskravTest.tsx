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
import { VurderAktivitetskrav } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../testQueryClient";
import {
  avventVurdering,
  createAktivitetskrav,
  forhandsvarselVurdering,
  generateOppfolgingstilfelle,
  oppfyltVurdering,
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
  IkkeAktuellArsak,
  OppfyltVurderingArsak,
  SendForhandsvarselDTO,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect } from "chai";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import dayjs from "dayjs";
import {
  getIkkeAktuellDocument,
  getOppfyltDocument,
  getSendForhandsvarselDocument,
  getUnntakDocument,
} from "./varselDocuments";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { personOppgaveUbehandletVurderStans } from "../../mock/ispersonoppgave/personoppgaveMock";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { apiMock } from "../stubs/stubApi";
import {
  stubVurderAktivitetskravApi,
  stubVurderAktivitetskravForhandsvarselApi,
} from "../stubs/stubIsaktivitetskrav";
import nock from "nock";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NotificationContext } from "@/context/notification/NotificationContext";
import { Brevmal } from "@/data/aktivitetskrav/forhandsvarselTexts";

let queryClient: QueryClient;
let apiMockScope: any;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const aktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.NY
);
const forhandsvarselAktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.FORHANDSVARSEL,
  [forhandsvarselVurdering]
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

const enLangBeskrivelse = "Her er en beskrivelse" + "t".repeat(900);
const enKortBeskrivelse = "Her er en beskrivelse" + "t".repeat(150);

const renderVurderAktivitetskrav = (aktivitetskravDto: AktivitetskravDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <VurderAktivitetskrav aktivitetskrav={aktivitetskravDto} />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
describe("VurderAktivitetskrav", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("renders buttons for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav);

    expect(screen.queryByRole("button", { name: "Avvent" })).to.exist;
    expect(screen.queryByRole("button", { name: "Ikke aktuell" })).to.exist;
  });

  it("renders tabs for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav);

    expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.exist;
  });

  it("renders ikke-oppfylt when ubehandlet vurder-stans oppgave", () => {
    queryClient.setQueryData(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [personOppgaveUbehandletVurderStans]
    );

    renderVurderAktivitetskrav(aktivitetskrav);

    expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.exist;
    expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.exist;
  });

  it("renders periode for oppfølgingstilfelle", () => {
    queryClient.setQueryData(
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
      () => ({
        personIdent: fnr,
        oppfolgingstilfelleList: [oppfolgingstilfelle],
      })
    );
    renderVurderAktivitetskrav(aktivitetskrav);

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
  });

  describe("Oppfylt", () => {
    it("Validerer årsak og maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickTab(tabTexts["OPPFYLT"]);
      const tooLongBeskrivelse = getTooLongText(1000);
      const beskrivelseInput = getTextInput("Begrunnelse");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravApi(apiMockScope);

      clickTab(tabTexts["OPPFYLT"]);

      expect(screen.getByRole("heading", { name: "Er i aktivitet" })).to.exist;

      const arsakRadioButton = screen.getByText("Friskmeldt");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Begrunnelse");
      changeTextInput(beskrivelseInput, enLangBeskrivelse);
      clickButton("Lagre");

      await waitFor(() => {
        const vurderOppfyltMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedArsak = OppfyltVurderingArsak.FRISKMELDT;
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enLangBeskrivelse,
          status: AktivitetskravStatus.OPPFYLT,
          arsaker: [expectedArsak],
          document: getOppfyltDocument(enLangBeskrivelse, expectedArsak),
        };
        expect(vurderOppfyltMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });
  });
  describe("Unntak", () => {
    it("Validerer årsak og maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickTab(tabTexts["UNNTAK"]);
      const tooLongBeskrivelse = getTooLongText(1000);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
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
      changeTextInput(beskrivelseInput, enLangBeskrivelse);
      clickButton("Lagre");

      await waitFor(() => {
        const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
        const expectedArsak = UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG;
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enLangBeskrivelse,
          status: AktivitetskravStatus.UNNTAK,
          arsaker: [expectedArsak],
          document: getUnntakDocument(enLangBeskrivelse, expectedArsak),
        };
        expect(vurderUnntakMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });
  });
  describe("Avvent", () => {
    it("Validerer maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickButton(buttonTexts["AVVENT"]);
      const avventModal = screen.getAllByRole("dialog", { hidden: true })[0];
      const lagreButton = within(avventModal).getByRole("button", {
        name: "Lagre",
        hidden: true,
      });
      const tooLongBeskrivelse = getTooLongText(200);
      const beskrivelseInput = screen.getByRole("textbox", {
        name: "Beskrivelse",
        hidden: true,
      });
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      fireEvent.click(lagreButton);

      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Validerer årsaker og dato", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickButton(buttonTexts["AVVENT"]);
      const avventModal = screen.getAllByRole("dialog", { hidden: true })[0];
      const lagreButton = within(avventModal).getByRole("button", {
        name: "Lagre",
        hidden: true,
      });
      fireEvent.click(lagreButton);

      expect(await screen.findByText("Vennligst angi årsak")).to.exist;
      expect(await screen.findByText(/Vennligst angi en gyldig dato/)).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema, og reset skjema etter innsending", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      stubVurderAktivitetskravApi(apiMockScope);

      clickButton(buttonTexts["AVVENT"]);

      expect(
        screen.getByRole("heading", {
          name: "Avvent",
          hidden: true,
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

      const beskrivelseInput = screen.getByRole("textbox", {
        name: "Beskrivelse",
        hidden: true,
      });
      changeTextInput(beskrivelseInput, enKortBeskrivelse);

      const today = dayjs();
      const datoInput = screen.getByRole("textbox", {
        name: "Avventer til",
        hidden: true,
      });
      changeTextInput(datoInput, today.format("DD.MM.YYYY"));

      const avventModal = screen.getAllByRole("dialog", { hidden: true })[0];
      const lagreButton = within(avventModal).getByRole("button", {
        name: "Lagre",
        hidden: true,
      });
      fireEvent.click(lagreButton);

      await waitFor(() => {
        const vurderAvventMutation = queryClient.getMutationCache().getAll()[0];
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          beskrivelse: enKortBeskrivelse,
          status: AktivitetskravStatus.AVVENT,
          arsaker: [
            AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
            AvventVurderingArsak.INFORMASJON_BEHANDLER,
            AvventVurderingArsak.DROFTES_MED_ROL,
            AvventVurderingArsak.DROFTES_INTERNT,
          ],
          frist: today.format("YYYY-MM-DD"),
        };
        expect(vurderAvventMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });
  });
  describe("Ikke oppfylt", () => {
    it("Is not showing when status is not FORHANDSVARSEL", () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      expect(screen.queryByRole("button", { name: "Ikke oppfylt" })).to.not
        .exist;
    });
  });
  describe("Send forhåndsvarsel", () => {
    it("Does not show AVVENT or FORHANDSVARSEL choice when forhandsvarsel is sent", () => {
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

      expect(screen.queryByRole("tab", { name: "Sett unntak" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Er i aktivitet" })).to.exist;
      expect(screen.queryByRole("tab", { name: "Send forhåndsvarsel" })).to.not
        .exist;
      expect(screen.queryByRole("tab", { name: "Ikke oppfylt" })).to.exist;
      expect(screen.queryByRole("button", { name: "Avvent" })).to.not.exist;
    });

    it("Viser select for valg av mal med 'Med arbeidsgiver' forhåndsvalgt", () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      clickTab(tabTexts["FORHANDSVARSEL"]);

      const velgMalSelect = screen.getByRole("combobox");
      expect(
        within(velgMalSelect).getByRole("option", { name: "Har arbeidsgiver" })
      ).to.exist;
      expect(
        within(velgMalSelect).getByRole("option", {
          name: "Har ikke arbeidsgiver",
        })
      ).to.exist;
      expect(screen.getByDisplayValue("Har arbeidsgiver")).to.exist;
      expect(screen.queryByDisplayValue("Har ikke arbeidsgiver")).to.not.exist;
    });

    it("Send forhåndsvarsel with beskrivelse filled in, and reset form after submit", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
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
      changeTextInput(beskrivelseInput, enLangBeskrivelse);

      clickButton("Send");

      await waitFor(() => {
        const sendForhandsvarselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: SendForhandsvarselDTO = {
          fritekst: enLangBeskrivelse,
          document: getSendForhandsvarselDocument(enLangBeskrivelse),
        };
        expect(sendForhandsvarselMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("Send forhåndsvarsel with mal 'Uten arbeidsgiver'", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
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
      changeTextInput(beskrivelseInput, enLangBeskrivelse);

      const velgMalSelect = screen.getByRole("combobox");
      fireEvent.change(velgMalSelect, {
        target: { value: "UTEN_ARBEIDSGIVER" },
      });

      clickButton("Send");

      await waitFor(() => {
        const sendForhandsvarselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: SendForhandsvarselDTO = {
          fritekst: enLangBeskrivelse,
          document: getSendForhandsvarselDocument(
            enLangBeskrivelse,
            Brevmal.UTEN_ARBEIDSGIVER
          ),
        };
        expect(sendForhandsvarselMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      await waitFor(
        () => expect(screen.queryByText(enLangBeskrivelse)).to.not.exist
      );
    });

    it("IKKE_OPPFYLT is present when status is forhandsvarsel and it is expired", () => {
      queryClient.setQueryData(
        personoppgaverQueryKeys.personoppgaver(
          ARBEIDSTAKER_DEFAULT.personIdent
        ),
        () => [personOppgaveUbehandletVurderStans]
      );
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

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
      expect(vurderIkkeOppfyltMutation.state.variables).to.deep.equal(
        expectedVurdering
      );
    });
    it("Fails to send forhåndsvarsel when no beskrivelse is filled in", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      clickTab(tabTexts["FORHANDSVARSEL"]);
      clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });
    it("Validerer maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);
      clickTab(tabTexts["FORHANDSVARSEL"]);

      const tooLongBeskrivelse = getTooLongText(1000);
      const beskrivelseInput = getTextInput("Begrunnelse (obligatorisk)");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Send");

      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
  });
  describe("Ikke aktuell", () => {
    it("Validerer maks tegn beskrivelse", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickButton(buttonTexts["IKKE_AKTUELL"]);

      const ikkeAktuellModal = screen.getByRole("dialog", {
        hidden: true,
      });
      const tooLongBeskrivelse = getTooLongText(1000);
      const beskrivelseInputs = screen.getByRole("textbox", {
        name: "Begrunnelse",
        hidden: true,
      });
      changeTextInput(beskrivelseInputs, tooLongBeskrivelse);
      const lagreButton = within(ikkeAktuellModal).getByRole("button", {
        name: "Lagre",
        hidden: true,
      });
      fireEvent.click(lagreButton);

      expect(await screen.findByText("1 tegn for mye")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", async () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      clickButton(buttonTexts["IKKE_AKTUELL"]);

      const ikkeAktuellModal = screen.getByRole("dialog", {
        hidden: true,
      });

      expect(ikkeAktuellModal).to.exist;
      expect(
        within(ikkeAktuellModal).getByRole("heading", {
          name: "Ikke aktuell",
          hidden: true,
        })
      ).to.exist;
      expect(
        within(ikkeAktuellModal).getByText(
          /Aktivitetskravet skal ikke vurderes for denne personen/
        )
      ).to.exist;

      const arsakRadioButton = screen.getByText("Innbygger er innvilget VTA");
      fireEvent.click(arsakRadioButton);

      const beskrivelseInputs = screen.getByRole("textbox", {
        name: "Begrunnelse",
        hidden: true,
      });
      changeTextInput(beskrivelseInputs, enLangBeskrivelse);

      const lagreButton = within(ikkeAktuellModal).getByRole("button", {
        name: "Lagre",
        hidden: true,
      });
      fireEvent.click(lagreButton);
      await waitFor(() => {
        const vurderIkkeAktuellMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedArsak = IkkeAktuellArsak.INNVILGET_VTA;
        const expectedVurdering: CreateAktivitetskravVurderingDTO = {
          status: AktivitetskravStatus.IKKE_AKTUELL,
          beskrivelse: enLangBeskrivelse,
          arsaker: [expectedArsak],
          document: getIkkeAktuellDocument(enLangBeskrivelse, expectedArsak),
        };
        expect(vurderIkkeAktuellMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });
  });
  describe("Vurdering alert", () => {
    it("viser alert for aktivitetskrav med siste vurdering AVVENT", () => {
      const aktivitetskravAvvent = createAktivitetskrav(
        daysFromToday(20),
        AktivitetskravStatus.AVVENT,
        [avventVurdering]
      );
      renderVurderAktivitetskrav(aktivitetskravAvvent);

      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    });
    it("viser alert for aktivitetskrav med siste vurdering FORHANDSVARSEL", () => {
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

      expect(screen.getByRole("img", { name: "Informasjon" })).to.exist;
    });
    it("viser ingen alert når aktivitetskrav har siste vurdering OPPFYLT", () => {
      const aktivitetskravOppfylt = createAktivitetskrav(
        daysFromToday(20),
        AktivitetskravStatus.OPPFYLT,
        [oppfyltVurdering]
      );
      renderVurderAktivitetskrav(aktivitetskravOppfylt);

      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(screen.queryByRole("img", { name: "Suksess" })).to.not.exist;
      expect(screen.queryByRole("img", { name: "Info" })).to.not.exist;
    });
    it("viser ingen alert når aktivitetskrav har ingen vurdering", () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(screen.queryByRole("img", { name: "Suksess" })).to.not.exist;
      expect(screen.queryByRole("img", { name: "Info" })).to.not.exist;
    });
  });
  describe("ForhandsvarselOppsummering", () => {
    it("Viser oppsummering når forhåndsvarsel er sendt", () => {
      renderVurderAktivitetskrav(forhandsvarselAktivitetskrav);

      expect(
        screen.getByRole("heading", {
          name: "Oppsummering av forhåndsvarselet",
        })
      ).to.exist;
      expect(screen.getByText("Frist: ", { exact: false })).to.exist;
      expect(
        screen.getByText(
          "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer."
        )
      ).to.exist;
    });

    it("Viser ikke oppsummering når forhåndsvarsel ikke er sendt", () => {
      renderVurderAktivitetskrav(aktivitetskrav);

      expect(
        screen.queryByRole("heading", {
          name: "Oppsummering av forhåndsvarselet",
        })
      ).to.not.exist;
      expect(screen.queryByText("Frist: ", { exact: false })).to.not.exist;
      expect(
        screen.queryByText(
          "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer."
        )
      ).to.not.exist;
    });
  });
});

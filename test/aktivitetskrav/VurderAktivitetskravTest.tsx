import { fireEvent, render, screen } from "@testing-library/react";
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
  daysFromToday,
  getButton,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
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
import { vurderAktivitetskravBeskrivelseMaxLength } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";
import { Modal } from "@navikt/ds-react";
import { getSendForhandsvarselDocument } from "./varselDocuments";

let queryClient: QueryClient;

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

export const buttonTexts = {
  [AktivitetskravStatus.AVVENT]: "Avventer",
  [AktivitetskravStatus.UNNTAK]: "Sett unntak",
  [AktivitetskravStatus.OPPFYLT]: "Er i aktivitet",
  [AktivitetskravStatus.FORHANDSVARSEL]: "Send forhåndsvarsel",
  [AktivitetskravStatus.IKKE_OPPFYLT]: "Ikke oppfylt",
  [AktivitetskravStatus.IKKE_AKTUELL]: "Ikke aktuell",
  [AktivitetskravStatus.FORHANDSVARSEL]: "Send forhåndsvarsel",
};

const enBeskrivelse = "Her er en beskrivelse";

const renderVurderAktivitetskrav = (
  aktivitetskravDto: AktivitetskravDTO | undefined,
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
  });
  it("renders buttons for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
    Object.values(buttonTexts).forEach(
      (text) => expect(getButton(text)).to.exist
    );
  });
  it("renders periode for oppfølgingstilfelle", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
  });
  it("renders helptext tooltip", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    const tooltip = screen.getByRole("button", { name: /hjelp/ });
    expect(tooltip).to.exist;

    const buttonTexts = [
      "Avventer",
      "Sett unntak",
      "Er i aktivitet",
      "Ikke oppfylt",
      "Ikke aktuell",
    ];
    const buttonTextsJoined = Object.values(buttonTexts).join(", ");
    expect(screen.getByText(buttonTextsJoined, { exact: false })).to.exist;
  });
  describe("Oppfylt", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["OPPFYLT"]);
      const tooLongBeskrivelse = getTooLongText(
        vurderAktivitetskravBeskrivelseMaxLength
      );
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi årsak")).to.exist;
      expect(
        screen.getByText(
          maxLengthErrorMessage(vurderAktivitetskravBeskrivelseMaxLength)
        )
      ).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["OPPFYLT"]);

      expect(screen.getByRole("heading", { name: "Er i aktivitet" })).to.exist;

      const arsakRadioButton = screen.getByText("Friskmeldt");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderOppfyltMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.OPPFYLT,
        arsaker: [OppfyltVurderingArsak.FRISKMELDT],
        frist: undefined,
      };
      expect(vurderOppfyltMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Unntak", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["UNNTAK"]);
      const tooLongBeskrivelse = getTooLongText(
        vurderAktivitetskravBeskrivelseMaxLength
      );
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi årsak")).to.exist;
      expect(
        screen.getByText(
          maxLengthErrorMessage(vurderAktivitetskravBeskrivelseMaxLength)
        )
      ).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["UNNTAK"]);

      expect(
        screen.getByRole("heading", {
          name: "Sett unntak fra aktivitetskravet",
        })
      ).to.exist;

      const arsakRadioButton = screen.getByText("Tilrettelegging ikke mulig");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.UNNTAK,
        arsaker: [UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG],
        frist: undefined,
      };
      expect(vurderUnntakMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Avvent", () => {
    it("Validerer årsaker, beskrivelse og dato", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["AVVENT"]);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi beskrivelse")).to.exist;
      expect(screen.getByText("Vennligst angi årsak")).to.exist;
      expect(screen.getByText("Vennligst angi gyldig dato")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["AVVENT"]);

      expect(
        screen.getByRole("heading", {
          name: "Avventer",
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

      const beskrivelseInput = getTextInput("Beskrivelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enBeskrivelse);

      const today = dayjs();
      const datoInput = getTextInput("Avventer til");
      changeTextInput(datoInput, today.format("DD.MM.YYYY"));

      clickButton("Lagre");

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
  });
  describe("Ikke oppfylt", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["IKKE_OPPFYLT"]);

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
        beskrivelse: undefined,
        frist: undefined,
      };
      expect(vurderIkkeOppfyltMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Send forhåndsvarsel", () => {
    it("Does not show AVVENT choice when forhandsvarsel is sent", () => {
      renderVurderAktivitetskrav(
        forhandsvarselAktivitetskrav,
        oppfolgingstilfelle
      );

      expect(screen.queryByRole("button", { name: "Sett unntak" })).to.exist;
      expect(screen.queryByRole("button", { name: "Er i aktivitet" })).to.exist;
      expect(screen.queryByRole("button", { name: "Ikke aktuell" })).to.exist;
      expect(screen.queryByRole("button", { name: "Ikke oppfylt" })).to.exist;
      expect(screen.queryByRole("button", { name: "Avvent" })).to.not.exist;
    });

    it("Send forhåndsvarsel with beskrivelse filled in", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      const beskrivelseLabel = "Beskrivelse (obligatorisk)";

      clickButton(buttonTexts["FORHANDSVARSEL"]);

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: beskrivelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;
      expect(
        screen.getByText(
          "Husk å utrede saken tilstrekkelig før du sender forhåndsvarsel om stans av sykepengene."
        )
      ).to.exist;

      const beskrivelseInput = getTextInput(beskrivelseLabel);
      changeTextInput(beskrivelseInput, enBeskrivelse);

      clickButton("Send");

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
    it("Fails to send forhåndsvarsel when no beskrivelse is filled in", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
      clickButton(buttonTexts["FORHANDSVARSEL"]);
      clickButton("Send");

      expect(screen.queryByText("Vennligst angi beskrivelse")).to.exist;
    });
  });
  describe("Ikke aktuell", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(buttonTexts["IKKE_AKTUELL"]);

      expect(
        screen.getByRole("heading", {
          name: "Ikke aktuell",
        })
      ).to.exist;

      expect(
        screen.getByText(
          /Aktivitetskravet skal ikke vurderes for denne personen/
        )
      ).to.exist;
      clickButton("Lagre");

      const vurderIkkeAktuellMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        status: AktivitetskravStatus.IKKE_AKTUELL,
        arsaker: [],
        beskrivelse: undefined,
        frist: undefined,
      };
      expect(vurderIkkeAktuellMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Uten oppfølgingstilfelle med aktivitetskrav", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(undefined, undefined);

      expect(screen.queryByText(/Gjelder tilfelle/)).to.not.exist;

      clickButton(buttonTexts["UNNTAK"]);

      const arsakRadioButton = screen.getByText("Medisinske grunner");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.UNNTAK,
        arsaker: [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
        frist: undefined,
      };
      expect(vurderUnntakMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../testQueryClient";
import { createAktivitetskrav } from "../testDataUtils";
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
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect } from "chai";
import { vurderAktivitetskravBeskrivelseMaxLength } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";

let queryClient: QueryClient;

const aktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.NY
);

const avventButtonText = "(Avventer)";
const enBeskrivelse = "Her er en beskrivelse";
const unntakButtonText = "Sett unntak";
const oppfyltButtonText = "Er i aktivitet";

const renderVurderAktivitetskrav = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VurderAktivitetskrav aktivitetskrav={aktivitetskrav} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
describe("VurderAktivitetskrav", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("renders buttons for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav();
    expect(getButton(avventButtonText)).to.exist;
    expect(getButton(unntakButtonText)).to.exist;
    expect(getButton(oppfyltButtonText)).to.exist;
  });
  describe("Oppfylt", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav();

      clickButton(oppfyltButtonText);
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
      renderVurderAktivitetskrav();

      clickButton(oppfyltButtonText);

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
      };
      expect(vurderOppfyltMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Unntak", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav();

      clickButton(unntakButtonText);
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
      renderVurderAktivitetskrav();

      clickButton(unntakButtonText);

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
      };
      expect(vurderUnntakMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Avvent", () => {
    it("Validerer årsaker og beskrivelse", () => {
      renderVurderAktivitetskrav();

      clickButton(avventButtonText);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi beskrivelse")).to.exist;
      expect(screen.getByText("Vennligst angi årsak")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav();

      clickButton(avventButtonText);

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
      const beskrivelseInput = getTextInput("Beskrivelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderAvventMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.AVVENT,
        arsaker: [
          AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
          AvventVurderingArsak.INFORMASJON_BEHANDLER,
        ],
      };
      expect(vurderAvventMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
});

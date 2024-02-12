import {
  texts,
  validerSkjemaTekster,
  validerVideoLink,
} from "@/utils/valideringUtils";
import { expect } from "chai";
import { getTooLongText, maxLengthErrorMessage } from "../testUtils";

type Tekster = {
  tekst: string;
};

describe("valideringUtils", () => {
  describe("validerTekster", () => {
    it("validerer required tekst", () => {
      const feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "",
          maxLength: 100,
          missingRequiredMessage: "Missing",
        },
      });
      expect(feil).to.deep.equal({
        tekst: "Missing",
      });
    });
    it("validerer maks-lengde på optional tekst", () => {
      let feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "Hei",
          maxLength: 100,
        },
      });
      expect(feil).to.deep.equal({
        tekst: undefined,
      });

      const maxLength = 100;
      const tooLongText = getTooLongText(maxLength);
      feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: tooLongText,
          maxLength: maxLength,
        },
      });

      expect(feil).to.deep.equal({
        tekst: maxLengthErrorMessage(maxLength),
      });
    });
    it("validerer maks-lengde på required tekst", () => {
      let feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "Hei",
          maxLength: 100,
          missingRequiredMessage: "Missing",
        },
      });
      expect(feil).to.deep.equal({
        tekst: undefined,
      });

      const maxLength = 100;
      const tooLongText = getTooLongText(maxLength);
      feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: tooLongText,
          maxLength: maxLength,
          missingRequiredMessage: "Missing",
        },
      });

      expect(feil).to.deep.equal({
        tekst: maxLengthErrorMessage(maxLength),
      });
    });
  });

  describe("validerVideoLink", () => {
    it("validate incorrect url format, returns error message", () => {
      const validationMessage = validerVideoLink("https://invalid.url");

      expect(validationMessage).to.equal(texts.invalidVideoLink);
    });
    it("validate correct url format and no whitespace, doesn't return error message", () => {
      const validationMessage = validerVideoLink("https://video.nav.no/abc");

      expect(validationMessage).to.be.undefined;
    });
    it("validate url with whitespace, returns error message", () => {
      const validationMessage = validerVideoLink(
        "https://video.nav.no/abc space"
      );

      expect(validationMessage).to.equal(texts.whiteSpaceInVideoLink);
    });
    it("validate url with whitespace only before and after valid url, doesn't return error message", () => {
      const validationMessage = validerVideoLink(
        "   https://video.nav.no/abc  "
      );

      expect(validationMessage).to.be.undefined;
    });
    it("validate url with both wrong format and whitespace, returns format error message", () => {
      const validationMessage = validerVideoLink(
        "https://invalid.url/abc  space"
      );

      expect(validationMessage).to.equal(texts.invalidVideoLink);
    });
  });
});

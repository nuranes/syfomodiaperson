import { expect } from "chai";
import React from "react";
import { Form } from "react-final-form";
import DialogmoteDatoField, {
  validerDatoField,
} from "@/components/dialogmote/DialogmoteDatoField";
import { render, screen } from "@testing-library/react";
import { getButton } from "../testUtils";

describe("DialogmoteDatoField", () => {
  describe("render DialogmoteDatoField", () => {
    it("Skal inneholde input-felt og kalender", () => {
      render(
        <Form
          onSubmit={() => {
            /* Do nothing */
          }}
        >
          {() => <DialogmoteDatoField />}
        </Form>
      );

      expect(screen.getByRole("textbox")).to.exist;
      expect(getButton("Kalender")).to.exist;
    });
  });
  describe("validerDatoField", () => {
    it("Skal returnere Vennligst angi dato hvis dato ikke er sendt inn", () => {
      const result = validerDatoField(undefined);
      expect(result).to.be.equal("Vennligst angi dato");
    });

    it("Skal returnere Datoen er ikke gyldig eller har ikke riktig format hvis dato er på feil format", () => {
      const expectedResult =
        "Datoen er ikke gyldig eller har ikke riktig format (dd.mm.åååå)";
      const result = validerDatoField("olsen");
      const result2 = validerDatoField("200-02-22");
      expect(result).to.equal(expectedResult);
      expect(result2).to.equal(expectedResult);
    });

    it("Skal ikke klage hvis datoen er samme dato som minDate", () => {
      const result = validerDatoField("2018-12-01", new Date("2018-12-01"));
      expect(result).to.be.equal(undefined);
    });

    it("Skal ikke klage hvis datoen er etter minDate", () => {
      const result = validerDatoField("2018-12-02", new Date("2018-12-01"));
      expect(result).to.be.equal(undefined);
    });

    it("Gir feil hvis datoen er før minDate", () => {
      const result = validerDatoField("2018-12-01", new Date("2018-12-02"));
      expect(result).not.to.be.equal(undefined);
    });

    it("Skal ikke klage hvis datoen er samme dato som maxDate", () => {
      const result = validerDatoField(
        "2018-12-01",
        undefined,
        new Date("2018-12-01")
      );
      expect(result).to.be.equal(undefined);
    });

    it("Skal ikke klage hvis datoen er før maxDate", () => {
      const result = validerDatoField(
        "2018-12-01",
        undefined,
        new Date("2018-12-02")
      );
      expect(result).to.be.equal(undefined);
    });

    it("Gir feil hvis datoen er etter maxDate", () => {
      const result = validerDatoField(
        "2018-12-02",
        undefined,
        new Date("2018-12-01")
      );
      expect(result).not.to.be.equal(undefined);
    });
  });
});

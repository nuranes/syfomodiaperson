import { expect } from "chai";
import React from "react";
import { Form } from "react-final-form";
import DialogmoteDatoField from "@/components/dialogmote/DialogmoteDatoField";
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
});

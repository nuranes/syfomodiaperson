import React from "react";
import { expect, describe, it } from "vitest";

import Feilmelding from "../../src/components/Feilmelding";
import { render, screen } from "@testing-library/react";

describe("Feilmelding", () => {
  it("Skal vise en standard feilmelding", () => {
    render(<Feilmelding />);

    expect(
      screen.getByRole("heading", { name: "Beklager, det oppstod en feil" })
    ).to.exist;
    expect(screen.getByText("Vennligst prøv igjen litt senere.")).to.exist;
  });

  it("Skal vise innsendt tittel/melding", () => {
    const m = "melding";
    render(<Feilmelding tittel="tittel" melding={m} />);

    expect(screen.getByRole("heading", { name: "tittel" })).to.exist;
    expect(screen.getByText("melding")).to.exist;
  });
});

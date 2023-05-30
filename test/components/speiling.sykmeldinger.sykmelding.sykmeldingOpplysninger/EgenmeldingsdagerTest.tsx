import React from "react";
import { expect } from "chai";
import { Egenmeldingsdager } from "@/components/speiling/sykmeldinger/sykmelding/sykmeldingOpplysninger/Egenmeldingsdager";
import { render, screen } from "@testing-library/react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

const mockSykmelding = (
  data: Partial<SykmeldingOldFormat>
): SykmeldingOldFormat => {
  return data as SykmeldingOldFormat;
};

const headerText = "Egenmeldingsdager (lagt til av deg)";

describe("Egenmeldingsdager", () => {
  it("renders nothing when no egenmeldingsdager", () => {
    const sykmelding = mockSykmelding({
      sporsmal: {
        egenmeldingsdager: [],
      },
    });
    render(<Egenmeldingsdager sykmelding={sykmelding} />);

    expect(screen.queryByRole("heading", { name: headerText })).to.not.exist;
  });
  it("renders egenmeldingsdager (sortert) og antall dager", () => {
    const sykmelding = mockSykmelding({
      sporsmal: {
        egenmeldingsdager: ["2020-01-02", "2020-01-01"],
      },
    });
    render(<Egenmeldingsdager sykmelding={sykmelding} />);

    expect(screen.getByRole("heading", { name: headerText })).to.exist;
    const egenmeldingsdatoer = screen.getAllByText(/januar 2020/);
    expect(egenmeldingsdatoer).to.have.length(2);
    expect(egenmeldingsdatoer[0].textContent).to.equal("1. januar 2020");
    expect(egenmeldingsdatoer[1].textContent).to.equal("2. januar 2020");
    expect(screen.getByText("(2 dager)")).to.exist;
  });
  it("renders (1 dag) when 1 egenmeldingsdag", () => {
    const sykmelding = mockSykmelding({
      sporsmal: {
        egenmeldingsdager: ["2020-01-01"],
      },
    });
    render(<Egenmeldingsdager sykmelding={sykmelding} />);

    expect(screen.getByRole("heading", { name: headerText })).to.exist;
    expect(screen.getByText("1. januar 2020")).to.exist;
    expect(screen.getByText("(1 dag)")).to.exist;
  });
});

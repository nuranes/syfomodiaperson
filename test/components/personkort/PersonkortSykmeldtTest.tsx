import { render, screen } from "@testing-library/react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import { expect, describe, it, beforeEach } from "vitest";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { vegadresse } from "../../../mock/syfoperson/personAdresseMock";
import {
  queryClientWithAktivBruker,
  setQueryDataWithPersonkortdata,
} from "../../testQueryClient";

let queryClient: any;

const renderPersonkortSykmeldt = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortSykmeldt />
    </QueryClientProvider>
  );

describe("PersonkortSykmeldt", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    setQueryDataWithPersonkortdata(queryClient);
  });

  it("Skal vise PersonkortElement", () => {
    renderPersonkortSykmeldt();
    expect(screen.getByRole("heading", { name: "Kontaktinformasjon" })).to
      .exist;
    expect(screen.getByRole("img", { name: "Bilde av person" })).to.exist;
  });

  it("Skal vise PersonkortInformasjon", () => {
    renderPersonkortSykmeldt();
    expect(screen.getByText("F.nummer")).to.exist;
    expect(screen.getByText("Telefon")).to.exist;
    expect(screen.getByText("E-post")).to.exist;
    expect(screen.getByText("Bostedsadresse")).to.exist;
    expect(screen.getByText("Kontaktadresse")).to.exist;
    expect(screen.getByText("Oppholdsadresse")).to.exist;
  });

  it("Skal vise adresser", async () => {
    renderPersonkortSykmeldt();

    const expectedAdresse = `${vegadresse.adressenavn} ${vegadresse.husnummer}`;
    expect(await screen.findAllByText(expectedAdresse)).to.have.length(2);
  });
});

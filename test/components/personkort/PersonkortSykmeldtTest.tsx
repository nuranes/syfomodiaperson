import { render, screen } from "@testing-library/react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import { expect } from "chai";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { apiMock } from "../../stubs/stubApi";
import { stubPersonadresseApi } from "../../stubs/stubSyfoperson";
import { vegadresse } from "../../../mock/syfoperson/personAdresseMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoMock } from "../../../mock/syfoperson/brukerinfoMock";

let queryClient: any;
let apiMockScope: any;

const renderPersonkortSykmeldt = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortSykmeldt />
    </QueryClientProvider>
  );

describe("PersonkortSykmeldt", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    apiMockScope = apiMock();
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
    stubPersonadresseApi(apiMockScope);
    renderPersonkortSykmeldt();

    const expectedAdresse = `${vegadresse.adressenavn} ${vegadresse.husnummer}`;
    expect(await screen.findAllByText(expectedAdresse)).to.have.length(2);
  });
});

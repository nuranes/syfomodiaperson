import {
  stubDiskresjonskodeApi,
  stubEgenansattApi,
} from "../../stubs/stubSyfoperson";
import { apiMock } from "../../stubs/stubApi";
import { QueryClientProvider } from "react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import React from "react";
import PersonkortHeader from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../../mock/syfoperson/brukerinfoMock";

let queryClient: any;
let apiMockScope: any;

const renderPersonkortHeader = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortHeader />
    </QueryClientProvider>
  );

describe("PersonkortHeader", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("viser 'Egenansatt' når isEgenansatt er true fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope);
    renderPersonkortHeader();

    expect(await screen.findByText("Egenansatt")).to.exist;
  });

  it("viser ikke 'Egenansatt' når isEgenansatt er false fra API", async () => {
    stubEgenansattApi(apiMockScope, false);
    stubDiskresjonskodeApi(apiMockScope);
    renderPersonkortHeader();

    expect(screen.queryByText("Egenansatt")).not.to.exist;
  });

  it("viser 'Kode 6' når diskresjonskode er 6 fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope, "6");
    renderPersonkortHeader();

    expect(await screen.findByText("Kode 6")).to.exist;
  });

  it("viser 'Kode 7' når diskresjonskode er 7 fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope, "7");
    renderPersonkortHeader();

    expect(await screen.findByText("Kode 7")).to.exist;
  });

  it("viser ingen diskresjonskode når diskresjonskode er tom fra API", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubDiskresjonskodeApi(apiMockScope);
    renderPersonkortHeader();

    expect(screen.queryByText("Kode")).not.to.exist;
  });
});

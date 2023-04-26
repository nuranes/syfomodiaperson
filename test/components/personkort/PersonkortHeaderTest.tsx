import {
  stubDiskresjonskodeApi,
  stubEgenansattApi,
  stubPersoninfoApi,
} from "../../stubs/stubSyfoperson";
import { apiMock } from "../../stubs/stubApi";
import { QueryClientProvider } from "@tanstack/react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import React from "react";
import PersonkortHeader from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { stubMaxdateApi } from "../../stubs/stubEsyfovarsel";

let queryClient: any;
let apiMockScope: any;

const renderPersonkortHeader = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetProvider>
        <PersonkortHeader />
      </ValgtEnhetProvider>
    </QueryClientProvider>
  );

describe("PersonkortHeader", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
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
    stubDiskresjonskodeApi(apiMockScope, "6");
    renderPersonkortHeader();
    await screen.findByText("Kode 6");

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
    await screen.findByText("Egenansatt");

    expect(screen.queryByText("Kode")).not.to.exist;
  });

  it("viser dødsdato når dato finnes i brukerinfo", async () => {
    stubPersoninfoApi(apiMockScope, "2023-02-01");
    renderPersonkortHeader();

    expect(await screen.findByText("Død 01.02.2023")).to.exist;
  });

  it("viser ikke dødsdato når det ikke finnes i brukerinfo", async () => {
    stubEgenansattApi(apiMockScope, true);
    stubPersoninfoApi(apiMockScope);
    renderPersonkortHeader();
    await screen.findByText("Egenansatt");

    expect(screen.queryByText("Død")).not.to.exist;
  });

  it("viser maksdato fra API", async () => {
    stubMaxdateApi(apiMockScope, new Date("2023-12-01"));
    renderPersonkortHeader();

    await screen.findByText("Maksdato:");
    await screen.findByText("01.12.2023");
  });
});

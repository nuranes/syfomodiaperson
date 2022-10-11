import React from "react";
import { apiMock } from "../../stubs/stubApi";
import { QueryClientProvider } from "react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";
import {
  stubBehandlendeEnhetApi,
  stubChangeEnhetApi,
} from "../../stubs/stubSyfobehandlendeEnhet";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { PersonDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { DEFAULT_GODKJENT_FNR } from "../../../mock/util/requestUtil";

let queryClient: any;
let apiMockScope: any;

const enhet = { enhetId: "1234", navn: "NAV Drammen" };
const person: PersonDTO = {
  personident: DEFAULT_GODKJENT_FNR,
  isNavUtland: false,
};

const renderPersonkortEnhet = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortEnhet />
    </QueryClientProvider>
  );

describe("PersonkortEnhet", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("viser behandlende enhet fra API", async () => {
    stubBehandlendeEnhetApi(apiMockScope, enhet);
    renderPersonkortEnhet();

    expect(await screen.findByText("NAV Drammen")).to.exist;
    expect(await screen.findByText("1234")).to.exist;
  });

  it("viser feilmelding når behandlende ikke funnet", async () => {
    stubBehandlendeEnhetApi(apiMockScope);
    renderPersonkortEnhet();

    expect(
      await screen.findByText(
        "Fant ikke behandlende enhet for person, prøv igjen senere."
      )
    ).to.exist;
  });

  it("viser endre enhet til NAV utland", async () => {
    stubBehandlendeEnhetApi(apiMockScope, enhet);
    stubChangeEnhetApi(apiMockScope, person);
    renderPersonkortEnhet();

    expect(await screen.findByText("Endre til NAV utland")).to.exist;
  });
});

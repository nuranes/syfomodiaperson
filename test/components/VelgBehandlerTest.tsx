import { fireEvent, render, screen } from "@testing-library/react";
import { expect } from "chai";
import React, { useState } from "react";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { FormProvider, useForm } from "react-hook-form";
import { navEnhet } from "../dialogmote/testData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { Button } from "@navikt/ds-react";
import { changeTextInput, clickButton } from "../testUtils";
import {
  behandlereDialogmeldingMock,
  behandlerRefLegoLasLegesen,
  behandlerSokDialogmeldingMock,
} from "../../mock/isdialogmelding/behandlereDialogmeldingMock";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;
let apiMockScope: nock.Scope;
const mockBehandler = behandlereDialogmeldingMock[0];

const renderVelgBehandler = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VelgBehandlerWrapper />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

const submitText = "Submit";
const searchBehandlerOptionText = "Søk etter behandler";

describe("VelgBehandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("Viser radiobuttons med behandlervalg", async () => {
    renderVelgBehandler();

    expect(screen.getByRole("group", { name: "Velg behandler" })).to.exist;
    expect(screen.getByRole("radio", { name: /Fastlege/ })).to.exist;
    expect(screen.getByRole("radio", { name: "Søk etter behandler" })).to.exist;
    expect(screen.queryByRole("searchbox")).to.not.exist;
  });

  it("Viser behandlersøk ved klikk på radiobutton 'Søk etter behandler'", () => {
    renderVelgBehandler();

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);

    expect(screen.getByRole("searchbox")).to.exist;
  });

  it("viser valideringsfeil når man ikke har valgt behandler", async () => {
    renderVelgBehandler();

    clickButton(submitText);

    expect(await screen.findByText("Vennligst velg behandler")).to.exist;
  });

  it("viser valideringsfeil når man har valgt søk etter behandler uten å ha søkt opp behandler", async () => {
    renderVelgBehandler();

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);
    clickButton(submitText);

    expect(await screen.findByText("Vennligst velg behandler")).to.exist;
  });

  it("kan velge behandler fra radioknapper", () => {
    renderVelgBehandler();

    const velgFastlegeOption = screen.getByRole("radio", { name: /Fastlege/ });
    fireEvent.click(velgFastlegeOption);

    expect(screen.getByText(mockBehandler.fnr)).to.exist;
    expect(screen.getByText(behandlerRefLegoLasLegesen)).to.exist;
  });

  it("kan velge behandler fra søk", async () => {
    apiMockScope
      .get(`${ISDIALOGMELDING_ROOT}/behandler/search`)
      .reply(200, () => behandlerSokDialogmeldingMock);
    renderVelgBehandler();
    const behandlerSearchResultMock = behandlerSokDialogmeldingMock[1];

    const searchBehandlerOption = screen.getByRole("radio", {
      name: searchBehandlerOptionText,
    });
    fireEvent.click(searchBehandlerOption);

    const searchbox = screen.getByRole("searchbox");
    changeTextInput(searchbox, "Baker");

    const searchResult = await screen.findByRole("button", {
      name: /Baker/,
    });
    userEvent.click(searchResult);

    expect(screen.getByText(behandlerSearchResultMock.fnr)).to.exist;
    expect(screen.getByText(behandlerSearchResultMock.behandlerRef)).to.exist;
  });
});

const VelgBehandlerWrapper = () => {
  const [behandler, setBehandler] = useState<BehandlerDTO>();
  const formMethods = useForm<{ behandlerRef: string }>();
  const submit = ({}) => {
    /* noop */
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submit)}>
        <VelgBehandler
          legend="Velg behandler"
          onBehandlerSelected={setBehandler}
        />
        <p>{behandler?.fnr}</p>
        <p>{formMethods.watch("behandlerRef")}</p>
        <Button type="submit">{submitText}</Button>
      </form>
    </FormProvider>
  );
};

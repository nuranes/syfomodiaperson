import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import dayjs from "dayjs";
import { VedtakRequestDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";
import { addWeeks } from "@/utils/datoUtils";
import { createHeaderH1 } from "@/utils/documentComponentUtils";
import { getExpectedBehandlerDocument } from "./frisktilarbeidTestData";

let queryClient: QueryClient;

const mockBehandler = behandlereDialogmeldingMock[0];
const today = dayjs();
const inTwelveWeeks = dayjs(addWeeks(today.toDate(), 12));

const renderFattVedtakSkjema = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <FattVedtakSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("FattVedtakSkjema", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser skjema for å fatte vedtak", () => {
    renderFattVedtakSkjema();

    expect(getTextInput("Friskmeldingen gjelder fra")).to.exist;
    const tilDatoInput = getTextInput(
      "Til dato (automatisk justert 12 uker frem)"
    );
    expect(tilDatoInput).to.exist;
    expect(tilDatoInput).to.have.property("readOnly", true);

    expect(screen.getByRole("group", { name: "Velg behandler" })).to.exist;
    expect(screen.getByRole("radio", { name: /Fastlege/ })).to.exist;
    expect(screen.getByRole("radio", { name: "Søk etter behandler" })).to.exist;
    expect(screen.queryByRole("searchbox")).to.not.exist;

    expect(getTextInput("Begrunnelse")).to.exist;

    expect(screen.getByRole("button", { name: "Fatt vedtak" })).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
  });

  it("viser behandlersøk ved klikk på 'Søk etter behandler'", () => {
    renderFattVedtakSkjema();

    const searchBehandlerOption = screen.getByRole("radio", {
      name: "Søk etter behandler",
    });
    fireEvent.click(searchBehandlerOption);

    expect(screen.getByRole("searchbox")).to.exist;
  });

  it("validerer fra-dato, begrunnelse og behandler", async () => {
    renderFattVedtakSkjema();

    clickButton("Fatt vedtak");

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    expect(await screen.findByText("Vennligst angi dato")).to.exist;
    expect(await screen.findByText("Vennligst velg behandler")).to.exist;
  });

  it("fatter vedtak med verdier fra skjema", async () => {
    renderFattVedtakSkjema();

    const fraDato = getTextInput("Friskmeldingen gjelder fra");
    changeTextInput(fraDato, today.format("DD.MM.YYYY"));

    const velgFastlegeOption = screen.getByRole("radio", { name: /Fastlege/ });
    fireEvent.click(velgFastlegeOption);

    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, "En begrunnelse");

    clickButton("Fatt vedtak");

    const expectedVedtakRequest: VedtakRequestDTO = {
      fom: today.format("YYYY-MM-DD"),
      tom: inTwelveWeeks.format("YYYY-MM-DD"),
      begrunnelse: "En begrunnelse",
      document: [createHeaderH1("Vedtak")],
      behandlerDocument: getExpectedBehandlerDocument(
        today.toDate(),
        inTwelveWeeks.toDate()
      ),
      behandlerNavn: `${mockBehandler.fornavn} ${mockBehandler.mellomnavn} ${mockBehandler.etternavn}`,
      behandlerRef: mockBehandler.behandlerRef,
    };

    await waitFor(() => {
      const fattVedtakMutation = queryClient.getMutationCache().getAll().pop();
      expect(fattVedtakMutation?.state.variables).to.deep.equal(
        expectedVedtakRequest
      );
    });
  });

  it("åpner forhåndsvisning", () => {
    renderFattVedtakSkjema();

    clickButton("Forhåndsvisning");

    const forhandsvisModal = screen.getAllByRole("dialog", {
      hidden: true,
    })[2];
    expect(forhandsvisModal).to.exist;
    expect(
      within(forhandsvisModal).getByRole("button", {
        name: "Lukk",
        hidden: true,
      })
    ).to.exist;
  });
});

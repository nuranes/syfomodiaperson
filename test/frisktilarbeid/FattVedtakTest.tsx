import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";
import { queryClientWithMockData } from "../testQueryClient";
import { expect } from "chai";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import dayjs from "dayjs";
import { VedtakRequestDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { addDays, addWeeks } from "@/utils/datoUtils";
import { maksdatoQueryKeys } from "@/data/maksdato/useMaksdatoQuery";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { maksdatoMock } from "../../mock/syfoperson/persondataMock";
import { getExpectedVedtakDocument } from "./frisktilarbeidTestData";

let queryClient: QueryClient;

const today = dayjs();
const inTwelveWeeksMinusOneDay = dayjs(
  addDays(addWeeks(today.toDate(), 12), -1)
);
const inTenWeeks = dayjs(addWeeks(new Date(), 10));
const threeWeeksAgo = dayjs(addWeeks(today.toDate(), -3));
const enBegrunnelse = "En begrunnelse";

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
    const tilDatoInput = screen.getByRole("textbox", {
      name: /Til dato/,
    });
    expect(tilDatoInput).to.exist;
    expect(tilDatoInput).to.have.property("readOnly", true);

    expect(getTextInput("Begrunnelse")).to.exist;

    expect(screen.getByRole("button", { name: "Fatt vedtak" })).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
  });

  it("beregner tom-dato basert på maksdato", () => {
    const maksdato = {
      maxDate: {
        ...maksdatoMock.maxDate,
        forelopig_beregnet_slutt: inTenWeeks.toDate(),
      },
    };

    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => maksdato
    );

    renderFattVedtakSkjema();

    const fraDato = getTextInput("Friskmeldingen gjelder fra");
    changeTextInput(fraDato, threeWeeksAgo.format("DD.MM.YYYY"));

    expect(screen.getByText("Automatisk justert 12 uker frem")).to.exist;
    expect(screen.queryByText("Automatisk justert til maksdato")).to.not.exist;

    changeTextInput(fraDato, today.format("DD.MM.YYYY"));

    expect(
      screen.getByText(
        "Foreløpig beregnet maksdato er tidligere enn 12 uker frem:",
        { exact: false }
      )
    ).to.exist;
    expect(screen.getByText("Automatisk justert til maksdato")).to.exist;
    expect(screen.queryByText("Automatisk justert 12 uker frem")).to.not.exist;
  });

  it("viser ikke maksdato-alert når ingen dato er valgt og maksdato er undefined", () => {
    const maksdato = {
      maxDate: {
        ...maksdatoMock.maxDate,
        forelopig_beregnet_slutt: undefined,
      },
    };

    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => maksdato
    );

    renderFattVedtakSkjema();

    expect(
      screen.queryByText(
        "Foreløpig beregnet maksdato er tidligere enn 12 uker frem:",
        { exact: false }
      )
    ).to.not.exist;
  });

  it("validerer fra-dato og begrunnelse", async () => {
    renderFattVedtakSkjema();

    clickButton("Fatt vedtak");

    expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    expect(await screen.findByText("Vennligst angi dato")).to.exist;
  });

  it("fatter vedtak med verdier fra skjema", async () => {
    renderFattVedtakSkjema();

    const fraDato = getTextInput("Friskmeldingen gjelder fra");
    changeTextInput(fraDato, today.format("DD.MM.YYYY"));

    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, enBegrunnelse);

    clickButton("Fatt vedtak");

    const expectedVedtakRequest: VedtakRequestDTO = {
      fom: today.format("YYYY-MM-DD"),
      tom: inTwelveWeeksMinusOneDay.format("YYYY-MM-DD"),
      begrunnelse: enBegrunnelse,
      document: getExpectedVedtakDocument({
        fom: today.toDate(),
        tom: inTwelveWeeksMinusOneDay.toDate(),
        begrunnelse: enBegrunnelse,
        tilDatoIsMaxDato: false,
      }),
    };

    await waitFor(() => {
      const fattVedtakMutation = queryClient.getMutationCache().getAll().pop();
      expect(fattVedtakMutation?.state.variables).to.deep.equal(
        expectedVedtakRequest
      );
    });
  });

  it("fatter vedtak med setning om maksdato når tom-dato er maksdato", async () => {
    const maksdato = {
      maxDate: {
        ...maksdatoMock.maxDate,
        forelopig_beregnet_slutt: inTenWeeks.toDate(),
      },
    };

    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => maksdato
    );

    renderFattVedtakSkjema();

    const fraDato = getTextInput("Friskmeldingen gjelder fra");
    changeTextInput(fraDato, today.format("DD.MM.YYYY"));
    const begrunnelseInput = getTextInput("Begrunnelse");
    changeTextInput(begrunnelseInput, enBegrunnelse);

    clickButton("Fatt vedtak");

    const expectedVedtakRequest: VedtakRequestDTO = {
      fom: today.format("YYYY-MM-DD"),
      tom: inTenWeeks.format("YYYY-MM-DD"),
      begrunnelse: enBegrunnelse,
      document: getExpectedVedtakDocument({
        fom: today.toDate(),
        tom: inTenWeeks.toDate(),
        begrunnelse: enBegrunnelse,
        tilDatoIsMaxDato: true,
      }),
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

import { fastlegerQueryKeys } from "@/data/fastlege/fastlegerQueryHooks";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import PersonkortLege, {
  FastlegeVikar,
} from "@/components/personkort/PersonkortLege";
import { expect, describe, it, beforeEach } from "vitest";
import React from "react";
import { fastlegerMock } from "../../../mock/fastlegerest/fastlegerMock";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";

let queryClient: any;

const aktivFastlege = fastlegerMock[0];
const fastlegeVikarer = [fastlegerMock[1], fastlegerMock[2]];

const renderPersonkortLege = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PersonkortLege />
    </QueryClientProvider>
  );

describe("PersonkortLege", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
  });

  it("Skal vise feilmelding, fastleger ikke ble funnet, når ingen fastleger", async () => {
    const expectedFeilmelding =
      "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.";
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );
    renderPersonkortLege();

    expect(screen.getByText(expectedFeilmelding)).to.exist;
  });

  it("Skal vise overskrifter for aktiv fastlege og fastlegevikarer", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege, ...fastlegeVikarer]
    );
    renderPersonkortLege();

    expect(await screen.findByRole("heading", { name: "Lege Legesen" })).to
      .exist;
    expect(await screen.findByRole("heading", { name: "Vikar" })).to.exist;
  });

  it("Skal vise vikarlege", async () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege, ...fastlegeVikarer]
    );
    renderPersonkortLege();

    expect(await screen.findByText("Vikarlege Vikarsen")).to.exist;
    expect(await screen.findByText("Legensvikar Vikarheim")).to.exist;
  });

  it("Skal ikke vise fastlegevikarer dersom det ikke er fastlegevikarer", () => {
    queryClient.setQueryData(
      fastlegerQueryKeys.fastleger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [aktivFastlege]
    );
    renderPersonkortLege();

    expect(screen.queryByRole("heading", { name: "Vikar" })).to.not.exist;
  });

  describe("Fastlegevikar", () => {
    it("Skal vise en liste med antall element lik antall fastlegervikarer", () => {
      const view = <FastlegeVikar fastlegeVikarer={fastlegeVikarer} />;
      render(view);

      expect(screen.getByText(/Vikarlege Vikarsen/)).to.exist;
      expect(screen.getByText("60%")).to.exist;
      expect(screen.getByText(/Legensvikar Vikarheim/)).to.exist;
    });
  });
});

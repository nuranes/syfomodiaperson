import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { clickButton } from "../testUtils";
import {
  VurderingArsak,
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { QueryClient } from "@tanstack/react-query";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import { arbeidsuforhetIkkeAktuellPath } from "@/routers/AppRouter";
import React from "react";
import { ArbeidsuforhetIkkeAktuellSkjema } from "@/sider/arbeidsuforhet/ikkeaktuell/ArbeidsuforhetIkkeAktuellSkjema";
import { getIkkeAktuellVurderingDocument } from "./documents";

let queryClient: QueryClient;

const renderIkkeAktuell = () => {
  renderArbeidsuforhetSide(
    queryClient,
    <ArbeidsuforhetIkkeAktuellSkjema />,
    arbeidsuforhetIkkeAktuellPath,
    [arbeidsuforhetIkkeAktuellPath]
  );
};

describe("ArbeidsuforhetIkkeAktuell", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser radioknapper for årsak og lagre/avbryt-knapper", () => {
    renderIkkeAktuell();

    expect(screen.getByRole("radio", { name: "Friskmeldt" })).to.exist;
    expect(
      screen.getByRole("radio", { name: "Friskmelding til arbeidsformidling" })
    ).to.exist;

    expect(screen.getByRole("button", { name: "Lagre" })).to.exist;
    expect(screen.getByRole("button", { name: "Avbryt" })).to.exist;
  });

  it("validerer årsak", async () => {
    renderIkkeAktuell();

    await clickButton("Lagre");

    expect(await screen.findByText("Vennligst angi årsak")).to.exist;
  });

  it("lagrer vurdering med arsak og document", async () => {
    renderIkkeAktuell();

    const arsak = VurderingArsak.FRISKMELDT;
    const friskmeldtRadiobutton = screen.getByRole("radio", {
      name: "Friskmeldt",
    });

    fireEvent.click(friskmeldtRadiobutton);

    await clickButton("Lagre");
    await waitFor(() => {
      const sendVurderingMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: VurderingRequestDTO = {
        type: VurderingType.IKKE_AKTUELL,
        arsak: arsak,
        begrunnelse: "",
        document: getIkkeAktuellVurderingDocument(arsak),
      };
      expect(sendVurderingMutation.state.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
});

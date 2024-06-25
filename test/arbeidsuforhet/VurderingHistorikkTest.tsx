import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { VurderingHistorikk } from "@/sider/arbeidsuforhet/historikk/VurderingHistorikk";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import {
  VurderingArsak,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { daysFromToday } from "../testUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;

const renderVurderingHistorikk = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VurderingHistorikk />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("VurderingHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("uten tidligere vurderinger", () => {
    it("viser tekst om ingen tidligere vurderinger", () => {
      renderVurderingHistorikk([]);

      expect(
        screen.queryByText(
          "Tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.not.exist;
      expect(
        screen.getByText(
          "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.exist;
    });
  });
  describe("med tidligere vurderinger", () => {
    const oppfyltCreated = daysFromToday(50);
    const oppfylt = createVurdering({
      type: VurderingType.OPPFYLT,
      createdAt: oppfyltCreated,
      begrunnelse: "Rett på sykepenger",
    });
    const forhandsvarselCreated = daysFromToday(20);
    const forhandsvarsel = createForhandsvarsel({
      createdAt: forhandsvarselCreated,
      svarfrist: new Date(),
    });
    const avslagCreated = new Date();
    const avslag = createVurdering({
      type: VurderingType.AVSLAG,
      createdAt: avslagCreated,
      begrunnelse: "Ikke rett på sykepenger",
    });
    const ikkeAktuellCreated = daysFromToday(10);
    const ikkeAktuell = createVurdering({
      type: VurderingType.IKKE_AKTUELL,
      createdAt: ikkeAktuellCreated,
      begrunnelse: "",
      arsak: VurderingArsak.FRISKMELDING_TIL_ARBEIDSFORMIDLING,
    });

    it("viser tekst om tidligere vurderinger", () => {
      renderVurderingHistorikk([avslag, forhandsvarsel, oppfylt]);

      expect(
        screen.queryByText(
          "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia"
        )
      ).to.not.exist;
      expect(
        screen.getByText("Tidligere vurderinger av §8-4 arbeidsuførhet i Modia")
      ).to.exist;
    });

    it("viser klikkbar overskrift med type og dato for hver vurdering", () => {
      renderVurderingHistorikk([ikkeAktuell, avslag, forhandsvarsel, oppfylt]);

      const vurderingButtons = screen.getAllByRole("button");

      expect(vurderingButtons[0].textContent).to.contain(
        `Ikke aktuell - ${tilDatoMedManedNavn(ikkeAktuellCreated)}`
      );
      expect(vurderingButtons[1].textContent).to.contain(
        `Avslag - ${tilDatoMedManedNavn(avslagCreated)}`
      );
      expect(vurderingButtons[2].textContent).to.contain(
        `Forhåndsvarsel - ${tilDatoMedManedNavn(forhandsvarselCreated)}`
      );
      expect(vurderingButtons[3].textContent).to.contain(
        `Oppfylt - ${tilDatoMedManedNavn(oppfyltCreated)}`
      );
    });

    it("klikk på overskrift viser begrunnelse, veileder og knapp for å se document for vurderingen", async () => {
      renderVurderingHistorikk([oppfylt]);

      const vurderingButton = screen.getByRole("button");

      await userEvent.click(vurderingButton);

      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText(oppfylt.begrunnelse)).to.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
      expect(screen.getByRole("button", { name: "Se oppfylt vurdering" })).to
        .exist;
    });

    it("klikk på ikke-aktuell viser årsak og veileder for vurderingen", async () => {
      renderVurderingHistorikk([ikkeAktuell]);

      const vurderingButton = screen.getByRole("button");

      await userEvent.click(vurderingButton);

      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getByText("Vurdert av")).to.exist;
      expect(screen.getByText(VEILEDER_DEFAULT.fulltNavn())).to.exist;
    });
  });
});

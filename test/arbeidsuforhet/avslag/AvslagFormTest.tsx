import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";
import { queryClientWithMockData } from "../../testQueryClient";
import { changeTextInput, clickButton, getTextInput } from "../../testUtils";
import { getAvslagVurderingDocument } from "../documents";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { renderArbeidsuforhetSide } from "../arbeidsuforhetTestUtils";

let queryClient: QueryClient;

const renderAvslagForm = () => {
  renderArbeidsuforhetSide(
    queryClient,
    <AvslagForm />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
  );
};

describe("AvslagForm", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Form components", () => {
    it("shows date picker, textarea, and buttons", () => {
      const begrunnelseLabel = "Innstilling om avslag (obligatorisk)";

      renderAvslagForm();

      expect(screen.getByText("Avslaget gjelder fra")).to.exist;
      expect(
        screen.getByText("Skriv kort hvilke opplysninger", { exact: false })
      ).to.exist;
      expect(
        screen.getByText("friskmelding til arbeidsformidling:", {
          exact: false,
        })
      ).to.exist;
      expect(screen.getByText(begrunnelseLabel)).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByText("Videre må du huske å:")).to.exist;
      expect(screen.getByRole("button", { name: "Gi avslag" })).to.exist;
      expect(screen.getByRole("button", { name: "Avbryt" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send avslag", () => {
    it("Gives errors when trying to send vurdering without date and begrunnelse", async () => {
      renderAvslagForm();

      clickButton("Gi avslag");

      await waitFor(() => {
        expect(screen.queryByText("Vennligst angi begrunnelse")).to.not.exist;
      });
      expect(await screen.findByText("Vennligst angi dato")).to.exist;
      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with date and begrunnelse filled in, without reseting the form", async () => {
      renderAvslagForm();
      const begrunnelse = "Dette er en begrunnelse!";
      const begrunnelseLabel = "Innstilling om avslag (obligatorisk)";
      const dateAsString = "2024-01-01";
      const date = new Date(dateAsString);
      const dateLabel = "Avslaget gjelder fra";
      const dateInput = getTextInput(dateLabel);
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(dateInput, toDatePrettyPrint(date) as string);
      changeTextInput(begrunnelseInput, begrunnelse);
      clickButton("Gi avslag");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.AVSLAG,
          begrunnelse: begrunnelse,
          document: getAvslagVurderingDocument(begrunnelse, date),
          gjelderFom: dateAsString,
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      renderAvslagForm();
      const begrunnelse = "Dette er en begrunnelse!";
      const begrunnelseLabel = "Innstilling om avslag (obligatorisk)";
      const dateAsString = "2024-01-01";
      const date = new Date(dateAsString);
      const dateLabel = "Avslaget gjelder fra";
      const dateInput = getTextInput(dateLabel);
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(dateInput, toDatePrettyPrint(date) as string);
      changeTextInput(begrunnelseInput, begrunnelse);

      clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[1];
      expect(
        within(forhandsvisningVurdering).getByRole("heading", {
          name: "NAV har avslått sykepengene dine",
          hidden: true,
        })
      ).to.exist;
      getAvslagVurderingDocument(begrunnelse, date)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});

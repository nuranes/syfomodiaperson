import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { render, screen, waitFor, within } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { OppfyltForm } from "@/sider/arbeidsuforhet/OppfyltForm";
import { getSendVurderingDocument } from "./documents";

let queryClient: QueryClient;

const renderOppfyltForm = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <OppfyltForm />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("OppfyltForm", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Form components", () => {
    it("shows textarea and buttons", () => {
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      renderOppfyltForm();

      expect(screen.getByText(begrunnelseLabel)).to.exist;
      expect(screen.getByText("Åpne forhåndsvisning for å se innstillingen."))
        .to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByText("Før du går videre bør du gjøre følgende")).to
        .exist;
      expect(screen.getByText("Informere bruker om utfallet av vurderingen."))
        .to.exist;
      expect(
        screen.getByText(
          "Informere NAV Arbeid og ytelser via Gosys dersom det var de som initierte vurderingen av arbeidsuførheten"
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send vurdering", () => {
    it("Gives error when trying to send vurdering without begrunnelse", async () => {
      renderOppfyltForm();

      clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderOppfyltForm();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const berunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(berunnelseInput, begrunnelse);
      clickButton("Send");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.OPPFYLT,
          begrunnelse: begrunnelse,
          document: getSendVurderingDocument(begrunnelse),
        };
        expect(useSendVurderingArbeidsuforhet.state.variables).to.deep.equal(
          expectedVurdering
        );
      });
      expect(screen.queryByText(begrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderOppfyltForm();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const begrunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(begrunnelseInput, begrunnelse);
      clickButton("Forhåndsvisning");

      const forhandsvisningVurdering = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      expect(
        within(forhandsvisningVurdering).getByRole("heading", {
          name: "Forhåndsvis brev",
          hidden: true,
        })
      ).to.exist;
      getSendVurderingDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});

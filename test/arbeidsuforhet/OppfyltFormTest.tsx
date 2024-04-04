import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { screen, waitFor, within } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { OppfyltForm } from "@/sider/arbeidsuforhet/OppfyltForm";
import { getOppfyltVurderingDocument } from "./documents";
import { renderWithRouter } from "../testRouterUtils";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";

let queryClient: QueryClient;

const renderOppfyltForm = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <OppfyltForm />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
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
      expect(
        screen.getByText(
          "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk."
        )
      ).to.exist;
      expect(
        screen.getByRole("textbox", {
          name: begrunnelseLabel,
        })
      ).to.exist;
      expect(screen.getByText("Før du går videre bør du gjøre følgende:")).to
        .exist;
      expect(screen.getByText("Informere bruker om utfallet av vurderingen."))
        .to.exist;
      expect(
        screen.getByText(
          "Besvare Gosys-oppgaven dersom NAV Arbeid og ytelser ba om vurderingen."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Lagre" })).to.exist;
      expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    });
  });

  describe("Send vurdering", () => {
    it("Gives error when trying to send vurdering without begrunnelse", async () => {
      renderOppfyltForm();

      clickButton("Lagre");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send vurdering with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderOppfyltForm();
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";
      const berunnelseInput = getTextInput(begrunnelseLabel);

      changeTextInput(berunnelseInput, begrunnelse);
      clickButton("Lagre");

      await waitFor(() => {
        const useSendVurderingArbeidsuforhet = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: VurderingRequestDTO = {
          type: VurderingType.OPPFYLT,
          begrunnelse: begrunnelse,
          document: getOppfyltVurderingDocument(begrunnelse),
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
          name: "Vurdering av § 8-4 arbeidsuførhet",
          hidden: true,
        })
      ).to.exist;
      getOppfyltVurderingDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningVurdering).getByText(text)).to.exist;
        });
    });
  });
});

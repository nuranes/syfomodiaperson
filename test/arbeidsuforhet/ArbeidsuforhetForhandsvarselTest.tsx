import { render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import React from "react";
import { expect } from "chai";
import nock from "nock";
import { NotificationContext } from "@/context/notification/NotificationContext";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { stubArbeidsuforhetForhandsvarselApi } from "../stubs/stubIsarbeidsuforhet";
import { ForhandsvarselRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { getSendForhandsvarselDocument } from "./documents";
import { navEnhet } from "../dialogmote/testData";
import { queryClientWithMockData } from "../testQueryClient";
import { apiMock } from "../stubs/stubApi";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";

let queryClient: QueryClient;
let apiMockScope: any;

const renderForhandsvarselSkjema = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <SendForhandsvarselSkjema />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
describe("Forhandsvarselskjema arbeidsuforhet", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe("Send forhåndsvarsel", () => {
    it("Gives error when trying to send forhandsvarsel with no begrunnelse", async () => {
      renderForhandsvarselSkjema();

      clickButton("Send");

      expect(await screen.findByText("Vennligst angi begrunnelse")).to.exist;
    });

    it("Send forhåndsvarsel with begrunnelse filled in, without reseting the form", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSkjema();
      stubArbeidsuforhetForhandsvarselApi(apiMockScope);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      expect(
        screen.getByRole("heading", {
          name: "Send forhåndsvarsel",
        })
      ).to.exist;

      expect(screen.getByRole("textbox", { name: begrunnelseLabel })).to.exist;
      expect(screen.getByText("Forhåndsvisning")).to.exist;

      const beskrivelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(beskrivelseInput, begrunnelse);

      clickButton("Send");

      await waitFor(() => {
        const sendForhandsvarselMutation = queryClient
          .getMutationCache()
          .getAll()[0];
        const expectedVurdering: ForhandsvarselRequestDTO = {
          begrunnelse: begrunnelse,
          document: getSendForhandsvarselDocument(begrunnelse),
        };
        expect(sendForhandsvarselMutation.state.variables).to.deep.equal(
          expectedVurdering
        );
      });

      expect(screen.queryByText(begrunnelse)).to.exist;
    });

    it("Forhåndsvis brev with begrunnelse", async () => {
      const begrunnelse = "Dette er en begrunnelse!";
      renderForhandsvarselSkjema();
      stubArbeidsuforhetForhandsvarselApi(apiMockScope);
      const begrunnelseLabel = "Begrunnelse (obligatorisk)";

      const begrunnelseInput = getTextInput(begrunnelseLabel);
      changeTextInput(begrunnelseInput, begrunnelse);
      clickButton("Forhåndsvisning");

      const forhandsvisningForhandsvarsel = screen.getAllByRole("dialog", {
        hidden: true,
      })[0];
      expect(
        within(forhandsvisningForhandsvarsel).getByRole("heading", {
          name: "Forhåndsvis forhåndsvarselet",
          hidden: true,
        })
      ).to.exist;
      getSendForhandsvarselDocument(begrunnelse)
        .flatMap((documentComponent) => documentComponent.texts)
        .forEach((text) => {
          expect(within(forhandsvisningForhandsvarsel).getByText(text)).to
            .exist;
        });
    });
  });
});

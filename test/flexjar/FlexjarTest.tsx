import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import nock from "nock";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Flexjar } from "@/components/flexjar/Flexjar";
import { queryClientWithMockData } from "../testQueryClient";
import { apiMock } from "../stubs/stubApi";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import { changeTextInput, clickButton } from "../testUtils";
import { stubFlexjarApiError, stubFlexjarApiOk } from "../stubs/stubFlexjar";
import { defaultErrorTexts } from "@/api/errors";
import { FlexjarFeedbackDTO } from "@/data/flexjar/useFlexjarFeedback";
import { StoreKey } from "@/hooks/useLocalStorageState";

let queryClient: QueryClient;
let apiMockScope: nock.Scope;

const renderFlexjar = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Flexjar side={"Test"} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("Flexjar", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("renders only feedback button", () => {
    renderFlexjar();
    expect(screen.getByRole("button", { name: "Gi oss tilbakemelding" })).to
      .exist;
  });

  it("renders feedback form content after button click", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");

    expect(screen.getByText("Hvordan opplever du Test-siden?")).to.exist;
    const buttons = screen.getAllByRole("button");
    expect(buttons).to.have.length(7);
    expect(buttons[1].textContent).to.equal("Horribel");
    expect(buttons[2].textContent).to.equal("Dårlig");
    expect(buttons[3].textContent).to.equal("Nøytral");
    expect(buttons[4].textContent).to.equal("Bra");
    expect(buttons[5].textContent).to.equal("Super");
    expect(buttons[6].textContent).to.equal("Send tilbakemelding");
  });

  it("renders validation error when sends tilbakemelding and emoji not selected", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");
    clickButton("Send tilbakemelding");

    expect(screen.getByText("Vennligst velg en tilbakemelding")).to.exist;
  });

  it("sends tilbakemelding when emoji selected", async () => {
    renderFlexjar();
    stubFlexjarApiOk(apiMockScope);
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");

    clickButton("Send tilbakemelding");

    expect(await screen.findByRole("img", { name: "Suksess" })).to.exist;
    expect(await screen.findByText("Takk for din tilbakemelding!")).to.exist;
  });

  it("does not send tilbakemelding when error", async () => {
    renderFlexjar();
    stubFlexjarApiError(apiMockScope);
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");

    clickButton("Send tilbakemelding");

    expect(await screen.findByRole("img", { name: "Feil" })).to.exist;
    expect(await screen.findByText(defaultErrorTexts.generalError)).to.exist;
    expect(screen.queryByText("Takk for din tilbakemelding!")).to.not.exist;
  });

  it("renders textarea and alert when emoji selected", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");

    expect(screen.getByRole("textbox")).to.exist;
    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
  });

  it("sends feedback to flexjar", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");
    clickButton("Send tilbakemelding");

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: "Test",
      app: "syfomodiaperson",
      svar: "1",
      feedback: undefined,
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it("sends feedback with text to flexjar", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");

    const feedbackInput = screen.getByRole("textbox");
    const feedbackText = "Ikke bra";
    changeTextInput(feedbackInput, feedbackText);
    clickButton("Send tilbakemelding");

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: "Test",
      app: "syfomodiaperson",
      svar: "1",
      feedback: feedbackText,
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it("sets localstorage when sending feedback to flexjar", () => {
    renderFlexjar();
    clickButton("Gi oss tilbakemelding");
    clickButton("Horribel");
    clickButton("Send tilbakemelding");

    expect(localStorage.getItem(StoreKey.FLEXJAR_FEEDBACK_DATE)).to.not.be.null;
  });
});

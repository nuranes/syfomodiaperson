import { screen } from "@testing-library/react";
import React from "react";
import { QueryClientProvider } from "react-query";
import DialogmoteInnkallingVelgArbeidsgiver from "@/components/dialogmote/innkalling/virksomhet/DialogmoteInnkallingVelgArbeidsgiver";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import { Form } from "react-final-form";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { renderWithRouter } from "../../testRouterUtils";

let queryClient: any;
const noOpMethod = () => {
  /*not empty*/
};

const renderDialogmoteInnkallingVelgArbeidsgiver = () =>
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: "0315", setValgtEnhet: () => void 0 }}
      >
        <Form onSubmit={noOpMethod}>
          {() => <DialogmoteInnkallingVelgArbeidsgiver />}
        </Form>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );

describe("Choose Arbeidsgiver", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Show virksomhetinput when aktivt sykefraværstilfelle", () => {
    renderDialogmoteInnkallingVelgArbeidsgiver();
    expect(screen.getByRole("radio", { name: "Oppgi virksomhetsnummer" })).to
      .exist;
  });
});

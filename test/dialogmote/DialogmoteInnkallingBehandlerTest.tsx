import { expect } from "chai";
import React from "react";
import DialogmoteInnkallingBehandler, {
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingBehandler";
import { QueryClientProvider } from "react-query";
import { arbeidstaker, navEnhet } from "./testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { screen } from "@testing-library/react";
import { queryClientWithMockData } from "../testQueryClient";
import { BehandlerDTO, BehandlerType } from "@/data/behandler/BehandlerDTO";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import { renderWithRouter } from "../testRouterUtils";

let queryClient: any;
const noOpMethod = () => {
  /*not empty*/
};
describe("DialogmoteInnkallingBehandler", () => {
  const fastlege = {
    type: BehandlerType.FASTLEGE,
    behandlerRef: "123",
    fornavn: "Lego",
    mellomnavn: "Las",
    etternavn: "Legesen",
  };
  const behandlere: BehandlerDTO[] = [fastlege];

  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("shows a list of behandlere", () => {
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => behandlere
    );
    renderDialogmoteInnkallingBehandler();

    expect(screen.getAllByRole("radio")).to.have.length(3);
    expect(screen.getByRole("radio", { name: "Ingen behandler" })).to.exist;
    expect(screen.getByRole("radio", { name: "Fastlege: Lego Las Legesen" })).to
      .exist;
    expect(screen.queryByText("Venter...")).to.not.exist;
  });
  it("displays an app spinner when loading", () => {
    renderDialogmoteInnkallingBehandler();

    expect(screen.getByText("Venter...")).to.exist;
    expect(screen.queryAllByRole("radio")).to.be.empty;
  });

  it("displays alert message when no behandlere", () => {
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => []
    );
    renderDialogmoteInnkallingBehandler();

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(texts.noBehandlerFound)).to.exist;
  });
});

const renderDialogmoteInnkallingBehandler = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteInnkallingBehandler setSelectedBehandler={noOpMethod} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );
};

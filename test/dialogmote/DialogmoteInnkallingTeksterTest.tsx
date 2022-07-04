import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import React from "react";
import DialogmoteInnkallingTekster, {
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { navEnhet } from "./testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { brukerinfoMock } from "../../mock/syfoperson/brukerinfoMock";

const queryClient = queryClientWithAktivBruker();

const renderDialogmoteInnkallingTekster = (navBrukerKanVarsles: boolean) => {
  const kanVarsel = {
    ...brukerinfoMock,
    kontaktinfo: {
      ...brukerinfoMock.kontaktinfo,
      skalHaVarsel: true,
    },
  };
  const kanIkkeVarsel = {
    ...brukerinfoMock,
    kontaktinfo: {
      ...brukerinfoMock.kontaktinfo,
      skalHaVarsel: false,
    },
  };
  if (navBrukerKanVarsles) {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kanVarsel
    );
  } else {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kanIkkeVarsel
    );
  }

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <Form
            onSubmit={() => {
              /* Do nothing */
            }}
          >
            {() => (
              <DialogmoteInnkallingTekster
                selectedBehandler={undefined}
                visAlternativTekst={false}
              />
            )}
          </Form>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("DialogmoteInnkallingTekster", () => {
  it("viser advarsel om papirpost når bruker ikke kan varsles digitalt", () => {
    renderDialogmoteInnkallingTekster(false);

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(texts.reservertAlert)).to.exist;
  });
  it("viser ikke advarsel om papirpost når bruker kan varsles digitalt", () => {
    renderDialogmoteInnkallingTekster(true);

    expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
    expect(screen.queryByText(texts.reservertAlert)).to.not.exist;
  });
});

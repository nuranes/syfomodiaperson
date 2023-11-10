import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { StartNyVurdering } from "@/components/aktivitetskrav/vurdering/StartNyVurdering";
import { expect } from "chai";
import { queryClientWithMockData } from "../testQueryClient";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { generateOppfolgingstilfelle } from "../testDataUtils";
import { clickButton, daysFromToday, getButton } from "../testUtils";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const buttonText = "Start ny vurdering";
const noAktivitetskravText =
  "Aktivitetskravet er ikke tidligere vurdert i dette sykefraværet.";
const tilfelleStart = daysFromToday(-50);
const tilfelleEnd = daysFromToday(50);
const oppfolgingstilfelle = generateOppfolgingstilfelle(
  tilfelleStart,
  tilfelleEnd
);

const renderStartNyVurdering = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <StartNyVurdering />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("StartNyVurdering", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
      () => ({
        personIdent: fnr,
        oppfolgingstilfelleList: [oppfolgingstilfelle],
      })
    );
  });
  it("renders panel to start ny vurdering", () => {
    renderStartNyVurdering();

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(
      screen.getByRole("heading", { name: "Start ny aktivitetskrav-vurdering" })
    ).to.exist;
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
    expect(screen.getByText(noAktivitetskravText)).to.exist;
    expect(getButton(buttonText)).to.exist;
  });
  it("click button runs mutation", () => {
    renderStartNyVurdering();

    clickButton(buttonText);

    const nyVurderingMutation = queryClient.getMutationCache().getAll()[0];
    expect(nyVurderingMutation).to.exist;
  });
});

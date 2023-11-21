import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { StartNyVurdering } from "@/components/aktivitetskrav/vurdering/StartNyVurdering";
import { expect } from "chai";
import { queryClientWithMockData } from "../testQueryClient";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../../mock/common/mockConstants";
import {
  createAktivitetskrav,
  createAktivitetskravVurdering,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import { clickButton, daysFromToday, getButton } from "../testUtils";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { vurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { NotificationContext } from "@/context/notification/NotificationContext";

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
const unntakBeskrivelse = "Vurdering beskrivelse";
const unntakArsak = UnntakVurderingArsak.MEDISINSKE_GRUNNER;
const aktivitetskravUnntak = createAktivitetskrav(
  daysFromToday(20),
  AktivitetskravStatus.UNNTAK,
  [
    createAktivitetskravVurdering(
      AktivitetskravStatus.UNNTAK,
      [unntakArsak],
      unntakBeskrivelse
    ),
  ]
);
const aktivitetskravIkkeAktuelt = createAktivitetskrav(
  daysFromToday(20),
  AktivitetskravStatus.IKKE_AKTUELL,
  [
    createAktivitetskravVurdering(
      AktivitetskravStatus.IKKE_AKTUELL,
      [],
      undefined
    ),
  ]
);
const aktivitetskravAutomatiskOppfylt = createAktivitetskrav(
  daysFromToday(20),
  AktivitetskravStatus.AUTOMATISK_OPPFYLT
);
const newVurderingText =
  "Hvis situasjonen har endret seg kan du gjøre en ny vurdering av aktivitetskravet.";

const renderStartNyVurdering = (aktivitetskrav?: AktivitetskravDTO) => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <StartNyVurdering aktivitetskrav={aktivitetskrav} />
        </NotificationContext.Provider>
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
  it("renders header, tilfelle-text and button to start ny vurdering", () => {
    renderStartNyVurdering();

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(
      screen.getByRole("heading", {
        name: "Start ny aktivitetskrav-vurdering",
      })
    ).to.exist;
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
    expect(getButton(buttonText)).to.exist;
  });
  describe("Uten aktivitetskrav", () => {
    it("renders no vurdering text", () => {
      renderStartNyVurdering();

      expect(screen.getByText(noAktivitetskravText)).to.exist;
    });
    it("click button runs mutation with no aktivitetskrav uuid", () => {
      renderStartNyVurdering();

      clickButton(buttonText);

      const nyVurderingMutation = queryClient.getMutationCache().getAll()[0];
      expect(nyVurderingMutation.options.variables).to.be.undefined;
    });
  });
  describe("Med aktivitetskrav i sluttilstand", () => {
    it("renders no vurdering text when aktivitetskrav has no vurderinger", () => {
      renderStartNyVurdering(aktivitetskravAutomatiskOppfylt);

      expect(screen.getByText(noAktivitetskravText)).to.exist;
    });
    it("renders vurdering text when aktivitetskrav has vurdering", () => {
      renderStartNyVurdering(aktivitetskravUnntak);

      expect(screen.queryByText(noAktivitetskravText)).to.not.exist;
      const expectedVurderingText = `Det ble vurdert unntak for ${ARBEIDSTAKER_DEFAULT_FULL_NAME}.`;
      const arsakText = `Årsak: ${vurderingArsakTexts[unntakArsak]}`;
      expect(screen.getByText(expectedVurderingText)).to.exist;
      expect(screen.getByText(arsakText)).to.exist;
      expect(screen.getByText(newVurderingText)).to.exist;
    });
    it("renders vurdering text when aktivitetskrav has vurdering but no arsak and beskrivelse", () => {
      renderStartNyVurdering(aktivitetskravIkkeAktuelt);

      expect(screen.queryByText(noAktivitetskravText)).to.not.exist;
      const expectedVurderingText = `Det ble vurdert at aktivitetskravet ikke er aktuelt for ${ARBEIDSTAKER_DEFAULT_FULL_NAME}.`;
      expect(screen.getByText(expectedVurderingText)).to.exist;
      expect(screen.getByText(newVurderingText)).to.exist;
    });
    it("click button runs mutation with aktivitetskrav uuid", () => {
      renderStartNyVurdering(aktivitetskravUnntak);

      clickButton(buttonText);

      const nyVurderingMutation = queryClient.getMutationCache().getAll()[0];
      expect(nyVurderingMutation.options.variables).to.deep.equal({
        previousAktivitetskravUuid: aktivitetskravUnntak.uuid,
      });
    });
  });
});

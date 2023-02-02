import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { daysFromToday } from "../testUtils";
import { render, screen } from "@testing-library/react";
import { AktivitetskravSide } from "@/components/aktivitetskrav/AktivitetskravSide";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  avventVurdering,
  createAktivitetskrav,
  createAktivitetskravVurdering,
  generateOppfolgingstilfelle,
  ikkeOppfyltVurdering,
  oppfyltVurdering,
  unntakVurdering,
} from "../testDataUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AvventVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
const noOppfolgingstilfelleAktivitetskravText =
  "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.";

const mockOppfolgingstilfellePerson = (
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
) => {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: fnr,
    oppfolgingstilfelleList: oppfolgingstilfeller,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
    () => oppfolgingstilfellePerson
  );
};

const mockAktivitetskrav = (aktivitetskrav: AktivitetskravDTO[]) => {
  queryClient.setQueryData(
    aktivitetskravQueryKeys.aktivitetskrav(fnr),
    () => aktivitetskrav
  );
};

const activeOppfolgingstilfelle = generateOppfolgingstilfelle(
  daysFromToday(-30),
  daysFromToday(30)
);
const inactiveOppfolgingstilfelle = generateOppfolgingstilfelle(
  daysFromToday(-100),
  daysFromToday(-50)
);

const renderAktivitetskravSide = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <AktivitetskravSide />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("AktivitetskravSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("Viser utdrag fra sykefraværet", () => {
    renderAktivitetskravSide();

    expect(screen.getByRole("heading", { name: "Utdrag fra sykefraværet" })).to
      .exist;
  });

  describe("Vurder aktivitetskravet", () => {
    it("Vises når person har oppfølgingstilfelle med aktivitetskrav (NY)", () => {
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByText(noOppfolgingstilfelleAktivitetskravText)).to.not
        .exist;
    });
    it("Vises med advarsel når person har inaktivt oppfølgingstilfelle med aktivitetskrav (NY)", () => {
      mockOppfolgingstilfellePerson([
        generateOppfolgingstilfelle(daysFromToday(-30), daysFromToday(-20)),
      ]);
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(-25), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });
    it("Vises når person har oppfølgingstilfelle med bare aktivitetskrav (AUTOMATISK_OPPFYLT)", () => {
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.AUTOMATISK_OPPFYLT
        ),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByRole(noOppfolgingstilfelleAktivitetskravText)).to.not
        .exist;
    });
    it("Vises når aktivitetskrav gjelder tidligere tilfelle", () => {
      mockOppfolgingstilfellePerson([
        inactiveOppfolgingstilfelle,
        activeOppfolgingstilfelle,
      ]);
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(-70), AktivitetskravStatus.NY),
      ]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByText(noOppfolgingstilfelleAktivitetskravText)).to.not
        .exist;
    });
    it("Vises når person har oppfølgingstilfelle uten aktivitetskrav", () => {
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByText(noOppfolgingstilfelleAktivitetskravText)).to.not
        .exist;
    });
    it("Vises med advarsel når person har inaktivt oppfølgingstilfelle uten aktivitetskrav", () => {
      mockOppfolgingstilfellePerson([inactiveOppfolgingstilfelle]);
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });

    it("Vises med advarsel når person har verken oppfølgingstilfelle eller aktivitetskrav", () => {
      mockOppfolgingstilfellePerson([]);
      mockAktivitetskrav([]);

      renderAktivitetskravSide();

      expect(screen.getByRole("heading", { name: "Vurdere aktivitetskravet" }))
        .to.exist;
      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
      expect(screen.getByText(noOppfolgingstilfelleAktivitetskravText)).to
        .exist;
    });
  });
  describe("Vurdering alert", () => {
    it("viser siste aktivitetskrav-vurdering fra alle aktivitetskrav for oppfølgingstilfellet", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.OPPFYLT, [
          oppfyltVurdering,
          avventVurdering,
        ]),
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.UNNTAK, [
          unntakVurdering,
        ]),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
      expect(
        screen.getByText(/Det er vurdert at Samuel Sam Jones er i aktivitet/)
      ).to.exist;
    });
    it("viser siste aktivitetskrav-vurdering fra aktivitetskrav uten oppfølgingstilfelle", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.UNNTAK, [
          unntakVurdering,
        ]),
      ]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
      expect(screen.getByText(/Det er vurdert unntak/)).to.exist;
    });
    it("viser advarsel når siste aktivitetskrav-vurdering er AVVENT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.AVVENT, [
          avventVurdering,
        ]),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
      expect(screen.getByText(/Avventer - /)).to.exist;
    });
    it("viser beskrivelse og årsaker når siste aktivitetskrav-vurdering er AVVENT", () => {
      const beskrivelse = "Avventer litt";
      const vurdering = createAktivitetskravVurdering(
        AktivitetskravStatus.AVVENT,
        [
          AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
          AvventVurderingArsak.INFORMASJON_BEHANDLER,
        ],
        beskrivelse
      );
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.AVVENT, [
          vurdering,
        ]),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByText(beskrivelse)).to.exist;
      expect(screen.getByText("Har bedt om oppfølgingsplan fra arbeidsgiver"))
        .to.exist;
      expect(screen.getByText("Har bedt om mer informasjon fra behandler")).to
        .exist;
    });
    it("viser suksess når siste aktivitetskrav-vurdering er OPPFYLT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.OPPFYLT, [
          oppfyltVurdering,
          avventVurdering,
        ]),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
      expect(
        screen.getByText(/Det er vurdert at Samuel Sam Jones er i aktivitet/)
      ).to.exist;
    });
    it("viser suksess når siste aktivitetskrav-vurdering er UNNTAK", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.UNNTAK, [
          unntakVurdering,
          avventVurdering,
        ]),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
      expect(screen.getByText(/Det er vurdert unntak/)).to.exist;
    });
    it("viser suksess når siste aktivitetskrav-vurdering er IKKE_OPPFYLT", () => {
      mockAktivitetskrav([
        createAktivitetskrav(
          daysFromToday(20),
          AktivitetskravStatus.IKKE_OPPFYLT,
          [ikkeOppfyltVurdering, avventVurdering]
        ),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
      expect(
        screen.getByText(/Det er vurdert at aktivitetskravet ikke er oppfylt/)
      ).to.exist;
    });
    it("viser ingen alert når ingen aktivitetskrav-vurdering", () => {
      mockAktivitetskrav([
        createAktivitetskrav(daysFromToday(20), AktivitetskravStatus.NY),
      ]);
      mockOppfolgingstilfellePerson([activeOppfolgingstilfelle]);
      renderAktivitetskravSide();

      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByRole("img", { name: "suksess-ikon" })).to.not.exist;
      expect(screen.queryByText(/Det er vurdert/)).to.not.exist;
      expect(screen.queryByText(/Avventer - /)).to.not.exist;
    });
  });
});

import {
  AktivitetskravDTO,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export const oppfolgingstilfelleForAktivitetskrav = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO | undefined => {
  return oppfolgingstilfeller.find((tilfelle) =>
    gjelderOppfolgingstilfelle(aktivitetskrav, tilfelle)
  );
};

export const aktivitetskravVurderingerForOppfolgingstilfelle = (
  aktivitetskrav: AktivitetskravDTO[],
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): AktivitetskravVurderingDTO[] => {
  return aktivitetskrav
    .filter((aktivitetskrav) =>
      gjelderOppfolgingstilfelle(aktivitetskrav, oppfolgingstilfelle)
    )
    .flatMap((aktivitetskrav) => aktivitetskrav.vurderinger);
};

const gjelderOppfolgingstilfelle = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean => {
  return (
    aktivitetskrav.stoppunktAt > oppfolgingstilfelle.start &&
    aktivitetskrav.stoppunktAt <= oppfolgingstilfelle.end
  );
};

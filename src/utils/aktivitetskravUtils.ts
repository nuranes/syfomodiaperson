import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export const oppfolgingstilfelleForAktivitetskrav = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO | undefined => {
  return oppfolgingstilfeller.find((tilfelle) =>
    gjelderOppfolgingstilfelle(aktivitetskrav, tilfelle)
  );
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

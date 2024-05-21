import { toDate } from "./datoUtils";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";

export type TilfellePeriode = { fom: string | Date; tom: string | Date };

export const sorterPerioderEldsteForst = (
  perioder: SykmeldingPeriodeDTO[]
): SykmeldingPeriodeDTO[] => {
  return perioder.sort((a, b) => {
    if (toDate(a.fom)?.getTime() !== toDate(b.fom)?.getTime()) {
      return (toDate(a.fom)?.getTime() ?? 0) - (toDate(b.fom)?.getTime() ?? 0);
    }
    return (toDate(a.tom)?.getTime() ?? 0) - (toDate(b.tom)?.getTime() ?? 0);
  });
};

export const tidligsteFom = (perioder: TilfellePeriode[]): string | Date => {
  return perioder
    .map((p) => p.fom)
    .sort((p1, p2) => (p1 > p2 ? 1 : p1 < p2 ? -1 : 0))[0];
};

export const senesteTom = (perioder: TilfellePeriode[]): string | Date => {
  return perioder
    .map((p) => p.tom)
    .sort((p1, p2) => (p1 < p2 ? 1 : p1 > p2 ? -1 : 0))[0];
};

export const periodeOverlapperMedPeriode = (
  periodeA_: TilfellePeriode,
  periodeB_: TilfellePeriode
): boolean => {
  const periodeA = periodeA_;
  const periodeB = periodeB_;
  try {
    const forstePeriode =
      new Date(periodeA.fom).getTime() < new Date(periodeB.fom).getTime()
        ? periodeA
        : periodeB;
    const andrePeriode =
      new Date(periodeA.fom).getTime() < new Date(periodeB.fom).getTime()
        ? periodeB
        : periodeA;
    return (
      new Date(forstePeriode.tom).getTime() >=
      new Date(andrePeriode.fom).getTime()
    );
  } catch (e) {
    return false;
  }
};

import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import {
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../mock/common/mockConstants";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { generateUUID } from "@/utils/uuidUtils";
import { daysFromToday } from "./testUtils";

export const generateOppfolgingstilfelle = (
  start: Date,
  end: Date
): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    arbeidstakerAtTilfelleEnd: true,
    end: end,
    start: start,
  };
};

export const createAktivitetskrav = (
  stoppunktAt: Date,
  status: AktivitetskravStatus,
  vurderinger: AktivitetskravVurderingDTO[] = []
): AktivitetskravDTO => {
  return {
    createdAt: new Date(),
    status,
    stoppunktAt,
    uuid: generateUUID(),
    vurderinger,
  };
};

export const createAktivitetskravVurdering = (
  status: AktivitetskravStatus,
  arsaker: VurderingArsak[],
  beskrivelse: string | undefined = "",
  createdAt = new Date(),
  frist?: Date
): AktivitetskravVurderingDTO => {
  return {
    beskrivelse,
    createdAt,
    createdBy: VEILEDER_IDENT_DEFAULT,
    status,
    uuid: generateUUID(),
    arsaker,
    frist: frist,
  };
};

export const avventVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT,
  [
    AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
    AvventVurderingArsak.INFORMASJON_BEHANDLER,
  ],
  "",
  new Date(),
  new Date()
);
export const avventVurderingUtenFrist = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT,
  [
    AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
    AvventVurderingArsak.INFORMASJON_BEHANDLER,
  ],
  "",
  new Date()
);
export const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT,
  [OppfyltVurderingArsak.FRISKMELDT]
);
export const unntakVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.UNNTAK,
  [UnntakVurderingArsak.SJOMENN_UTENRIKS]
);
export const ikkeOppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.IKKE_OPPFYLT,
  []
);
export const ikkeAktuellVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.IKKE_AKTUELL,
  []
);
export const forhandsvarselVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.FORHANDSVARSEL,
  [],
  "Begrunnelse for forhåndsvarsel",
  new Date(),
  daysFromToday(21)
);

import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import {
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { daysFromToday } from "../testUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { generateUUID } from "@/utils/uuidUtils";

export const createOppfolgingstilfelle = (
  end: Date
): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    arbeidstakerAtTilfelleEnd: true,
    end,
    start: daysFromToday(-30),
  };
};

export const createAktivitetskrav = (
  stoppunktAt: Date,
  status: AktivitetskravStatus,
  vurderinger: AktivitetskravVurderingDTO[] = []
): AktivitetskravDTO => {
  return {
    createdAt: new Date(),
    sistEndret: new Date(),
    status,
    stoppunktAt,
    uuid: generateUUID(),
    vurderinger,
  };
};

export const createAktivitetskravVurdering = (
  status: AktivitetskravStatus
): AktivitetskravVurderingDTO => {
  return {
    beskrivelse: "",
    createdAt: new Date(),
    createdBy: VEILEDER_IDENT_DEFAULT,
    status,
    uuid: generateUUID(),
  };
};

export const avventVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.AVVENT
);
export const oppfyltVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.OPPFYLT
);
export const unntakVurdering = createAktivitetskravVurdering(
  AktivitetskravStatus.UNNTAK
);

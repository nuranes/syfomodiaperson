import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
} from "../../src/data/aktivitetskrav/aktivitetskravTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import { daysFromToday } from "../../test/testUtils";

const aktivitetskravNy = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-7),
  sistEndret: daysFromToday(-7),
  status: AktivitetskravStatus.NY,
  stoppunktAt: daysFromToday(42),
  vurderinger: [],
};

const aktivitetskravOppfylt = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-400),
  sistEndret: daysFromToday(-250),
  status: AktivitetskravStatus.OPPFYLT,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-250),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.OPPFYLT,
      beskrivelse: "Oppfylt",
      arsaker: [OppfyltVurderingArsak.FRISKMELDT],
    },
    {
      uuid: generateUUID(),
      createdAt: daysFromToday(-400),
      createdBy: VEILEDER_DEFAULT.ident,
      status: AktivitetskravStatus.AVVENT,
      beskrivelse: "Avventer info",
      arsaker: [
        AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
        AvventVurderingArsak.INFORMASJON_BEHANDLER,
      ],
    },
  ],
};
const aktivitetskravAutomatiskOppfylt = {
  uuid: generateUUID(),
  createdAt: daysFromToday(-350),
  sistEndret: daysFromToday(-350),
  status: AktivitetskravStatus.AUTOMATISK_OPPFYLT,
  stoppunktAt: daysFromToday(-400),
  vurderinger: [],
};

export const aktivitetskravMock = [
  aktivitetskravNy,
  aktivitetskravAutomatiskOppfylt,
  aktivitetskravOppfylt,
];

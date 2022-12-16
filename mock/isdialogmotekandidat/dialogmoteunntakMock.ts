import { generateUUID } from "../../src/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { UnntakArsak } from "../../src/data/dialogmotekandidat/types/dialogmoteunntakTypes";

const createDialogmoteunntak = (arsak: UnntakArsak, beskrivelse?: string) => {
  return {
    uuid: generateUUID(),
    createdAt: new Date().toDateString(),
    createdBy: VEILEDER_DEFAULT.ident,
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    arsak,
    beskrivelse,
  };
};

export const dialogmoteunntakMedBeskrivelse = createDialogmoteunntak(
  UnntakArsak.ARBEIDSFORHOLD_OPPHORT,
  "Arbeidstaker jobber ikke lenger hos arbeidsgiver."
);
export const dialogmoteunntakUtenBeskrivelse = createDialogmoteunntak(
  UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
  undefined
);

export const unntaksstatistikk = [
  {
    unntakDato: new Date("2022-10-02"),
    tilfelleStart: new Date("2022-10-01"),
    tilfelleEnd: new Date("2022-10-16"),
  },
  {
    unntakDato: new Date("2022-04-01"),
    tilfelleStart: new Date("2022-01-01"),
    tilfelleEnd: new Date("2022-10-25"),
  },
  {
    unntakDato: new Date("2022-10-02"),
    tilfelleStart: new Date("2022-10-01"),
    tilfelleEnd: new Date("2022-11-02"),
  },
  {
    unntakDato: new Date("2022-10-02"),
    tilfelleStart: new Date("2022-10-01"),
    tilfelleEnd: new Date("2022-12-20"),
  },
  {
    unntakDato: new Date("2022-10-02"),
    tilfelleStart: new Date("2022-10-01"),
    tilfelleEnd: new Date("2023-12-20"),
  },
];

export const dialogmoteunntakMock = [
  dialogmoteunntakMedBeskrivelse,
  dialogmoteunntakUtenBeskrivelse,
];

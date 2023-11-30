import { daysFromToday } from "../../test/testUtils";
import { AktivitetskravStatus } from "../../src/data/aktivitetskrav/aktivitetskravTypes";
import { VEILEDER_DEFAULT } from "../common/mockConstants";

export const aktivitetskravHistorikkMock = [
  {
    tidspunkt: daysFromToday(-30),
    status: AktivitetskravStatus.NY,
    vurdertAv: null,
  },
  {
    tidspunkt: daysFromToday(-22),
    status: AktivitetskravStatus.UNNTAK,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
  {
    tidspunkt: daysFromToday(-21),
    status: AktivitetskravStatus.NY_VURDERING,
    vurdertAv: null,
  },
  {
    tidspunkt: daysFromToday(-21),
    status: AktivitetskravStatus.FORHANDSVARSEL,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
  {
    tidspunkt: daysFromToday(-1),
    status: AktivitetskravStatus.OPPFYLT,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
];

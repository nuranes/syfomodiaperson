import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { Veileder } from "@/data/veilederinfo/types/Veileder";

export const veilederMock = new Veileder(
  VEILEDER_IDENT_DEFAULT,
  "Vetle",
  "Veileder",
  "vetle.veileder@nav.no",
  "12345678"
);

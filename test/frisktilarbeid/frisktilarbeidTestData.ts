import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { VEILEDER_DEFAULT } from "../../mock/common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";

export const createVedtak = (fom: Date): VedtakResponseDTO => ({
  uuid: "123",
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  fom,
  tom: addWeeks(fom, 12),
  begrunnelse: "begrunnelse",
  document: [],
});

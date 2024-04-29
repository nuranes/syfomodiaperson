import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

export const createVedtak = (fom: Date): VedtakResponseDTO => ({
  uuid: "123",
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  fom,
  tom: addWeeks(fom, 12),
  begrunnelse: "begrunnelse",
  document: [],
});

export const getExpectedBehandlerDocument = (
  fom: Date,
  tom: Date
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Informasjon om vedtak om friskmelding til arbeidsformidling"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `Periode fra ${tilLesbarDatoMedArUtenManedNavn(
          fom
        )} til ${tilLesbarDatoMedArUtenManedNavn(tom)}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Din pasient har fått eget vedtak tilsendt."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Vedtaket er hjemlet i folketrygdloven § 8-5."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "@/data/aktivitetskrav/forhandsvarselTexts";
import {
  IkkeAktuellArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  ikkeAktuellVurderingArsakTexts,
  oppfyltVurderingArsakTexts,
  unntakVurderingArsakTexts,
} from "@/data/aktivitetskrav/aktivitetskravTexts";

const expectedFristDate = addWeeks(new Date(), 3);

export const getUnntakDocument = (
  begrunnelse: string,
  arsak: UnntakVurderingArsak
): DocumentComponentDto[] => {
  return [
    vurderingHeader,
    vurderingGjelder,
    {
      texts: [
        `Det ble vurdert unntak fra aktivitetskravet den ${tilDatoMedManedNavn(
          new Date()
        )}. Årsak: ${unntakVurderingArsakTexts[arsak]}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    vurderingBegrunnelse(begrunnelse),
    vurderingHjemmel,
    vurderingHilsen,
  ];
};

export const getIkkeAktuellDocument = (
  begrunnelse: string,
  arsak: IkkeAktuellArsak
): DocumentComponentDto[] => {
  return [
    vurderingHeader,
    vurderingGjelder,
    {
      texts: [
        `Det ble vurdert at aktivitetskravet ikke er aktuelt den ${tilDatoMedManedNavn(
          new Date()
        )}. Årsak: ${ikkeAktuellVurderingArsakTexts[arsak]}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    vurderingBegrunnelse(begrunnelse),
    ikkeAktuellHjemmel,
    vurderingHilsen,
  ];
};

export const getOppfyltDocument = (
  begrunnelse: string,
  arsak: OppfyltVurderingArsak
): DocumentComponentDto[] => {
  return [
    vurderingHeader,
    vurderingGjelder,
    {
      texts: [
        `Det ble vurdert at aktivitetskravet er oppfylt den ${tilDatoMedManedNavn(
          new Date()
        )}. Årsak: ${oppfyltVurderingArsakTexts[arsak]}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    vurderingBegrunnelse(begrunnelse),
    vurderingHjemmel,
    vurderingHilsen,
  ];
};

const vurderingBegrunnelse = (begrunnelse: string) => ({
  texts: [`Begrunnelse: ${begrunnelse}`],
  type: DocumentComponentType.PARAGRAPH,
});

const vurderingHeader = {
  texts: ["Vurdering av aktivitetskravet"],
  type: DocumentComponentType.HEADER_H1,
};

const vurderingGjelder = {
  texts: [
    `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}`,
  ],
  type: DocumentComponentType.PARAGRAPH,
};

const vurderingHilsen = {
  texts: [`Vurdert av ${VEILEDER_DEFAULT.fulltNavn()}`],
  type: DocumentComponentType.PARAGRAPH,
};

const vurderingHjemmel = {
  texts: [
    "Vedtak ble fattet etter folketrygdloven § 8-8 andre ledd, samt tilhørende rundskriv.",
  ],
  type: DocumentComponentType.PARAGRAPH,
};

const ikkeAktuellHjemmel = {
  texts: [
    "Det er vurdert at folketrygdloven § 8-8 andre ledd ikke kommer til anvendelse i dette tilfellet.",
  ],
  type: DocumentComponentType.PARAGRAPH,
};

export const getSendForhandsvarselDocument = (
  beskrivelse: string,
  mal: Brevmal = Brevmal.MED_ARBEIDSGIVER
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarselTexts({
    frist: expectedFristDate,
    mal,
  });
  const documentComponents = [
    {
      texts: [sendForhandsvarselTexts.varselInfo.header],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [sendForhandsvarselTexts.varselInfo.intro],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.varselInfo.stans1],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.varselInfo.stans2],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [beskrivelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.unngaStansInfo.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3,
      ],
      type: DocumentComponentType.BULLET_POINTS,
    },
  ];

  if (mal === Brevmal.UTLAND) {
    documentComponents.push({
      texts: [sendForhandsvarselTexts.utland.dokumentasjon],
      type: DocumentComponentType.PARAGRAPH,
    });
  }

  documentComponents.push(
    {
      texts: [sendForhandsvarselTexts.giOssTilbakemelding.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.kontaktOss.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [sendForhandsvarselTexts.kontaktOss.kontaktOss],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.pliktInfo],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    }
  );

  return documentComponents;
};

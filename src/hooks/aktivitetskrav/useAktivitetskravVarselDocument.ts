import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "@/data/aktivitetskrav/forhandsvarselTexts";
import {
  VarselType,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { vurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
  mal: Brevmal;
};

type VurderingDocumentValues = {
  varselType: VarselType;
  begrunnelse: string | undefined;
  arsak: VurderingArsak;
};

export const useAktivitetskravVarselDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getVurderingDocument(values: VurderingDocumentValues): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder } = useDocumentComponents();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { mal, begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselTexts({
      mal,
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.introWithFristDate),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.unngaStansInfo.header),
      createBulletPoints(
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3
      ),

      createHeaderH3(sendForhandsvarselTexts.giOssTilbakemelding.header),
      createParagraph(
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate
      ),
      createParagraph(sendForhandsvarselTexts.giOssTilbakemelding.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getVurderingDocument = (values: VurderingDocumentValues) => {
    const { varselType, begrunnelse, arsak } = values;
    const documentComponents = [
      createHeaderH1("Vurdering av aktivitetskravet"),
      getIntroGjelder(),
      createParagraph(getVurderingText(varselType, arsak)),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(`Begrunnelse: ${begrunnelse}`));
    }
    documentComponents.push(
      createParagraph(
        "Vedtak ble fattet etter folketrygdloven § 8-8 andre ledd, samt tilhørende rundskriv."
      ),
      createParagraph(`Vurdert av ${veilederinfo?.navn || ""}`)
    );

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
    getVurderingDocument,
  };
};

const getVurderingText = (type: VarselType, arsak: VurderingArsak): string => {
  const arsakText = vurderingArsakTexts[arsak] ?? "";
  const vurdertDato = tilDatoMedManedNavn(new Date());
  switch (type) {
    case VarselType.UNNTAK: {
      return `Det ble vurdert unntak fra aktivitetskravet den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.OPPFYLT: {
      return `Det ble vurdert at aktivitetskravet er oppfylt den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.IKKE_AKTUELL: {
      return `Det ble vurdert at aktivitetskravet ikke er aktuelt den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.FORHANDSVARSEL_STANS_AV_SYKEPENGER: {
      throw new Error("use getForhandsvarselDocument");
    }
  }
};

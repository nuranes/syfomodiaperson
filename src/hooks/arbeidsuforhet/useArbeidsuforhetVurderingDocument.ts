import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { getForhandsvarsel84Texts } from "@/data/arbeidsuforhet/forhandsvarsel84Texts";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type VurderingDocumentValues = {
  begrunnelse: string;
  type: VurderingType;
};

export const useArbeidsuforhetVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getVurderingDocument(values: VurderingDocumentValues): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getVurdertAv } = useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarsel84Texts({
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.introWithFristDate),
      createParagraph(sendForhandsvarselTexts.begrunnelse.uteAvStand),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.duKanUttaleDeg.header),
      createParagraph(
        sendForhandsvarselTexts.duKanUttaleDeg.tilbakemeldingWithFristDate
      ),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.etterFrist),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getVurderingDocument = (values: VurderingDocumentValues) => {
    const { type, begrunnelse } = values;

    if (type === VurderingType.FORHANDSVARSEL) {
      throw new Error("use getForhandsvarselDocument");
    }

    const documentComponents = [
      createHeaderH1("Vurdering av arbeidsuførhet"),
      getIntroGjelder(),
      createParagraph(getVurderingText(type)),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(`Begrunnelse: ${begrunnelse}`));
    }

    documentComponents.push(getVurdertAv());

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
    getVurderingDocument,
  };
};

const getVurderingText = (
  type: VurderingType.OPPFYLT | VurderingType.AVSLAG
) => {
  const vurdertDato = tilDatoMedManedNavn(new Date());
  switch (type) {
    case VurderingType.OPPFYLT: {
      return `Det ble vurdert oppfylt den ${vurdertDato}`;
    }
    case VurderingType.AVSLAG: {
      return `Det ble vurdert avslag den ${vurdertDato}.`;
    }
  }
};

import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { getForhandsvarselArbeidsuforhetTexts } from "@/data/arbeidsuforhet/arbeidsuforhetDocumentTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

export const useArbeidsuforhetVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getOppfyltDocument(begrunnelse: string): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getVurdertAv } = useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselArbeidsuforhetTexts({
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
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.friskmeldt),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getOppfyltDocument = (begrunnelse: string) => {
    const vurdertDato = tilDatoMedManedNavn(new Date());
    const documentComponents = [
      createHeaderH1("Vurdering av § 8-4 arbeidsuførhet"),
      getIntroGjelder(),
      createParagraph(`Det ble vurdert oppfylt den ${vurdertDato}.`),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(`Begrunnelse: ${begrunnelse}`));
    }

    documentComponents.push(getVurdertAv());

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
    getOppfyltDocument,
  };
};

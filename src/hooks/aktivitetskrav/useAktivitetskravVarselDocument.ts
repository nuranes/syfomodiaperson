import { sendForhandsvarselTexts } from "@/data/aktivitetskrav/forhandsvarselTexts";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";

export const useAktivitetskravVarselDocument = (): {
  getForhandsvarselDocument(
    begrunnelse: string,
    fristDato: Date
  ): DocumentComponentDto[];
} => {
  const { getHilsen } = useDocumentComponents();

  const getForhandsvarselDocument = (
    begrunnelse: string | undefined,
    fristDato: Date
  ) => {
    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(
        sendForhandsvarselTexts.varselInfo.introWithFristDate(fristDato)
      ),
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
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate(
          fristDato
        )
      ),
      createParagraph(sendForhandsvarselTexts.giOssTilbakemelding.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
  };
};

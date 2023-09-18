import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH2,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { sendForhandsvarselTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

export const useAktivitetskravVarselDocument = (): {
  getForhandsvarselDocument(
    begrunnelse: string,
    fristDato: Date
  ): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroHeiWithPersonIdent } = useDocumentComponents();

  const getForhandsvarselDocument = (
    begrunnelse: string | undefined,
    fristDato: Date
  ) => {
    const documentComponents = [
      getIntroHeiWithPersonIdent(),
      createHeaderH2(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(
        sendForhandsvarselTexts.varselInfo.introWithFristDate(fristDato)
      ),
      createParagraph(sendForhandsvarselTexts.varselInfo.intro2),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH2(sendForhandsvarselTexts.unngaStansInfo.header),
      createParagraph(
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3
      ),
      createParagraph(
        sendForhandsvarselTexts.unngaStansInfo.tilbakemeldingWithFristDate(
          fristDato
        )
      ),
      createParagraph(sendForhandsvarselTexts.unngaStansInfo.kontaktOss),

      createHeaderH2(sendForhandsvarselTexts.lovhjemmel.header),
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

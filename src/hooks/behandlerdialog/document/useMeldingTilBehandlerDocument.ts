import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { tilleggsOpplysningerPasientTexts } from "@/data/behandlerdialog/behandlerMeldingTexts";

export const useMeldingTilBehandlerDocument = (): {
  getTilleggsOpplysningerPasientDocument(
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): DocumentComponentDto[];
} => {
  const { getIntroGjelder, getHilsen } = useDocumentComponents();

  return {
    getTilleggsOpplysningerPasientDocument: (
      values: Partial<MeldingTilBehandlerSkjemaValues>
    ) => {
      const documentComponents = [
        createHeaderH1(tilleggsOpplysningerPasientTexts.header),
        getIntroGjelder(),
        createParagraph(tilleggsOpplysningerPasientTexts.intro),
      ];

      if (values.meldingTekst) {
        documentComponents.push(createParagraph(values.meldingTekst));
      }

      documentComponents.push(
        createParagraph(tilleggsOpplysningerPasientTexts.outro1),
        createParagraph(tilleggsOpplysningerPasientTexts.outro2),
        createParagraph(tilleggsOpplysningerPasientTexts.hjemmel1),
        createParagraph(tilleggsOpplysningerPasientTexts.hjemmel2),
        getHilsen()
      );

      return documentComponents;
    },
  };
};

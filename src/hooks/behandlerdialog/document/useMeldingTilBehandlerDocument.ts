import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { tilleggsOpplysningerPasientTexts } from "@/data/behandlerdialog/behandlerMeldingTexts";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useMeldingTilBehandlerDocument = (): {
  getTilleggsOpplysningerPasientDocument(
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): DocumentComponentDto[];
} => {
  const navBruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const { getHilsen } = useDocumentComponents();

  return {
    getTilleggsOpplysningerPasientDocument: (
      values: Partial<MeldingTilBehandlerSkjemaValues>
    ) => {
      const documentComponents = [
        createHeaderH1(tilleggsOpplysningerPasientTexts.header),
        createParagraph(`Gjelder pasient: ${navBruker.navn}, ${personident}`),
        createParagraph(tilleggsOpplysningerPasientTexts.intro),
      ];

      if (values.meldingTekst) {
        documentComponents.push(createParagraph(values.meldingTekst));
      }

      documentComponents.push(
        createParagraph(tilleggsOpplysningerPasientTexts.takst),
        createParagraphWithTitle(
          tilleggsOpplysningerPasientTexts.lovhjemmel.title,
          tilleggsOpplysningerPasientTexts.lovhjemmel.text
        ),
        createParagraph(
          tilleggsOpplysningerPasientTexts.klage1,
          tilleggsOpplysningerPasientTexts.klage2
        ),
        getHilsen()
      );

      return documentComponents;
    },
  };
};

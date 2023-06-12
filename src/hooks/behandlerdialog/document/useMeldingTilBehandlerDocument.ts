import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import {
  paminnelseTexts,
  tilleggsOpplysningerPasientTexts,
} from "@/data/behandlerdialog/behandlerMeldingTexts";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

export const useMeldingTilBehandlerDocument = (): {
  getTilleggsOpplysningerPasientDocument(
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): DocumentComponentDto[];
  getPaminnelseDocument(opprinneligMelding: MeldingDTO): DocumentComponentDto[];
} => {
  const navBruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const { getHilsen } = useDocumentComponents();

  const getTilleggsOpplysningerPasientDocument = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1(tilleggsOpplysningerPasientTexts.header),
      createParagraph(`Gjelder pasient: ${navBruker.navn}, ${personident}.`),
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
  };

  const getPaminnelseDocument = (opprinneligMelding: MeldingDTO) => {
    return [
      createHeaderH1(paminnelseTexts.header),
      createParagraph(`Gjelder ${navBruker.navn}, f.nr. ${personident}.`),
      createParagraph(
        `${paminnelseTexts.intro.part1} ${tilLesbarDatoMedArUtenManedNavn(
          opprinneligMelding.tidspunkt
        )} ${paminnelseTexts.intro.part2}`
      ),
      createParagraph(paminnelseTexts.text1),
      createParagraph(paminnelseTexts.text2),
      getHilsen(),
    ];
  };

  return {
    getTilleggsOpplysningerPasientDocument,
    getPaminnelseDocument,
  };
};

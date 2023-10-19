import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import {
  legeerklaringTexts,
  meldingFraNAVTexts,
  paminnelseTexts,
  returLegeerklaringTexts,
  tilleggsOpplysningerPasientTexts,
} from "@/data/behandlerdialog/behandlerMeldingTexts";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  MeldingDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

export const useMeldingTilBehandlerDocument = (): {
  getPaminnelseDocument(opprinneligMelding: MeldingDTO): DocumentComponentDto[];
  getReturLegeerklaringDocument(
    begrunnelse: string | undefined
  ): DocumentComponentDto[];
  getMeldingTilBehandlerDocument(
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): DocumentComponentDto[];
} => {
  const navBruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const { getHilsen } = useDocumentComponents();

  const getMeldingTilBehandlerDocument = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): DocumentComponentDto[] => {
    switch (values.type) {
      case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
        return getTilleggsOpplysningerPasientDocument(values);
      case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
        return getLegeerklaringDocument(values);
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
        throw new Error("use getPaminnelseDocument");
      case MeldingType.HENVENDELSE_RETUR_LEGEERKLARING:
        throw new Error("use getReturLegeerklaringDocument");
      case MeldingType.HENVENDELSE_MELDING_FRA_NAV:
        return meldingFraNavDocument(values);
      case MeldingType.HENVENDELSE_MELDING_TIL_NAV:
        throw new Error("not supported");
      case undefined:
        return [];
    }
  };

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

  const getReturLegeerklaringDocument = (begrunnelse: string | undefined) => {
    return [
      createHeaderH1(returLegeerklaringTexts.header),
      createParagraph(`Gjelder ${navBruker.navn}, ${personident}.`),
      createParagraph(returLegeerklaringTexts.intro.part1),
      createParagraph(returLegeerklaringTexts.intro.part2),
      createParagraph(begrunnelse || "(Obligatorisk begrunnelse)"),
      createParagraph(returLegeerklaringTexts.outro.part1),
      createParagraph(returLegeerklaringTexts.outro.part2),
      getHilsen(),
    ];
  };

  const getLegeerklaringDocument = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1(legeerklaringTexts.header),
      createParagraph(`Gjelder pasient: ${navBruker.navn}, ${personident}.`),
      createParagraph(legeerklaringTexts.opplysninger),
      createParagraph(legeerklaringTexts.takst),
    ];

    if (values.meldingTekst) {
      documentComponents.push(createParagraph(values.meldingTekst));
    }

    documentComponents.push(
      createParagraphWithTitle(
        legeerklaringTexts.lovhjemmel.title,
        legeerklaringTexts.lovhjemmel.text
      ),
      createParagraph(legeerklaringTexts.klage1),
      createParagraph(legeerklaringTexts.klage2),
      getHilsen()
    );

    return documentComponents;
  };

  const meldingFraNavDocument = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1(meldingFraNAVTexts.header),
      createParagraph(`Gjelder pasient: ${navBruker.navn}, ${personident}.`),
    ];
    if (values.meldingTekst) {
      documentComponents.push(createParagraph(values.meldingTekst));
    }
    documentComponents.push(getHilsen());

    return documentComponents;
  };

  return {
    getPaminnelseDocument,
    getMeldingTilBehandlerDocument,
    getReturLegeerklaringDocument,
  };
};

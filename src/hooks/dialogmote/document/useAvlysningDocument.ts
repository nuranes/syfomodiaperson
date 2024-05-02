import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { AvlysDialogmoteSkjemaValues } from "@/sider/dialogmoter/components/avlys/AvlysDialogmoteSkjema";
import {
  getAvlysningTexts,
  getCommonTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  createHeaderH1,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useMalform } from "@/context/malform/MalformContext";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export interface IAvlysningDocument {
  getAvlysningDocumentArbeidstaker(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  getAvlysningDocumentArbeidsgiver(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  getAvlysningDocumentBehandler(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];
}

export const useAvlysningDocument = (
  dialogmote: DialogmoteDTO
): IAvlysningDocument => {
  const { malform } = useMalform();
  const avlysningTexts = getAvlysningTexts(malform);
  const commonTexts = getCommonTexts(malform);
  const navBruker = useNavBrukerData();
  const valgtPersonident = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();

  const { getIntroHei, getVirksomhetsnavn } = useDialogmoteDocumentComponents();

  const sendt = createParagraph(
    `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
  );

  // TODO: Alle disse gjelder-paragraphene kan byttes ut når aktivitetskravet også er på nynorsk. Da kan vi lage en felles gjelder-intro igjen basert på målform
  const gjelderParagraph = createParagraph(
    `${commonTexts.gjelder} ${navBruker.navn}, f.nr. ${valgtPersonident}`
  );
  // TODO: Samme her
  const hilsenParagraph = createParagraph(
    commonTexts.hilsen,
    veilederinfo?.fulltNavn() || "",
    `NAV`
  );

  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      dialogmote.tid
    )}. ${avlysningTexts.intro2}`
  );

  const getAvlysningDocument = (
    introHilsen: DocumentComponentDto,
    begrunnelse?: string
  ) => {
    const documentComponents = [
      createHeaderH1(avlysningTexts.header),
      sendt,
      introHilsen,
      introText,
    ];
    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    const virksomhetsnavn = getVirksomhetsnavn(
      dialogmote.arbeidsgiver.virksomhetsnummer
    );
    if (virksomhetsnavn) {
      documentComponents.push(virksomhetsnavn);
    }

    documentComponents.push(hilsenParagraph);

    return documentComponents;
  };

  return {
    getAvlysningDocumentArbeidstaker: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(getIntroHei(), values.begrunnelseArbeidstaker),
    getAvlysningDocumentArbeidsgiver: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(gjelderParagraph, values.begrunnelseArbeidsgiver),
    getAvlysningDocumentBehandler: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(gjelderParagraph, values.begrunnelseBehandler),
  };
};

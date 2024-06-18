import { DialogmoteInnkallingSkjemaValues } from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingSkjema";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  getCommonTexts,
  getInnkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Malform, useMalform } from "@/context/malform/MalformContext";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export interface IInnkallingDocument {
  getInnkallingDocumentArbeidstaker(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ): DocumentComponentDto[];

  getInnkallingDocumentArbeidsgiver(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ): DocumentComponentDto[];

  getInnkallingDocumentBehandler(
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DocumentComponentDto[];
}

export const useInnkallingDocument = (): IInnkallingDocument => {
  const introComponents = [
    createHeaderH1("Innkalling til dialogmøte"),
    createParagraph(
      `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
    ),
  ];
  const { getMoteInfo, getIntroHei } = useDialogmoteDocumentComponents();
  const { malform } = useMalform();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const navBruker = useNavBrukerData();

  const innkallingTexts = getInnkallingTexts(malform);
  const commonTexts = getCommonTexts(malform);
  const valgtPersonident = useValgtPersonident();

  const hilsenParagraph = createParagraph(
    commonTexts.hilsen,
    veilederinfo?.fulltNavn() || "",
    `NAV`
  );
  const gjelderParagraph = createParagraph(
    `${commonTexts.gjelder} ${navBruker.navn}, f.nr. ${valgtPersonident}`
  );

  const getInnkallingDocumentArbeidstaker = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver),
      getIntroHei(),
      ...arbeidstakerIntro(valgtBehandler, malform),
    ];
    if (values.fritekstArbeidstaker) {
      documentComponents.push(createParagraph(values.fritekstArbeidstaker));
    }
    documentComponents.push(
      ...arbeidstakerOutro(valgtBehandler, malform),
      hilsenParagraph
    );

    return documentComponents;
  };

  const getInnkallingDocumentArbeidsgiver = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver),
      gjelderParagraph,
      createParagraph(innkallingTexts.arbeidsgiver.intro1),
    ];
    if (values.fritekstArbeidsgiver) {
      documentComponents.push(createParagraph(values.fritekstArbeidsgiver));
    }
    documentComponents.push(
      ...arbeidsgiverOutro(valgtBehandler, malform),
      hilsenParagraph,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const getInnkallingDocumentBehandler = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1(innkallingTexts.behandler.header),
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
      createParagraph(innkallingTexts.behandler.intro),
      ...getMoteInfo(values, values.arbeidsgiver),
      gjelderParagraph,
    ];

    if (values.fritekstBehandler) {
      documentComponents.push(createParagraph(values.fritekstBehandler));
    }
    documentComponents.push(
      createParagraph(innkallingTexts.behandler.outro),
      hilsenParagraph
    );

    return documentComponents;
  };

  return {
    getInnkallingDocumentArbeidstaker,
    getInnkallingDocumentArbeidsgiver,
    getInnkallingDocumentBehandler,
  };
};

const arbeidstakerIntro = (
  valgtBehandler: BehandlerDTO | undefined,
  malform: Malform
): DocumentComponentDto[] => {
  const innkallingTexts = getInnkallingTexts(malform);

  const introParagraph2 = !!valgtBehandler
    ? createParagraph(innkallingTexts.arbeidstaker.intro2WithBehandler)
    : createParagraph(innkallingTexts.arbeidstaker.intro2);

  return [
    createParagraph(innkallingTexts.arbeidstaker.intro1),
    introParagraph2,
  ];
};

export const addBehandlerTypeAndName = (
  preText: string,
  valgtBehandler: BehandlerDTO
) => {
  return `${preText} ${behandlerNavn(valgtBehandler)}.`;
};

const arbeidstakerOutro = (
  valgtBehandler: BehandlerDTO | undefined,
  malform: Malform
): DocumentComponentDto[] => {
  const innkallingTexts = getInnkallingTexts(malform);

  const outro1 = valgtBehandler
    ? addBehandlerTypeAndName(
        innkallingTexts.arbeidstaker.outro1WithBehandler,
        valgtBehandler
      )
    : innkallingTexts.arbeidstaker.outro1;
  const outro2 = valgtBehandler
    ? innkallingTexts.arbeidstaker.outro2WithBehandler
    : innkallingTexts.arbeidstaker.outro2;

  return [
    createParagraph(innkallingTexts.arbeidstaker.outroObligatorisk),
    createParagraph(outro1),
    createParagraphWithTitle(innkallingTexts.arbeidstaker.outro2Title, outro2),
  ];
};

const arbeidsgiverOutro = (
  valgtBehandler: BehandlerDTO | undefined,
  malform: Malform
): DocumentComponentDto[] => {
  const innkallingTexts = getInnkallingTexts(malform);
  const outro1 = valgtBehandler
    ? addBehandlerTypeAndName(
        innkallingTexts.arbeidsgiver.outro1WithBehandler,
        valgtBehandler
      )
    : innkallingTexts.arbeidsgiver.outro1;
  const outro2 = valgtBehandler
    ? innkallingTexts.arbeidsgiver.outro2WithBehandler
    : innkallingTexts.arbeidsgiver.outro2;

  return [
    createParagraph(innkallingTexts.arbeidsgiver.outroObligatorisk),
    createParagraph(outro1),
    createParagraphWithTitle(innkallingTexts.arbeidsgiver.outro2Title, outro2),
  ];
};

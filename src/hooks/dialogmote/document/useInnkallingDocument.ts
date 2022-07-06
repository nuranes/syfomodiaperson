import { DialogmoteInnkallingSkjemaValues } from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  commonTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useDocumentComponents } from "@/hooks/dialogmote/document/useDocumentComponents";

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
  const { getHilsen, getMoteInfo, getIntroHei, getIntroGjelder } =
    useDocumentComponents();

  const getInnkallingDocumentArbeidstaker = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver),
      getIntroHei(),
      ...arbeidstakerIntro(valgtBehandler),
    ];
    if (values.fritekstArbeidstaker) {
      documentComponents.push(createParagraph(values.fritekstArbeidstaker));
    }
    documentComponents.push(...arbeidstakerOutro(valgtBehandler), getHilsen());

    return documentComponents;
  };

  const getInnkallingDocumentArbeidsgiver = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver),
      getIntroGjelder(),
      createParagraph(innkallingTexts.arbeidsgiver.intro1),
    ];
    if (values.fritekstArbeidsgiver) {
      documentComponents.push(createParagraph(values.fritekstArbeidsgiver));
    }
    documentComponents.push(
      ...arbeidsgiverOutro(valgtBehandler),
      getHilsen(),
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
      createHeaderH1("Innkalling til dialogmøte, svar ønskes"),
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
      createParagraph(innkallingTexts.behandler.intro),
      ...getMoteInfo(values, values.arbeidsgiver),
      getIntroGjelder(),
    ];

    if (values.fritekstBehandler) {
      documentComponents.push(createParagraph(values.fritekstBehandler));
    }
    documentComponents.push(
      createParagraph(innkallingTexts.behandler.outro),
      getHilsen()
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
  valgtBehandler: BehandlerDTO | undefined
): DocumentComponentDto[] => {
  const introParagraph2 = !!valgtBehandler
    ? createParagraph(innkallingTexts.arbeidstaker.intro2WithBehandler)
    : createParagraph(innkallingTexts.arbeidstaker.intro2);

  return [
    createParagraph(innkallingTexts.arbeidstaker.intro1),
    introParagraph2,
  ];
};

const addBehandlerTypeAndName = (
  preText: string,
  valgtBehandler: BehandlerDTO
) => {
  return `${preText} ${capitalizeWord(valgtBehandler.type)} ${behandlerNavn(
    valgtBehandler
  )}.`;
};

const arbeidstakerOutro = (
  valgtBehandler: BehandlerDTO | undefined
): DocumentComponentDto[] => {
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
  valgtBehandler: BehandlerDTO | undefined
): DocumentComponentDto[] => {
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

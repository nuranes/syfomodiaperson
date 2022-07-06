import { EndreTidStedSkjemaValues } from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  commonTexts,
  endreTidStedTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { behandlerDeltakerTekst } from "@/utils/behandlerUtils";
import { useDocumentComponents } from "@/hooks/dialogmote/document/useDocumentComponents";

export interface ITidStedDocument {
  getTidStedDocumentArbeidsgiver(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];

  getTidStedDocumentArbeidstaker(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];

  getTidStedDocumentBehandler(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];
}

export const useTidStedDocument = (
  dialogmote: DialogmoteDTO
): ITidStedDocument => {
  const { tid, arbeidsgiver, behandler } = dialogmote;

  const { getHilsen, getMoteInfo, getIntroHei, getIntroGjelder } =
    useDocumentComponents();

  const sendtDato = createParagraph(
    `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
  );
  const introComponents = [
    createParagraph(
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        tid
      )}.`
    ),
    createParagraph(endreTidStedTexts.intro2),
  ];

  const getTidStedDocumentArbeidsgiver = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1("Endret dialogmøte"),
      sendtDato,
      getIntroGjelder(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    const outro1 = behandler
      ? endreTidStedTexts.arbeidsgiver.outro1WithBehandler
      : endreTidStedTexts.arbeidsgiver.outro1;
    const outro2 = behandler
      ? addBehandlerTypeAndName(
          endreTidStedTexts.arbeidsgiver.outro2WithBehandler,
          behandler
        )
      : endreTidStedTexts.arbeidsgiver.outro2;
    const outro3 = behandler
      ? endreTidStedTexts.arbeidsgiver.outro3WithBehandler
      : endreTidStedTexts.arbeidsgiver.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreTidStedTexts.arbeidsgiver.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreTidStedTexts.arbeidsgiver.outro3Title,
        outro3
      ),
      getHilsen(),
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const getTidStedDocumentArbeidstaker = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1("Endret dialogmøte"),
      sendtDato,
      getIntroHei(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    const outro1 = behandler
      ? endreTidStedTexts.arbeidstaker.outro1WithBehandler
      : endreTidStedTexts.arbeidstaker.outro1;
    const outro2 = behandler
      ? addBehandlerTypeAndName(
          endreTidStedTexts.arbeidstaker.outro2WithBehandler,
          behandler
        )
      : endreTidStedTexts.arbeidstaker.outro2;
    const outro3 = behandler
      ? endreTidStedTexts.arbeidstaker.outro3WithBehandler
      : endreTidStedTexts.arbeidstaker.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreTidStedTexts.arbeidstaker.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreTidStedTexts.arbeidstaker.outro3Title,
        outro3
      ),
      getHilsen()
    );

    return documentComponents;
  };

  const getTidStedDocumentBehandler = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1("Endret dialogmøte, svar ønskes"),
      createParagraph(endreTidStedTexts.behandler.intro),
      sendtDato,
      getIntroGjelder(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];
    if (values.begrunnelseBehandler) {
      documentComponents.push(createParagraph(values.begrunnelseBehandler));
    }

    documentComponents.push(
      createParagraph(endreTidStedTexts.behandler.outro),
      getHilsen()
    );

    return documentComponents;
  };

  return {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  };
};

const addBehandlerTypeAndName = (
  preText: string,
  behandler: DialogmotedeltakerBehandlerDTO
) => {
  return `${behandlerDeltakerTekst(preText, behandler)}.`;
};

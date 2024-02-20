import { EndreTidStedSkjemaValues } from "@/sider/mote/components/endre/EndreDialogmoteSkjema";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  getCommonTexts,
  getEndreTidStedTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useMalform } from "@/context/malform/MalformContext";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

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
  const { malform } = useMalform();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const endreTidStedTexts = getEndreTidStedTexts(malform);
  const commonTexts = getCommonTexts(malform);
  const valgtPersonident = useValgtPersonident();
  const navBruker = useNavBrukerData();
  const hilsenParagraph = createParagraph(
    commonTexts.hilsen,
    veilederinfo?.navn || "",
    `NAV`
  );

  const { getMoteInfo, getIntroHei } = useDialogmoteDocumentComponents();

  const gjelderParagraph = createParagraph(
    `${commonTexts.gjelder} ${navBruker.navn}, f.nr. ${valgtPersonident}`
  );

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
      createHeaderH1(endreTidStedTexts.header),
      sendtDato,
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer, malform),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    const outro1 = behandler
      ? endreTidStedTexts.arbeidsgiver.outro1WithBehandler
      : endreTidStedTexts.arbeidsgiver.outro1;
    const outro2 = behandler
      ? `${endreTidStedTexts.arbeidsgiver.outro2WithBehandler} ${behandler.behandlerNavn}.`
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
      hilsenParagraph,
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
      createHeaderH1(endreTidStedTexts.header),
      sendtDato,
      getIntroHei(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer, malform),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    const outro1 = behandler
      ? endreTidStedTexts.arbeidstaker.outro1WithBehandler
      : endreTidStedTexts.arbeidstaker.outro1;
    const outro2 = behandler
      ? `${endreTidStedTexts.arbeidstaker.outro2WithBehandler} ${behandler.behandlerNavn}.`
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
      hilsenParagraph
    );

    return documentComponents;
  };

  const getTidStedDocumentBehandler = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1(endreTidStedTexts.behandler.endring),
      createParagraph(endreTidStedTexts.behandler.intro),
      sendtDato,
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer, malform),
    ];
    if (values.begrunnelseBehandler) {
      documentComponents.push(createParagraph(values.begrunnelseBehandler));
    }

    documentComponents.push(
      createParagraph(endreTidStedTexts.behandler.outro),
      hilsenParagraph
    );

    return documentComponents;
  };

  return {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  };
};

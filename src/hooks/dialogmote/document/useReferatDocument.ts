import {
  ReferatMode,
  ReferatSkjemaValues,
} from "@/components/dialogmote/referat/Referat";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import {
  createHeaderH1,
  createHeaderH2,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import {
  getCommonTexts,
  getReferatTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { useMalform } from "@/context/malform/MalformContext";

export interface IReferatDocument {
  getReferatDocument(
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[];
}

export const useReferatDocument = (
  dialogmote: DialogmoteDTO,
  mode: ReferatMode
): IReferatDocument => {
  const navbruker = useNavBrukerData();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const isEndringAvReferat = mode === ReferatMode.ENDRET;
  const { getVirksomhetsnavn } = useDialogmoteDocumentComponents();
  const { malform } = useMalform();
  const referatTexts = getReferatTexts(malform);
  const commonTexts = getCommonTexts(malform);
  const hilsenParagraph = createParagraph(
    commonTexts.hilsen,
    veilederinfo?.navn || "",
    `NAV`
  );
  const personident = useValgtPersonident();

  const intro = (): DocumentComponentDto[] => {
    return [
      createParagraph(referatTexts.intro1),
      createParagraph(referatTexts.intro2),
    ];
  };

  const info = (
    dialogmote: DialogmoteDTO,
    values: Partial<ReferatSkjemaValues>,
    navbruker: BrukerinfoDTO,
    personident: string,
    veileder?: VeilederinfoDTO
  ): DocumentComponentDto[] => {
    const deltakereTekst = [
      `${referatTexts.deltakere.arbeidstaker}: ${navbruker.navn}`,
      `${referatTexts.deltakere.nav}: ${veileder?.navn}`,
      `${referatTexts.deltakere.arbeidsgiver}: ${values.naermesteLeder}`,
    ];
    if (dialogmote.behandler) {
      deltakereTekst.push(
        `${referatTexts.deltakere.behandler}: ${
          dialogmote.behandler.behandlerNavn
        }${
          values.behandlerDeltatt === false
            ? `, ${referatTexts.deltakere.deltakelse}`
            : ""
        }`
      );
    }
    const andreDeltakereTekst =
      values.andreDeltakere?.map(
        ({ funksjon, navn }) => `${funksjon}: ${navn}`
      ) || [];

    return [
      createParagraph(`F.nr. ${personident}`),
      createParagraphWithTitle(
        commonTexts.moteTidTitle,
        tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid, malform)
      ),
      createParagraphWithTitle(commonTexts.moteStedTitle, dialogmote.sted),
      createParagraphWithTitle(
        referatTexts.deltakereTitle,
        ...deltakereTekst,
        ...andreDeltakereTekst
      ),
    ];
  };

  const fritekster = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [
      createHeaderH2(referatTexts.detteSkjeddeHeader),
      createParagraphWithTitle(
        referatTexts.konklusjonTitle,
        values.konklusjon || ""
      ),
      createParagraphWithTitle(
        referatTexts.arbeidstakersOppgaveTitle,
        values.arbeidstakersOppgave || ""
      ),
      createParagraphWithTitle(
        referatTexts.arbeidsgiversOppgaveTitle,
        values.arbeidsgiversOppgave || ""
      ),
    ];
    if (values.behandlersOppgave) {
      documentComponents.push(
        createParagraphWithTitle(
          referatTexts.behandlersOppgave,
          values.behandlersOppgave
        )
      );
    }
    if (values.veiledersOppgave) {
      documentComponents.push(
        createParagraphWithTitle(
          referatTexts.navOppgaveTitle,
          values.veiledersOppgave
        )
      );
    }
    documentComponents.push(
      createParagraphWithTitle(
        referatTexts.situasjonTitle,
        values.situasjon || ""
      )
    );

    return documentComponents;
  };

  const standardTekster = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents: DocumentComponentDto[] = [];
    if (values.standardtekster && values.standardtekster.length > 0) {
      documentComponents.push(
        createHeaderH2(referatTexts.standardTeksterHeader),
        ...values.standardtekster.map((standardtekst) => ({
          type: DocumentComponentType.PARAGRAPH,
          key: standardtekst.key,
          title: standardtekst.label,
          texts: [standardtekst.text],
        }))
      );
    }
    return documentComponents;
  };

  const getReferatDocument = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [
      createHeaderH1(
        isEndringAvReferat ? referatTexts.endretHeader : referatTexts.nyttHeader
      ),
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
    ];

    if (isEndringAvReferat) {
      documentComponents.push(
        createParagraph(referatTexts.endring),
        createParagraphWithTitle(
          referatTexts.begrunnelseEndringTitle,
          values.begrunnelseEndring || ""
        )
      );
    }

    documentComponents.push(
      createHeaderH2(navbruker?.navn),
      ...info(dialogmote, values, navbruker, personident, veilederinfo)
    );

    const virksomhetsnavn = getVirksomhetsnavn(
      dialogmote.arbeidsgiver.virksomhetsnummer
    );
    if (virksomhetsnavn) {
      documentComponents.push(virksomhetsnavn);
    }

    documentComponents.push(
      ...intro(),
      ...fritekster(values),
      ...standardTekster(values),
      hilsenParagraph
    );

    return documentComponents;
  };

  return {
    getReferatDocument,
  };
};

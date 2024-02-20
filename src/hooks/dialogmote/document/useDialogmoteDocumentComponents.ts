import {
  createLink,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { getCommonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { genererDato } from "@/sider/mote/utils";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import { Malform } from "@/context/malform/MalformContext";

export const useDialogmoteDocumentComponents = () => {
  const { getHilsen, getIntroGjelder, getIntroHei } = useDocumentComponents();
  const { getCurrentNarmesteLeder } = useLedereQuery();

  const getVirksomhetsnavn = (
    virksomhetsnummer: string | undefined,
    malform?: Malform
  ): DocumentComponentDto | undefined => {
    const arbeidsgiver =
      virksomhetsnummer &&
      getCurrentNarmesteLeder(virksomhetsnummer)?.virksomhetsnavn;

    const commonTexts = getCommonTexts(malform ? malform : Malform.BOKMAL);

    return arbeidsgiver
      ? createParagraphWithTitle(commonTexts.arbeidsgiverTitle, arbeidsgiver)
      : undefined;
  };

  const getMoteInfo = (
    values: Partial<TidStedSkjemaValues>,
    virksomhetsnummer: string | undefined,
    malform?: Malform // TODO: Fjern når alle tekster bruker målform og ta inn i hooken
  ) => {
    const { dato, klokkeslett, sted, videoLink } = values;
    const commonTexts = getCommonTexts(malform ? malform : Malform.BOKMAL);
    const tidStedTekst =
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett),
            malform
          )
        : "";
    const components: DocumentComponentDto[] = [];
    components.push(
      createParagraphWithTitle(commonTexts.moteTidTitle, tidStedTekst)
    );
    components.push(
      createParagraphWithTitle(commonTexts.moteStedTitle, sted || "")
    );
    if (videoLink) {
      components.push(createLink(commonTexts.videoLinkTitle, videoLink));
    }

    const virksomhetsnavn = getVirksomhetsnavn(virksomhetsnummer, malform);
    if (virksomhetsnavn) {
      components.push(virksomhetsnavn);
    }

    return components;
  };

  return {
    getHilsen,
    getVirksomhetsnavn,
    getMoteInfo,
    getIntroHei,
    getIntroGjelder,
  };
};

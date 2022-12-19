import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  createLink,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { commonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { genererDato } from "@/components/mote/utils";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useDocumentComponents = () => {
  const navBruker = useNavBrukerData();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const { getCurrentNarmesteLeder } = useLedereQuery();

  const getVirksomhetsnavn = (
    virksomhetsnummer: string | undefined
  ): DocumentComponentDto | undefined => {
    const arbeidsgiver =
      virksomhetsnummer &&
      getCurrentNarmesteLeder(virksomhetsnummer)?.virksomhetsnavn;

    return arbeidsgiver
      ? createParagraphWithTitle(commonTexts.arbeidsgiverTitle, arbeidsgiver)
      : undefined;
  };

  const getMoteInfo = (
    values: Partial<TidStedSkjemaValues>,
    virksomhetsnummer: string | undefined
  ) => {
    const { dato, klokkeslett, sted, videoLink } = values;
    const tidStedTekst =
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett)
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

    const virksomhetsnavn = getVirksomhetsnavn(virksomhetsnummer);
    if (virksomhetsnavn) {
      components.push(virksomhetsnavn);
    }

    return components;
  };

  const personident = useValgtPersonident();

  return {
    getHilsen: () =>
      createParagraph(commonTexts.hilsen, veilederinfo?.navn || "", "NAV"),
    getVirksomhetsnavn,
    getMoteInfo,
    getIntroHei: () => createParagraph(`Hei, ${navBruker.navn}`),
    getIntroGjelder: () =>
      createParagraph(`Gjelder ${navBruker.navn}, f.nr. ${personident}`),
  };
};

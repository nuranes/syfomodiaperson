import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { ReferatSkjemaValues } from "@/sider/dialogmoter/components/referat/Referat";
import { getReferatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useMemo } from "react";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { useMalform } from "@/context/malform/MalformContext";

export const useInitialValuesReferat = (
  dialogmote: DialogmoteDTO
): Partial<ReferatSkjemaValues> => {
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const { malform } = useMalform();
  const {
    arbeidsgiver: { virksomhetsnummer },
    behandler,
  } = dialogmote;
  const { latestReferat } = useDialogmoteReferat(dialogmote);
  const currentNarmesteLederNavn =
    getCurrentNarmesteLeder(virksomhetsnummer)?.narmesteLederNavn;

  return useMemo(() => {
    const behandlerInitialValues = behandler
      ? {
          behandlerDeltatt: behandler.deltatt,
          behandlerMottarReferat: behandler.mottarReferat,
        }
      : {};
    if (latestReferat) {
      return {
        naermesteLeder: latestReferat.narmesteLederNavn,
        konklusjon: latestReferat.konklusjon,
        situasjon: latestReferat.situasjon,
        arbeidstakersOppgave: latestReferat.arbeidstakerOppgave,
        arbeidsgiversOppgave: latestReferat.arbeidsgiverOppgave,
        veiledersOppgave: latestReferat.veilederOppgave,
        behandlersOppgave: latestReferat.behandlerOppgave,
        ...(latestReferat.begrunnelseEndring
          ? { begrunnelseEndring: latestReferat.begrunnelseEndring }
          : {}),
        andreDeltakere: latestReferat.andreDeltakere.map(
          ({ navn, funksjon }) => ({
            navn,
            funksjon,
          })
        ),
        standardtekster: getReferatTexts(malform).standardTekster.filter(
          (standardtekst) =>
            latestReferat.document.some(({ key }) => key === standardtekst.key)
        ),
        ...behandlerInitialValues,
      };
    } else {
      return {
        naermesteLeder: currentNarmesteLederNavn,
        ...behandlerInitialValues,
      };
    }
  }, [behandler, latestReferat, malform, currentNarmesteLederNavn]);
};

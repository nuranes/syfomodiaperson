import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import {
  erMotebehovBehandlet,
  harUbehandletMotebehov,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useBehandleMotebehov } from "@/data/motebehov/useBehandleMotebehov";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
};

const behandleMotebehovKnappLabel = (
  erBehandlet: boolean,
  sistBehandletMotebehov?: MotebehovVeilederDTO
): string => {
  return erBehandlet
    ? `Ferdigbehandlet av ${
        sistBehandletMotebehov?.behandletVeilederIdent
      } ${toDatePrettyPrint(sistBehandletMotebehov?.behandletTidspunkt)}`
    : texts.fjernOppgave;
};

interface BehandleMotebehovKnappProps {
  motebehovData: MotebehovVeilederDTO[];
}

const BehandleMotebehovKnapp = ({
  motebehovData,
}: BehandleMotebehovKnappProps) => {
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const erBehandlet = erMotebehovBehandlet(motebehovListe);
  const behandleMotebehov = useBehandleMotebehov();

  return motebehovListe.length > 0 ? (
    <div className="panel behandleMotebehovKnapp">
      <div className="skjema__input">
        <Checkbox
          label={behandleMotebehovKnappLabel(
            erBehandlet,
            sistBehandletMotebehov
          )}
          onClick={() => {
            if (harUbehandletMotebehov(motebehovListe)) {
              behandleMotebehov.mutate();
            }
          }}
          id="marker__utfoert"
          disabled={erBehandlet || behandleMotebehov.isLoading}
          defaultChecked={erBehandlet}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default BehandleMotebehovKnapp;

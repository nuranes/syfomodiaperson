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
import navFarger from "nav-frontend-core";
import { Panel } from "@navikt/ds-react";
import styled from "styled-components";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
};

const CheckboxPanel = styled(Panel)`
  border: 1px solid ${navFarger.navGra20};
`;

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
    <CheckboxPanel>
      <Checkbox
        label={behandleMotebehovKnappLabel(erBehandlet, sistBehandletMotebehov)}
        onClick={() => {
          if (harUbehandletMotebehov(motebehovListe)) {
            behandleMotebehov.mutate();
          }
        }}
        id="marker__utfoert"
        disabled={erBehandlet || behandleMotebehov.isLoading}
        defaultChecked={erBehandlet}
      />
    </CheckboxPanel>
  ) : (
    <></>
  );
};

export default BehandleMotebehovKnapp;

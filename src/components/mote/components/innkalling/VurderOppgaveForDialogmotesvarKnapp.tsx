import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";

const texts = {
  fjernOppgave:
    "Jeg har vurdert ønsker om endring eller avlysning, men vil beholde møtet som det er.",
};

const vurderOppgaveForInnkallingLabel = (
  isBehandlet: boolean,
  personOppgave: PersonOppgave
): string => {
  return isBehandlet
    ? `Ferdigbehandlet av ${
        personOppgave.behandletVeilederIdent
      } ${toDatePrettyPrint(personOppgave.behandletTidspunkt)}`
    : texts.fjernOppgave;
};

interface VurderTilbakemeldingPaInnkallingKnappProps {
  personOppgave: PersonOppgave;
}

const VurderOppgaveForDialogmotesvarKnapp = ({
  personOppgave,
}: VurderTilbakemeldingPaInnkallingKnappProps) => {
  const isBehandlet = isBehandletOppgave(personOppgave);
  const behandlePersonOppgave = useBehandlePersonoppgave();

  return (
    <div className="panel vurderBehovKnapp">
      <div className="skjema__input">
        <Checkbox
          label={vurderOppgaveForInnkallingLabel(isBehandlet, personOppgave)}
          onClick={() => {
            behandlePersonOppgave.mutate(personOppgave.uuid);
          }}
          disabled={isBehandlet || behandlePersonOppgave.isLoading}
          defaultChecked={isBehandlet}
        />
      </div>
    </div>
  );
};

export default VurderOppgaveForDialogmotesvarKnapp;

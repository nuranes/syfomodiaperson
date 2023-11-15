import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../Statuspanel";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";
import VerktoylinjeGjenapne from "@/components/speiling/sykepengsoknader/soknad-felles/VerktoylinjeGjenapneSoknad";

const texts = {
  tittel: "Dato avbrutt",
  status: "Status\n",
  avbrutt: "Avbrutt av deg\n",
};

interface AvbruttSoknadSelvstendigStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadSelvstendigStatuspanel = ({
  soknad,
}: AvbruttSoknadSelvstendigStatuspanelProps): ReactElement => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.tittel}>
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
      {erOpprettetSisteAar(soknad) && <VerktoylinjeGjenapne />}
    </Statuspanel>
  );
};

export default AvbruttSoknadSelvstendigStatuspanel;

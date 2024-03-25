import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import VerktoylinjeGjenapne from "../soknad-felles/VerktoylinjeGjenapneSoknad";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";
import { Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger",
  avbrutt: "Avbrutt av deg",
  avbruttTittel: "Dato avbrutt",
  status: "Status",
};

interface AvbruttSoknadArbeidstakerStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadArbeidstakerStatuspanel = ({
  soknad,
}: AvbruttSoknadArbeidstakerStatuspanelProps) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.avbruttTittel}>
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
      {erOpprettetSisteAar(soknad) && <VerktoylinjeGjenapne />}
    </Statuspanel>
  );
};

interface AvbruttSoknadArbeidstakerProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadArbeidstaker = ({
  soknad,
}: AvbruttSoknadArbeidstakerProps): ReactElement => {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <AvbruttSoknadArbeidstakerStatuspanel soknad={soknad} />
      <SykmeldingUtdragContainer soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
};

export default AvbruttSoknadArbeidstaker;

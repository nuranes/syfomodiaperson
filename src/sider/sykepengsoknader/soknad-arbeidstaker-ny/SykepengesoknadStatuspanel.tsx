import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import Sykepengetekst from "../../../utils/soknad-felles/Sykepengetekst";
import {
  VerktoyKnapp,
  Verktoylinje,
} from "../../../components/speiling/Verktoylinje";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";

const texts = {
  status: "Status",
  tittel: "Utbetaling av sykepenger",
  endre: "Endre søknad",
};

interface StatusOgSykepengeopplysningerProps {
  soknad: SykepengesoknadDTO;
}

const StatusOgSykepengeopplysninger = (
  statusOgSykepengeopplysningerProps: StatusOgSykepengeopplysningerProps
) => {
  const { soknad } = statusOgSykepengeopplysningerProps;
  return (
    <Statusopplysninger>
      <StatusNokkelopplysning tittel={texts.status}>
        <SoknadStatustekst soknad={soknad} />
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel={texts.tittel}>
        <Sykepengetekst soknad={soknad} />
      </StatusNokkelopplysning>
    </Statusopplysninger>
  );
};

interface SykepengesoknadStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadStatuspanel = ({
  soknad,
}: SykepengesoknadStatuspanelProps): ReactElement => {
  const visEndreknapp =
    erOpprettetSisteAar(soknad) && soknad.status === Soknadstatus.SENDT;

  return (
    <Statuspanel enKolonne>
      <StatusOgSykepengeopplysninger soknad={soknad} />
      {visEndreknapp && (
        <Verktoylinje>
          <VerktoyKnapp>{texts.endre}</VerktoyKnapp>
        </Verktoylinje>
      )}
    </Statuspanel>
  );
};

export default SykepengesoknadStatuspanel;

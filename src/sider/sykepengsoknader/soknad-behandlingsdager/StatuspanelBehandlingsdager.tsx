import React, { ReactElement } from "react";
import { StatusNokkelopplysning } from "../../../components/speiling/Statuspanel";
import Sykepengetekst from "../../../utils/soknad-felles/Sykepengetekst";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";

const texts = {
  sendt: "Sendt til NAV",
  sender: "Sender til NAV",
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  utbetaling: "Utbetaling av sykepenger",
  status: "Status",
};

interface StatuspanelBehandlingsdagerProps {
  soknad: SykepengesoknadDTO;
}

const StatuspanelBehandlingsdager = ({
  soknad,
}: StatuspanelBehandlingsdagerProps): ReactElement => {
  return (
    <div>
      <StatusNokkelopplysning tittel={texts.status}>
        <SoknadStatustekst soknad={soknad} />
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel={texts.utbetaling}>
        <Sykepengetekst soknad={soknad} />
      </StatusNokkelopplysning>
    </div>
  );
};

export default StatuspanelBehandlingsdager;

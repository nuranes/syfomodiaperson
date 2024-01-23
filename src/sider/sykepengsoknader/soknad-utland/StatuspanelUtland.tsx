import React, { ReactElement } from "react";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";

const texts = {
  sendt: "Sendt til NAV",
  sender: "Sender til NAV",
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  dato: "Dato",
  status: "Status",
};

const { SENDT, TIL_SENDING } = Soknadstatus;

const getStatusTekst = (soknad: SykepengesoknadDTO) => {
  switch (soknad.status) {
    case SENDT: {
      return texts.sendt;
    }
    case TIL_SENDING: {
      return texts.sender;
    }
    default: {
      return "Ukjent status";
    }
  }
};

interface SendtDatoProps {
  soknad: SykepengesoknadDTO;
}

const SendtDato = (sendtDatoProps: SendtDatoProps) => {
  const { soknad } = sendtDatoProps;
  return (
    <StatusNokkelopplysning tittel={texts.dato}>
      <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
    </StatusNokkelopplysning>
  );
};

interface StatuspanelUtlandProps {
  soknad: SykepengesoknadDTO;
}

const StatuspanelUtland = (
  statuspanelUtlandProps: StatuspanelUtlandProps
): ReactElement => {
  const { soknad } = statuspanelUtlandProps;
  const tekst = getStatusTekst(soknad);
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          {soknad.status === TIL_SENDING ? (
            <div>
              <span>{tekst}</span>
              <Hjelpetekst>{texts.hjelpetekst}</Hjelpetekst>
            </div>
          ) : (
            <p>{tekst}</p>
          )}
        </StatusNokkelopplysning>
        <SendtDato soknad={soknad} />
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default StatuspanelUtland;

import React, { ReactElement } from "react";
import {
  Sykmeldingstatus,
  SendtDato,
  Arbeidsgiver,
  Orgnummer,
} from "./SykmeldingStatuspanelOpplysning";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";

interface NokkelopplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

export const Nokkelopplysninger = ({
  sykmelding,
}: NokkelopplysningerProps): ReactElement | null => {
  switch (sykmelding.status) {
    case SykmeldingStatus.SENDT:
    case SykmeldingStatus.TIL_SENDING: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
          <Arbeidsgiver sykmelding={sykmelding} />
          <Orgnummer sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    case SykmeldingStatus.AVBRUTT: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    case SykmeldingStatus.UTGAATT: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    default: {
      return null;
    }
  }
};

interface SykmeldingStatuspanelProps {
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingStatuspanel = ({
  sykmelding,
}: SykmeldingStatuspanelProps): ReactElement => {
  return (
    <Statuspanel>
      <Nokkelopplysninger sykmelding={sykmelding} />
    </Statuspanel>
  );
};

export default SykmeldingStatuspanel;

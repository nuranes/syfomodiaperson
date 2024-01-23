import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../../components/speiling/Statuspanel";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface AvvistSykmeldingStatuspanelProps {
  sykmelding: SykmeldingOldFormat;
}

const AvvistSykmeldingStatuspanel = ({
  sykmelding,
}: AvvistSykmeldingStatuspanelProps): ReactElement => {
  return (
    <div className="statuspanel blokk--xl statuspanel--treKol">
      <Statusopplysninger>
        <StatusNokkelopplysning tittel="Status">
          <p>Avvist av NAV</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Dato avvist">
          <p>{tilLesbarDatoMedArstall(sykmelding.mottattTidspunkt)}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Bekreftet av deg">
          <p>{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
    </div>
  );
};

export default AvvistSykmeldingStatuspanel;

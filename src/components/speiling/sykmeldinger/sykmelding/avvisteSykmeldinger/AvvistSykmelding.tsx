import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import AvvistSykmeldingStatuspanel from "./AvvistSykmeldingStatuspanel";
import { AvvistSykmeldingPanel } from "./AvvistSykmeldingPanel";
import BekreftAvvistSykmelding from "./BekreftAvvistSykmelding";
import DineSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineSykmeldingOpplysninger";

interface AvvistSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const AvvistSykmelding = ({
  sykmelding,
}: AvvistSykmeldingProps): ReactElement => {
  return (
    <>
      {sykmelding.status === SykmeldingStatus.BEKREFTET && (
        <AvvistSykmeldingStatuspanel sykmelding={sykmelding} />
      )}
      <AvvistSykmeldingPanel sykmelding={sykmelding} />
      <div className="blokk">
        <DineSykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
      {sykmelding.status === SykmeldingStatus.NY && <BekreftAvvistSykmelding />}
    </>
  );
};

export default AvvistSykmelding;

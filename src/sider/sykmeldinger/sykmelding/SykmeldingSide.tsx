import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import DinSykmelding from "./DinSykmelding";
import DinSendteSykmelding from "./DinSendteSykmelding";
import DinBekreftedeSykmelding from "./DinBekreftedeSykmelding";
import DinAvbrutteSykmelding from "./DinAvbrutteSykmelding";
import DinUtgaatteSykmelding from "./DinUtgaatteSykmelding";
import Feilmelding from "../../../components/Feilmelding";
import AvvistSykmelding from "./avvisteSykmeldinger/AvvistSykmelding";
import KoronaSykmeldingBekreftet from "./koronasykmeldinger/KoronaSykmelding-Bekreftet";
import KoronaSykmeldingNy from "./koronasykmeldinger/KoronaSykmelding-Ny";
import KoronaSykmeldingAvbrutt from "./koronasykmeldinger/KoronaSykmelding-Avbrutt";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";

interface SykmeldingSideProps {
  dinSykmelding?: SykmeldingOldFormat;
  arbeidsgiversSykmelding?: SykmeldingOldFormat;
}

const SykmeldingSide = ({
  dinSykmelding,
  arbeidsgiversSykmelding,
}: SykmeldingSideProps): ReactElement => {
  return (() => {
    if (!dinSykmelding) {
      return <Feilmelding tittel="Fant ikke sykmelding" />;
    }
    if (
      dinSykmelding.behandlingsutfall.status ===
      BehandlingsutfallStatusDTO.INVALID
    ) {
      return <AvvistSykmelding sykmelding={dinSykmelding} />;
    }
    if (dinSykmelding.egenmeldt) {
      switch (dinSykmelding.status) {
        case SykmeldingStatus.BEKREFTET: {
          return <KoronaSykmeldingBekreftet dinSykmelding={dinSykmelding} />;
        }
        case SykmeldingStatus.NY: {
          return <KoronaSykmeldingNy sykmelding={dinSykmelding} />;
        }
        case SykmeldingStatus.AVBRUTT: {
          return <KoronaSykmeldingAvbrutt sykmelding={dinSykmelding} />;
        }
        default: {
          return <Feilmelding tittel="Egenmeldingen har ukjent status" />;
        }
      }
    } else if (
      dinSykmelding.status === SykmeldingStatus.SENDT &&
      arbeidsgiversSykmelding
    ) {
      return (
        <DinSendteSykmelding
          dinSykmelding={dinSykmelding}
          arbeidsgiversSykmelding={arbeidsgiversSykmelding}
        />
      );
    } else if (
      arbeidsgiversSykmelding &&
      dinSykmelding.status === SykmeldingStatus.BEKREFTET
    ) {
      return (
        <DinBekreftedeSykmelding
          dinSykmelding={dinSykmelding}
          arbeidsgiversSykmelding={arbeidsgiversSykmelding}
        />
      );
    } else if (dinSykmelding.status === SykmeldingStatus.UTGAATT) {
      return <DinUtgaatteSykmelding sykmelding={dinSykmelding} />;
    } else if (dinSykmelding.status === SykmeldingStatus.NY) {
      return <DinSykmelding sykmelding={dinSykmelding} />;
    } else if (dinSykmelding.status === SykmeldingStatus.AVBRUTT) {
      return <DinAvbrutteSykmelding sykmelding={dinSykmelding} />;
    }
    return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
  })();
};

export default SykmeldingSide;

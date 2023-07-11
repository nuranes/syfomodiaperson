import React, { ReactElement } from "react";
import Sidetopp from "../../../Sidetopp";
import SoknadTeasere from "./SoknaderTeasere";
import PlanlagteTeasere from "./PlanlagteTeasere";
import {
  sorterEtterOpprettetDato,
  sorterEtterPerioder,
} from "@/utils/sykepengesoknadUtils";
import {
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  sidetittel: "Søknad om sykepenger",
  nyeSoknader: "Nye søknader",
  ingenSoknader:
    "Du har ingen nye søknader om sykepenger. Den neste søknaden du kan fylle ut kommer etter at sykmeldingsperioden er over.",
  tidligereSoknader: "Tidligere søknader",
};

const {
  SENDT,
  TIL_SENDING,
  UTGAATT,
  NY,
  UTKAST_TIL_KORRIGERING,
  FREMTIDIG,
  AVBRUTT,
} = Soknadstatus;

interface SoknaderProps {
  fnr: string;
  soknader: SykepengesoknadDTO[];
}

const Soknader = (soknaderProps: SoknaderProps): ReactElement => {
  const { soknader = [] } = soknaderProps;
  const alleSoknader = [...soknader];

  const nyeSoknader = alleSoknader
    .filter((soknad) => {
      return (
        (soknad.status === NY || soknad.status === UTKAST_TIL_KORRIGERING) &&
        soknad.soknadstype !== Soknadstype.OPPHOLD_UTLAND
      );
    })
    .sort(sorterEtterOpprettetDato);

  const sendteSoknader = alleSoknader
    .filter((soknad) => {
      return (
        soknad.status === SENDT ||
        soknad.status === TIL_SENDING ||
        soknad.status === UTGAATT ||
        soknad.status === AVBRUTT
      );
    })
    .sort(sorterEtterPerioder);

  const kommendeSoknader = alleSoknader
    .filter((soknad) => {
      return soknad.status === FREMTIDIG;
    })
    .sort(sorterEtterPerioder)
    .reverse();

  return (
    <React.Fragment>
      <Sidetopp tittel={texts.sidetittel} />
      <SoknadTeasere
        sykepengesoknader={nyeSoknader}
        tittel={texts.nyeSoknader}
        tomListeTekst={texts.ingenSoknader}
        className="js-til-behandling"
        id="soknader-list-til-behandling"
      />

      {kommendeSoknader.length > 0 && (
        <PlanlagteTeasere
          sykepengesoknader={kommendeSoknader}
          tittel="Planlagte søknader"
        />
      )}

      {sendteSoknader.length > 0 && (
        <SoknadTeasere
          sykepengesoknader={sendteSoknader}
          tittel={texts.tidligereSoknader}
          tomListeTekst={texts.tidligereSoknader}
          className="js-sendt"
          id="soknader-sendt"
        />
      )}
    </React.Fragment>
  );
};

export default Soknader;

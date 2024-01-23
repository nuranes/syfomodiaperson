import React, { ReactElement } from "react";
import Side from "../../Side";
import Soknader from "../soknader/Soknader";
import Brodsmuler from "../../../components/speiling/Brodsmuler";
import Speilingvarsel from "../../../components/speiling/Speilingvarsel";
import Feilstripe from "../../../components/Feilstripe";
import SideLaster from "../../../components/SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const errorMessageText = (name: string) => {
  return `Beklager – vi kunne ikke hente alle sykepengesøknadene til ${name}`;
};

const SykepengesoknaderSide = (): ReactElement => {
  const fnr = useValgtPersonident();
  const {
    data: sykepengesoknader,
    isError,
    isLoading,
  } = useSykepengesoknaderQuery();

  const brukernavn = useNavBrukerData().navn;
  const brodsmuler = [
    {
      tittel: "Ditt sykefravær",
    },
    {
      tittel: "Søknader om sykepenger",
    },
  ];
  return (
    <Side
      tittel="Sykepengesøknader"
      aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}
    >
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <Feilstripe
            className="blokk--s"
            tekst={errorMessageText(brukernavn)}
            vis={isError}
          />
          <Speilingvarsel brukernavn={brukernavn} />
          <div className="speiling">
            <Brodsmuler brodsmuler={brodsmuler} />
            <Soknader fnr={fnr} soknader={sykepengesoknader} />
          </div>
        </div>
      </SideLaster>
    </Side>
  );
};

export default SykepengesoknaderSide;

import React, { ReactElement, useState } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingTeasere from "./SykmeldingTeasere";
import { VelgSykmeldingSorteringDropdown } from "./VelgSykmeldingSorteringDropdown";
import {
  SorteringKriterium,
  SorteringsKriteriumVerdi,
  sorterSykmeldinger,
} from "@/utils/sorterSykmeldingerUtils";
import {
  skalVisesSomAktivSykmelding,
  skalVisesSomTidligereSykmelding,
} from "@/utils/sykmeldinger/sykmeldingUtils";

const texts = {
  ingenSykmeldinger: "Tidligere sykmeldinger",
  ingenNyeSykmeldinger: "Du har ingen nye sykmeldinger",
  nyeSykmeldinger: "Nye sykmeldinger",
  apneSykmelding: "Åpne sykmelding",
  sorteringDato: "Dato",
  sorteringArbeidsgiver: "Arbeidsgiver",
};

const sorteringsKriterier: SorteringKriterium[] = [
  {
    tekst: texts.sorteringDato,
    verdi: "dato",
  },
  {
    tekst: texts.sorteringArbeidsgiver,
    verdi: "arbeidsgiver",
  },
];

interface DineSykmeldingerProps {
  sykmeldinger: SykmeldingOldFormat[];
}

const DineSykmeldinger = ({
  sykmeldinger = [],
}: DineSykmeldingerProps): ReactElement => {
  const nyeSykmeldinger = sykmeldinger.filter((sykmld) => {
    return skalVisesSomAktivSykmelding(sykmld);
  });
  const tidligereSykmeldinger = sykmeldinger.filter((sykmld) => {
    return skalVisesSomTidligereSykmelding(sykmld);
  });
  const [valgtSortering, setValgtSortering] =
    useState<SorteringsKriteriumVerdi>("dato");

  return (
    <>
      <SykmeldingTeasere
        sykmeldinger={sorterSykmeldinger(nyeSykmeldinger)}
        tittel={texts.nyeSykmeldinger}
        ingenSykmeldingerMelding={texts.ingenNyeSykmeldinger}
        className="js-nye-sykmeldinger"
        id="sykmelding-liste-nye"
      />
      {tidligereSykmeldinger.length > 0 && (
        <SykmeldingTeasere
          sykmeldinger={sorterSykmeldinger(
            tidligereSykmeldinger,
            valgtSortering
          )}
          tittel={texts.ingenSykmeldinger}
          ingenSykmeldingerMelding={texts.ingenSykmeldinger}
          className="js-tidligere-sykmeldinger"
          id="sykmelding-liste-tidligere"
        >
          <VelgSykmeldingSorteringDropdown
            sorteringsKriterier={sorteringsKriterier}
            onSorteringChanged={(e) => setValgtSortering(e.target.value)}
          />
        </SykmeldingTeasere>
      )}
    </>
  );
};

export default DineSykmeldinger;

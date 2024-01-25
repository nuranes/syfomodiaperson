import React, { ReactElement, useState } from "react";
import { VelgSykmeldingSorteringDropdown } from "./VelgSykmeldingSorteringDropdown";
import {
  SorteringKriterium,
  SorteringsKriteriumVerdi,
  sorterSykmeldinger,
} from "@/utils/sorterSykmeldingerUtils";
import { Panel } from "@navikt/ds-react";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erSykmeldingUtenArbeidsgiver,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { UtvidbarSykmelding } from "@/components/UtvidbarSykmelding";

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

const DineSykmeldinger = (): ReactElement => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const [valgtSortering, setValgtSortering] =
    useState<SorteringsKriteriumVerdi>("dato");
  const sorterteSykmeldinger = sorterSykmeldinger(sykmeldinger, valgtSortering);

  return (
    <Panel className="[&>*]:mb-4">
      <div className="flex flex-row-reverse">
        <VelgSykmeldingSorteringDropdown
          sorteringsKriterier={sorteringsKriterier}
          onSorteringChanged={(e) => setValgtSortering(e.target.value)}
        />
      </div>
      {sorterteSykmeldinger.map((sykmelding, index) => {
        const label = erSykmeldingUtenArbeidsgiver(sykmelding)
          ? undefined
          : arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
        return (
          <UtvidbarSykmelding
            sykmelding={sykmelding}
            label={label}
            key={index}
          />
        );
      })}
    </Panel>
  );
};

export default DineSykmeldinger;

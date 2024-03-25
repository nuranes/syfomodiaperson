import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";
import SykepengesoknadStatuspanel from "@/sider/sykepengsoknader/soknad-arbeidstaker-ny/SykepengesoknadStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om reisetilskudd",
  oppsummeringTittel: "Oppsummering",
};

interface OppsummeringUtvidbarProps {
  soknad: SykepengesoknadDTO;
}

const OppsummeringUtvidbar = ({ soknad }: OppsummeringUtvidbarProps) => {
  return (
    <SpeilingEkspanderbartPanel tittel={texts.oppsummeringTittel}>
      <Oppsummeringsvisning soknad={soknad} />
    </SpeilingEkspanderbartPanel>
  );
};

interface SykepengesoknadReisetilskuddProps {
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadReisetilskudd = ({
  soknad,
}: SykepengesoknadReisetilskuddProps): ReactElement => {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      {soknad.status === Soknadstatus.KORRIGERT && (
        <KorrigertAv soknadId={soknad.id} />
      )}
      <SykepengesoknadStatuspanel soknad={soknad} />
      <SykmeldingUtdragContainer soknad={soknad} />
      <OppsummeringUtvidbar
        soknad={{
          ...soknad,
          sporsmal: soknad.sporsmal.filter(
            (sporsmal) => !erVaerKlarOverAt(sporsmal)
          ),
        }}
      />
      <RelaterteSoknader soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
};

export default SykepengesoknadReisetilskudd;

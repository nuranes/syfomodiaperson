import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SykepengesoknadStatuspanel from "./SykepengesoknadStatuspanel";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erTilSlutt, erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger",
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

interface SendtSoknadArbeidstakerNyProps {
  soknad: SykepengesoknadDTO;
}

const SendtSoknadArbeidstakerNy = ({
  soknad,
}: SendtSoknadArbeidstakerNyProps): ReactElement => {
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
            (sporsmal) => !(erVaerKlarOverAt(sporsmal) || erTilSlutt(sporsmal))
          ),
        }}
      />
      <div className="panel blokk">
        <Oppsummeringsvisning
          soknad={{
            ...soknad,
            sporsmal: soknad.sporsmal.filter(
              (sporsmal) => erVaerKlarOverAt(sporsmal) || erTilSlutt(sporsmal)
            ),
          }}
        />
      </div>
      <RelaterteSoknader soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
};

export default SendtSoknadArbeidstakerNy;

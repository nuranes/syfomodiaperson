import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import SykepengesoknadStatuspanel from "./SykepengesoknadStatuspanel";
import { Brodsmule } from "../../Brodsmuler";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erTilSlutt, erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";

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
  brukernavn: string;
  brodsmuler: Brodsmule[];
  soknad: SykepengesoknadDTO;
}

const SendtSoknadArbeidstakerNy = ({
  brukernavn,
  brodsmuler,
  soknad,
}: SendtSoknadArbeidstakerNyProps): ReactElement => {
  return (
    <SoknadSpeiling
      tittel={texts.tittel}
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
    >
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
    </SoknadSpeiling>
  );
};

export default SendtSoknadArbeidstakerNy;

import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import { Brodsmule } from "../../Brodsmuler";
import {
  SoknadstatusDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erVaerKlarOverAt } from "@/utils/sykepengesoknadUtils";
import SykepengesoknadStatuspanel from "@/components/speiling/sykepengsoknader/soknad-arbeidstaker-ny/SykepengesoknadStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";

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
  brukernavn: string;
  brodsmuler: Brodsmule[];
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadReisetilskudd = ({
  brukernavn,
  brodsmuler,
  soknad,
}: SykepengesoknadReisetilskuddProps): ReactElement => {
  return (
    <SoknadSpeiling
      tittel={texts.tittel}
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
    >
      {soknad.status === SoknadstatusDTO.KORRIGERT && (
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
    </SoknadSpeiling>
  );
};

export default SykepengesoknadReisetilskudd;

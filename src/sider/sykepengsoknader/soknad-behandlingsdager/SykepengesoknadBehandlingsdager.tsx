import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import StatuspanelBehandlingsdager from "./StatuspanelBehandlingsdager";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Brodsmule } from "../../../components/speiling/Brodsmuler";
import { Heading, Panel } from "@navikt/ds-react";

const texts = {
  tittel: "Søknad om sykepenger for enkeltstående behandlingsdager",
  oppsummering: "Oppsummering av søknaden",
};

interface OppsummeringPanelProps {
  soknad: SykepengesoknadDTO;
}

const OppsummeringPanel = ({ soknad }: OppsummeringPanelProps) => {
  return (
    <Panel>
      <Heading spacing size="small">
        {texts.oppsummering}
      </Heading>
      <Oppsummeringsvisning soknad={soknad} />
    </Panel>
  );
};

interface SykepengesoknadBehandlingsdagerProps {
  brukernavn: string;
  brodsmuler: Brodsmule[];
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadBehandlingsdager = ({
  brukernavn,
  brodsmuler,
  soknad,
}: SykepengesoknadBehandlingsdagerProps): ReactElement => {
  return (
    <SoknadSpeiling
      tittel={texts.tittel}
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
    >
      <StatuspanelBehandlingsdager soknad={soknad} />
      <OppsummeringPanel soknad={soknad} />
    </SoknadSpeiling>
  );
};

export default SykepengesoknadBehandlingsdager;

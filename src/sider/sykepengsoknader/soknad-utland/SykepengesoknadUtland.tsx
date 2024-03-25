import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import StatuspanelUtland from "./StatuspanelUtland";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Heading, Panel } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger under opphold utenfor Norge",
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

interface SykepengesoknadUtlandProps {
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadUtland = ({
  soknad,
}: SykepengesoknadUtlandProps): ReactElement => {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <StatuspanelUtland soknad={soknad} />
      <OppsummeringPanel soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
};

export default SykepengesoknadUtland;

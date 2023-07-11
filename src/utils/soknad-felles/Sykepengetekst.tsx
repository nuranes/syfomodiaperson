import React from "react";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort } from "@navikt/ds-react";
import SykepengerOgSaksbehandlingstiderLink from "@/utils/soknad-felles/SykepengerOgSaksbehandlingstiderLink";

interface SykepengetekstProps {
  soknad: SykepengesoknadDTO;
}

const Sykepengetekst = ({ soknad }: SykepengetekstProps) => {
  if (soknad.sendtTilNAVDato && soknad.sendtTilArbeidsgiverDato) {
    return <SykepengerOgSaksbehandlingstiderLink />;
  } else if (soknad.sendtTilNAVDato) {
    return (
      <SykepengerOgSaksbehandlingstiderLink tittel="Sykepenger utbetales etter at NAV har innvilget søknaden." />
    );
  } else {
    return (
      <BodyShort size="small">
        Du får sykepengene utbetalt fra arbeidsgiveren din.
      </BodyShort>
    );
  }
};

export default Sykepengetekst;

import React, { ReactElement, ReactNode } from "react";
import AppSpinner from "./AppSpinner";
import Feilmelding from "./Feilmelding";
import { hentBegrunnelseTekst } from "@/utils/tilgangUtils";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import Decorator from "@/decorator/Decorator";

interface AktivBrukerTilgangLasterProps {
  children: ReactNode;
}

const texts = {
  errorTitle: "Du har ikke tilgang til denne brukeren",
};

const AktivBrukerTilgangLaster = ({
  children,
}: AktivBrukerTilgangLasterProps): ReactElement => {
  const {
    isInitialLoading: henterTilgang,
    isError: hentingTilgangFeilet,
    data: tilgang,
  } = useTilgangQuery();
  const harTilgang = tilgang?.harTilgang === true;

  let visning;
  if (henterTilgang) {
    visning = <AppSpinner />;
  } else if (!harTilgang) {
    visning = (
      <Feilmelding tittel={texts.errorTitle} melding={hentBegrunnelseTekst()} />
    );
  } else if (hentingTilgangFeilet) {
    visning = <Feilmelding />;
  } else {
    visning = <>{children}</>;
  }
  return (
    <>
      <Decorator />
      {visning}
    </>
  );
};

export default AktivBrukerTilgangLaster;

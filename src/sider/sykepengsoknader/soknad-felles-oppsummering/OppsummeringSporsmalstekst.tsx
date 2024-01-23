import React, { ReactElement } from "react";

interface OppsummeringSporsmalstekstProps {
  overskriftsnivaa?: number;
  children?: string;
}

const OppsummeringSporsmalstekst = ({
  overskriftsnivaa = 3,
  children,
}: OppsummeringSporsmalstekstProps): ReactElement => {
  const Overskriftstag = `h${overskriftsnivaa}` as keyof JSX.IntrinsicElements;
  return (
    <Overskriftstag className="oppsummering__sporsmal">
      {children}
    </Overskriftstag>
  );
};

export default OppsummeringSporsmalstekst;

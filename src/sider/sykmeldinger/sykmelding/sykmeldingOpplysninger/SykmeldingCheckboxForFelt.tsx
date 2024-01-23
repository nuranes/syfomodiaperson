import { SykmeldingCheckbox } from "./SykmeldingCheckbox";
import React from "react";

interface SykmeldingCheckboxForFeltProps {
  sykmeldingBolk: { [key: string]: any };
  felt: string;
  tekst: string;
  className?: string;
}

export const SykmeldingCheckboxForFelt = ({
  sykmeldingBolk,
  felt,
  tekst,
  className,
}: SykmeldingCheckboxForFeltProps) =>
  sykmeldingBolk[felt] ? (
    <SykmeldingCheckbox
      tekst={tekst}
      jsClassName={felt}
      className={className}
    />
  ) : null;

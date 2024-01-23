import React from "react";
import { CheckboxPng } from "../../../../../img/ImageComponents";

interface SykmeldingCheckboxProps {
  tekst: string;
  jsClassName?: string;
  className?: string;
}

export const SykmeldingCheckbox = (
  sykmeldingCheckboxProps: SykmeldingCheckboxProps
) => {
  const { tekst, jsClassName, className = "" } = sykmeldingCheckboxProps;
  return (
    <p className={`checkboxOpplysning ${className} js-${jsClassName}`}>
      <img src={CheckboxPng} className="ikon" alt="Huket av" />
      <span
        className="checkboxOpplysning__label"
        dangerouslySetInnerHTML={{ __html: tekst }}
      />
    </p>
  );
};

interface SykmeldingCheckboxSelvstendigProps {
  tekst: string;
  jsClassName: string;
}

export const SykmeldingCheckboxSelvstendig = (
  sykmeldingCheckboxSelvstendigProps: SykmeldingCheckboxSelvstendigProps
) => {
  const { tekst, jsClassName } = sykmeldingCheckboxSelvstendigProps;
  return (
    <SykmeldingCheckbox
      tekst={tekst}
      jsClassName={jsClassName}
      className="typo-element blokk-m"
    />
  );
};

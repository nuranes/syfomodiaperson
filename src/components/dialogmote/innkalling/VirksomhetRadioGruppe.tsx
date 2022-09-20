import React, { ReactElement } from "react";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver:
    "Det er ikke registrert en virksomhet på denne arbeidstakeren.",
};

interface VirksomhetRadioProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  virksomhetsnummer: string;
  name: string;
}

const VirksomhetRadio = ({
  velgVirksomhet,
  virksomhetsnummer,
  name,
}: VirksomhetRadioProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);
  const virksomhetsnavnText =
    virksomhetsnavn || `Fant ikke virksomhetsnavn for ${virksomhetsnummer}`;

  return (
    <Radio
      label={virksomhetsnavnText}
      name={name}
      value={virksomhetsnummer}
      onChange={() => velgVirksomhet(virksomhetsnummer)}
    />
  );
};

interface VirksomhetRadioGruppeProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  virksomheter: string[];
  id: string;
  label: string;
  name: string;
}

export const VirksomhetRadioGruppe = ({
  velgVirksomhet,
  virksomheter,
  id,
  label,
  name,
}: VirksomhetRadioGruppeProps): ReactElement => {
  return (
    <>
      {virksomheter.length > 0 ? (
        <RadioGruppe id={id} legend={label}>
          {virksomheter.map((virksomhetsnummer, index) => (
            <VirksomhetRadio
              key={index}
              velgVirksomhet={velgVirksomhet}
              virksomhetsnummer={virksomhetsnummer}
              name={name}
            />
          ))}
        </RadioGruppe>
      ) : (
        <AlertstripeFullbredde type="advarsel">
          {texts.noArbeidsgiver}
        </AlertstripeFullbredde>
      )}
    </>
  );
};

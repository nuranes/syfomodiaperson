import React, { ReactElement, ReactNode } from "react";
import { VirksomhetRadio } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetRadio";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { Radio, RadioGroup } from "@navikt/ds-react";

const texts = {
  fritekstRadio: "Oppgi virksomhetsnummer",
};

interface VirksomhetRadioGruppeProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  setShowInput(value: boolean): void;
  virksomheter: string[];
  id: string;
  label: string;
  name: string;
  error: ReactNode;
}

export const VirksomhetRadioGruppe = ({
  velgVirksomhet,
  setShowInput,
  virksomheter,
  id,
  label,
  name,
  error,
}: VirksomhetRadioGruppeProps): ReactElement => {
  const { toggles } = useFeatureToggles();
  const removeInputAndChooseVirksomhet = (virksomhetsnummer: string) => {
    setShowInput(false);
    velgVirksomhet(virksomhetsnummer);
  };
  const showInputAndRemoveChosenVirksomhet = () => {
    setShowInput(true);
    velgVirksomhet("");
  };

  let defaultVirksomhet: string | undefined = undefined;
  if (virksomheter.length === 1) {
    defaultVirksomhet = virksomheter[0];
    removeInputAndChooseVirksomhet(defaultVirksomhet);
  }

  return (
    <RadioGroup
      legend={label}
      size="small"
      id={id}
      error={error}
      defaultValue={defaultVirksomhet}
    >
      {virksomheter.map((virksomhetsnummer, index) => (
        <VirksomhetRadio
          key={index}
          velgVirksomhet={removeInputAndChooseVirksomhet}
          virksomhetsnummer={virksomhetsnummer}
          name={name}
        />
      ))}
      {toggles.isVirksomhetsinputEnabled && (
        <Radio
          name={name}
          value="fritekst"
          onChange={showInputAndRemoveChosenVirksomhet}
        >
          {texts.fritekstRadio}
        </Radio>
      )}
    </RadioGroup>
  );
};

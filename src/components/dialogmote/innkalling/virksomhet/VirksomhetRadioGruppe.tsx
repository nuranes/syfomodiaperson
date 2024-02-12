import React, { ReactElement, ReactNode } from "react";
import { VirksomhetRadio } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetRadio";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { Radio, RadioGroup } from "@navikt/ds-react";

const texts = {
  fritekstRadio: "Oppgi virksomhetsnummer",
};

interface VirksomhetRadioGruppeProps {
  defaultVirksomhet: string | undefined;
  velgVirksomhet(virksomhetsnummer: string): void;
  setShowInput(value: boolean): void;
  virksomheter: string[];
  label: string;
  error: ReactNode;
}

export const VirksomhetRadioGruppe = ({
  defaultVirksomhet,
  velgVirksomhet,
  setShowInput,
  virksomheter,
  label,
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

  return (
    <RadioGroup
      legend={label}
      size="small"
      error={error}
      defaultValue={defaultVirksomhet}
    >
      {virksomheter.map((virksomhetsnummer, index) => (
        <VirksomhetRadio
          key={index}
          velgVirksomhet={removeInputAndChooseVirksomhet}
          virksomhetsnummer={virksomhetsnummer}
        />
      ))}
      {toggles.isVirksomhetsinputEnabled && (
        <Radio value="fritekst" onChange={showInputAndRemoveChosenVirksomhet}>
          {texts.fritekstRadio}
        </Radio>
      )}
    </RadioGroup>
  );
};

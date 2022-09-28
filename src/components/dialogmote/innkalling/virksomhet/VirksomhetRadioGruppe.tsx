import { RadioGruppe } from "nav-frontend-skjema";
import React, { ReactElement } from "react";
import { VirksomhetRadio } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetRadio";
import { VirksomhetInputRadio } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetInputRadio";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

interface VirksomhetRadioGruppeProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  setShowInput(value: boolean): void;
  virksomheter: string[];
  id: string;
  label: string;
  name: string;
}

export const VirksomhetRadioGruppe = ({
  velgVirksomhet,
  setShowInput,
  virksomheter,
  id,
  label,
  name,
}: VirksomhetRadioGruppeProps): ReactElement => {
  const { isFeatureEnabled } = useFeatureToggles();
  const hasAccessToVirksomhetInput = isFeatureEnabled(
    ToggleNames.virksomhetinput
  );
  const removeInputAndChooseVirksomhet = (virksomhetsnummer: string) => {
    setShowInput(false);
    velgVirksomhet(virksomhetsnummer);
  };
  const showInputAndRemoveChosenVirksomhet = () => {
    setShowInput(true);
    velgVirksomhet("");
  };

  return (
    <RadioGruppe id={id} legend={label}>
      {virksomheter.map((virksomhetsnummer, index) => (
        <VirksomhetRadio
          key={index}
          velgVirksomhet={removeInputAndChooseVirksomhet}
          virksomhetsnummer={virksomhetsnummer}
          name={name}
        />
      ))}
      {hasAccessToVirksomhetInput && (
        <VirksomhetInputRadio
          key={virksomheter.length}
          setShowFritekst={showInputAndRemoveChosenVirksomhet}
          name={name}
        />
      )}
    </RadioGruppe>
  );
};

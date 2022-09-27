import React, { ReactElement, useState } from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { VirksomhetInput } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetInput";
import { VirksomhetRadioGruppe } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetRadioGruppe";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver:
    "Det er ikke registrert en virksomhet på denne arbeidstakeren.",
};

interface VirksomhetRadioGruppeProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  virksomheter: string[];
  id: string;
  label: string;
  name: string;
}

export const VirksomhetChooser = ({
  velgVirksomhet,
  virksomheter,
  id,
  label,
  name,
}: VirksomhetRadioGruppeProps): ReactElement => {
  const { isFeatureEnabled } = useFeatureToggles();
  const hasAccessToVirksomhetInput = isFeatureEnabled(
    ToggleNames.virksomhetinput
  );
  const [showInput, setShowInput] = useState<boolean>(false);

  return (
    <>
      <VirksomhetRadioGruppe
        velgVirksomhet={velgVirksomhet}
        setShowInput={setShowInput}
        virksomheter={virksomheter}
        id={id}
        label={label}
        name={name}
      />

      {showInput && <VirksomhetInput velgVirksomhet={velgVirksomhet} />}

      {virksomheter.length === 0 && !hasAccessToVirksomhetInput && (
        <AlertstripeFullbredde type="advarsel">
          {texts.noArbeidsgiver}
        </AlertstripeFullbredde>
      )}
    </>
  );
};

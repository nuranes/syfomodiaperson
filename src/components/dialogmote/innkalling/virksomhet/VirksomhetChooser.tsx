import React, { ReactElement, useState } from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { VirksomhetInput } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetInput";
import { VirksomhetRadioGruppe } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetRadioGruppe";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver: "Det er ikke registrert en virksomhet på denne personen.",
  unemployed:
    "Hvis personen er arbeidsledig, kan du kalle inn til samarbeidsmøte fra aktivitetsplanen.",
  report_error: "Hvis du mener det er feil, meld sak i Porten.",
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
  const { toggles } = useFeatureToggles();
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

      {virksomheter.length === 0 && !toggles.isVirksomhetsinputEnabled && (
        <AlertstripeFullbredde type="advarsel" marginbottom="2em">
          {texts.noArbeidsgiver}
          <ul>
            <li>{texts.unemployed}</li>
            <li>{texts.report_error}</li>
          </ul>
        </AlertstripeFullbredde>
      )}
    </>
  );
};

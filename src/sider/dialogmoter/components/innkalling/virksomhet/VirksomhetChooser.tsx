import React, { ReactElement, ReactNode, useState } from "react";
import { VirksomhetInput } from "@/sider/dialogmoter/components/innkalling/virksomhet/VirksomhetInput";
import { VirksomhetRadioGruppe } from "@/sider/dialogmoter/components/innkalling/virksomhet/VirksomhetRadioGruppe";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { Alert } from "@navikt/ds-react";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver: "Det er ikke registrert en virksomhet på denne personen.",
  unemployed:
    "Hvis personen er arbeidsledig, kan du kalle inn til samarbeidsmøte fra aktivitetsplanen.",
  report_error: "Hvis du mener det er feil, meld sak i Porten.",
};

interface VirksomhetRadioGruppeProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  defaultVirksomhet: string | undefined;
  virksomheter: string[];
  label: string;
  error: ReactNode;
}

export const VirksomhetChooser = ({
  velgVirksomhet,
  defaultVirksomhet,
  virksomheter,
  label,
  error,
}: VirksomhetRadioGruppeProps): ReactElement => {
  const { toggles } = useFeatureToggles();
  const [showInput, setShowInput] = useState<boolean>(false);

  return (
    <div className="mb-8">
      <VirksomhetRadioGruppe
        defaultVirksomhet={defaultVirksomhet}
        velgVirksomhet={velgVirksomhet}
        setShowInput={setShowInput}
        virksomheter={virksomheter}
        label={label}
        error={error}
      />

      {showInput && <VirksomhetInput velgVirksomhet={velgVirksomhet} />}

      {virksomheter.length === 0 && !toggles.isVirksomhetsinputEnabled && (
        <Alert variant="warning" size="small" className="[&>*]:max-w-fit">
          {texts.noArbeidsgiver}
          <ul>
            <li>{texts.unemployed}</li>
            <li>{texts.report_error}</li>
          </ul>
        </Alert>
      )}
    </div>
  );
};

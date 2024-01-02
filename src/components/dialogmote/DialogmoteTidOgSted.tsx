import React, { ReactElement } from "react";
import { Input } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import KlokkeslettField from "../KlokkeslettField";
import DialogmoteDatoField from "./DialogmoteDatoField";
import DialogmoteInnkallingSkjemaSeksjon from "./innkalling/DialogmoteInnkallingSkjemaSeksjon";
import styled from "styled-components";
import { FlexColumn, FlexRow, PaddingSize } from "../Layout";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { addWeeks, visDato } from "@/utils/datoUtils";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";

const texts = {
  title: "Tid og sted",
  stedLabel: "Sted",
  stedPlaceholder: "F.eks: På arbeidsplassen",
  tidLabel: "Klokkeslett",
  videoLabel: "Lenke til videomøte (valgfritt)",
  videoPlaceholder: "https://",
  alertText:
    "Tips: Nå som innkallingen ikke sendes med post, kan du kalle inn til dialogmøter tidligere enn tre uker frem i tid.",
};

const DatoColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

const FRIST_DIALOGMOTE2_IN_WEEKS = 26;

interface FristProps {
  startDate: Date;
}

const Frist = ({ startDate }: FristProps) => {
  const frist = addWeeks(startDate, FRIST_DIALOGMOTE2_IN_WEEKS);
  return <p>Frist dialogmøte 2: {visDato(frist)}</p>;
};

interface DialogmoteTidOgStedProps {
  isFuturisticMeeting?: boolean;
}

const DialogmoteTidOgSted = ({
  isFuturisticMeeting,
}: DialogmoteTidOgStedProps): ReactElement => {
  const klokkeslettField = "klokkeslett";
  const stedField = "sted";
  const videoLinkField = "videoLink";
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const ABTestHit = Number(veilederinfo?.ident.slice(-1)) >= 5;
  const { brukerKanVarslesDigitalt } = useBrukerinfoQuery();
  const showFuturisticWarning =
    !!isFuturisticMeeting && ABTestHit && brukerKanVarslesDigitalt;
  const { hasActiveOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      {isKandidat &&
        hasActiveOppfolgingstilfelle &&
        latestOppfolgingstilfelle && (
          <Frist startDate={latestOppfolgingstilfelle.start} />
        )}
      <FlexRow bottomPadding={PaddingSize.SM}>
        <DatoColumn>
          <DialogmoteDatoField />
        </DatoColumn>
        <FlexColumn flex={1}>
          <KlokkeslettField
            id={klokkeslettField}
            name={klokkeslettField}
            label={texts.tidLabel}
          />
        </FlexColumn>
      </FlexRow>
      {showFuturisticWarning && (
        <AlertstripeFullbredde type="info" marginbottom="2em">
          <p>{texts.alertText}</p>
        </AlertstripeFullbredde>
      )}
      <FlexRow bottomPadding={PaddingSize.SM}>
        <FlexColumn flex={1}>
          <Field<string> name={stedField}>
            {({ input, meta }) => (
              <Input
                {...input}
                id={stedField}
                placeholder={texts.stedPlaceholder}
                label={texts.stedLabel}
                feil={meta.submitFailed && meta.error}
              />
            )}
          </Field>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn flex={1}>
          <Field<string> name={videoLinkField}>
            {({ input, meta }) => (
              <Input
                {...input}
                id={videoLinkField}
                label={texts.videoLabel}
                placeholder={texts.videoPlaceholder}
                feil={meta.submitFailed && meta.error}
              />
            )}
          </Field>
        </FlexColumn>
      </FlexRow>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteTidOgSted;

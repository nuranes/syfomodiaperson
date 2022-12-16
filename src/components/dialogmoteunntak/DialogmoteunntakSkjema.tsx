import React from "react";
import { Form } from "react-final-form";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  CreateUnntakDTO,
  UnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import DialogmoteunntakSkjemaArsakVelger, {
  DialogmoteunntakSkjemaArsakVelgerFieldName,
} from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaArsakVelger";
import DialogmoteunntakSkjemaBeskrivelse, {
  dialogmoteunntakSkjemaBeskrivelseFieldName,
  dialogmoteunntakSkjemaBeskrivelseMaxLength,
} from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaBeskrivelse";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteunntak } from "@/data/dialogmotekandidat/useSettDialogmoteunntak";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { validerTekst } from "@/utils/valideringUtils";
import { Flatknapp, Hovedknapp } from "nav-frontend-knapper";

export const texts = {
  noBrev: "Det blir ikke sendt ut brev ved unntak.",
  infoKandidatlist: `Når du setter unntak fra dialogmøte vil arbeidstakeren bli fjernet fra kandidatlisten. Dersom du på et senere tidspunkt vurderer at det likevel er nødvendig med et dialogmøte, kan du kalle inn til dialogmøte ved å søke deg frem til denne arbeidstakeren.`,
  send: "Sett unntak",
  avbryt: "Avbryt",
};

const StyledPanel = styled(Panel)`
  padding: 2em;
`;

const SkjemaFieldWrapper = styled.div`
  margin-bottom: 2em;
`;

export interface DialogmoteunntakSkjemaValues {
  arsak: UnntakArsak;
  beskrivelse?: string;
}

const DialogmoteunntakSkjema = () => {
  const personIdent = useValgtPersonident();
  const { isKandidat } = useDialogmotekandidat();
  const settDialogmoteunntak = useSettDialogmoteunntak();

  if (!isKandidat || settDialogmoteunntak.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const validate = (values: Partial<DialogmoteunntakSkjemaValues>) => {
    let feil = {};
    if (!values.arsak) {
      feil = {
        ...feil,
        [DialogmoteunntakSkjemaArsakVelgerFieldName]: "Vennligst angi årsak",
      };
    }
    if (values.beskrivelse) {
      const invalidText = validerTekst({
        value: values.beskrivelse,
        maxLength: dialogmoteunntakSkjemaBeskrivelseMaxLength,
      });
      if (invalidText) {
        feil = {
          ...feil,
          [dialogmoteunntakSkjemaBeskrivelseFieldName]: invalidText,
        };
      }
    }
    return feil;
  };

  const submit = (values: DialogmoteunntakSkjemaValues) => {
    const newUnntak: CreateUnntakDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
      beskrivelse: values.beskrivelse,
    };
    settDialogmoteunntak.mutate(newUnntak);
  };

  return (
    <StyledPanel>
      <AlertStripeInfo>{texts.noBrev}</AlertStripeInfo>
      <p>{texts.infoKandidatlist}</p>
      <Form onSubmit={submit} validate={validate}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SkjemaFieldWrapper>
              <DialogmoteunntakSkjemaArsakVelger />
            </SkjemaFieldWrapper>
            <SkjemaFieldWrapper>
              <DialogmoteunntakSkjemaBeskrivelse />
            </SkjemaFieldWrapper>
            {settDialogmoteunntak.isError && (
              <SkjemaInnsendingFeil error={settDialogmoteunntak.error} />
            )}
            <FlexRow columnGap={FlexGapSize.SM}>
              <Hovedknapp
                spinner={settDialogmoteunntak.isLoading}
                autoDisableVedSpinner
                htmlType="submit"
              >
                {texts.send}
              </Hovedknapp>
              <Link to={moteoversiktRoutePath}>
                <Flatknapp>{texts.avbryt}</Flatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </StyledPanel>
  );
};

export default DialogmoteunntakSkjema;

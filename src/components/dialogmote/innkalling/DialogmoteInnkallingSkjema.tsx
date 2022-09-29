import React, { useState } from "react";
import Panel from "nav-frontend-paneler";
import DialogmoteInnkallingVelgVirksomhet from "./virksomhet/DialogmoteInnkallingVelgVirksomhet";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import DialogmoteInnkallingTekster, {
  MAX_LENGTH_INNKALLING_FRITEKST,
} from "./DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import {
  validerArbeidsgiver,
  behandlerRefValidationErrors,
  validerSkjemaTekster,
  validerSted,
  validerTidspunkt,
  validerVideoLink,
} from "@/utils/valideringUtils";
import {
  DialogmoteInnkallingDTO,
  TidStedDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { FlexRow } from "../../Layout";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import {
  IInnkallingDocument,
  useInnkallingDocument,
} from "@/hooks/dialogmote/document/useInnkallingDocument";
import { useOpprettInnkallingDialogmote } from "@/data/dialogmote/useOpprettInnkallingDialogmote";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import DialogmoteInnkallingBehandler from "@/components/dialogmote/innkalling/DialogmoteInnkallingBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { Flatknapp, Hovedknapp } from "nav-frontend-knapper";
import dayjs from "dayjs";

interface DialogmoteInnkallingSkjemaTekster {
  fritekstArbeidsgiver: string;
  fritekstArbeidstaker: string;
  fritekstBehandler?: string;
}

export interface DialogmoteInnkallingSkjemaValues
  extends DialogmoteInnkallingSkjemaTekster,
    TidStedSkjemaValues {
  arbeidsgiver: string;
  behandlerRef: string;
}

const StyledPanel = styled(Panel)`
  margin-bottom: 2em;
  padding: 2em;
`;

type DialogmoteInnkallingSkjemaFeil = Partial<
  Pick<
    DialogmoteInnkallingSkjemaValues,
    | "arbeidsgiver"
    | "behandlerRef"
    | "sted"
    | "klokkeslett"
    | "dato"
    | "videoLink"
  >
>;

const texts = {
  send: "Send innkallingene",
  cancel: "Avbryt",
  behandler: "Behandler",
};

const toInnkalling = (
  values: DialogmoteInnkallingSkjemaValues,
  tidStedDto: TidStedDto,
  fnr: string,
  innkallingDocument: IInnkallingDocument,
  valgtBehandler: BehandlerDTO | undefined
): DialogmoteInnkallingDTO => {
  const innkalling: DialogmoteInnkallingDTO = {
    arbeidsgiver: {
      virksomhetsnummer: values.arbeidsgiver,
      fritekstInnkalling: values.fritekstArbeidsgiver,
      innkalling: innkallingDocument.getInnkallingDocumentArbeidsgiver(
        values,
        valgtBehandler
      ),
    },
    arbeidstaker: {
      personIdent: fnr,
      fritekstInnkalling: values.fritekstArbeidstaker,
      innkalling: innkallingDocument.getInnkallingDocumentArbeidstaker(
        values,
        valgtBehandler
      ),
    },
    tidSted: tidStedDto,
  };

  if (valgtBehandler) {
    innkalling.behandler = {
      personIdent: valgtBehandler.fnr,
      behandlerRef: valgtBehandler.behandlerRef,
      behandlerNavn: behandlerNavn(valgtBehandler),
      behandlerKontor: valgtBehandler.kontor ?? "",
      fritekstInnkalling: values.fritekstBehandler,
      innkalling: innkallingDocument.getInnkallingDocumentBehandler(values),
    };
  }

  return innkalling;
};

const isDateFuturistic = (date?: string) => {
  const today = dayjs(new Date());
  const selectedDate = dayjs(date);

  return selectedDate.isAfter(today.add(21, "days"), "date");
};

const DialogmoteInnkallingSkjema = () => {
  const initialValues: Partial<DialogmoteInnkallingSkjemaValues> = {};
  const fnr = useValgtPersonident();
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();

  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();

  const innkallingDocument = useInnkallingDocument();

  const { toTidStedDto } = useSkjemaValuesToDto();
  const opprettInnkalling = useOpprettInnkallingDialogmote(fnr);

  const [isFuturisticMeeting, setIsFuturisticMeeting] =
    useState<boolean>(false);

  const validate = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DialogmoteInnkallingSkjemaFeil => {
    const friteksterFeil =
      validerSkjemaTekster<DialogmoteInnkallingSkjemaTekster>({
        fritekstArbeidsgiver: {
          maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
          value: values.fritekstArbeidsgiver || "",
        },
        fritekstArbeidstaker: {
          maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
          value: values.fritekstArbeidstaker || "",
        },
        ...(selectedBehandler
          ? {
              fritekstBehandler: {
                maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
                value: values.fritekstBehandler || "",
              },
            }
          : {}),
      });

    setIsFuturisticMeeting(isDateFuturistic(values.dato));

    const feilmeldinger: DialogmoteInnkallingSkjemaFeil = {
      arbeidsgiver: validerArbeidsgiver(values.arbeidsgiver),
      behandlerRef: behandlerRefValidationErrors(values.behandlerRef),
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      ...friteksterFeil,
      videoLink: validerVideoLink(values.videoLink),
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  if (opprettInnkalling.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const submit = (values: DialogmoteInnkallingSkjemaValues) => {
    const dialogmoteInnkalling = toInnkalling(
      values,
      toTidStedDto(values),
      fnr,
      innkallingDocument,
      selectedBehandler
    );
    opprettInnkalling.mutate(dialogmoteInnkalling);
  };

  return (
    <StyledPanel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInnkallingVelgVirksomhet />
            <DialogmoteInnkallingBehandler
              setSelectedBehandler={setSelectedBehandler}
              selectedbehandler={selectedBehandler}
            />
            <DialogmoteTidOgSted isFuturisticMeeting={isFuturisticMeeting} />
            <DialogmoteInnkallingTekster
              selectedBehandler={selectedBehandler}
            />
            {opprettInnkalling.isError && (
              <SkjemaInnsendingFeil error={opprettInnkalling.error} />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <Hovedknapp
                onClick={resetFeilUtbedret}
                spinner={opprettInnkalling.isLoading}
                autoDisableVedSpinner
                htmlType="submit"
              >
                {texts.send}
              </Hovedknapp>
              <Link to={moteoversiktRoutePath}>
                <Flatknapp htmlType="button">{texts.cancel}</Flatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </StyledPanel>
  );
};

export default DialogmoteInnkallingSkjema;

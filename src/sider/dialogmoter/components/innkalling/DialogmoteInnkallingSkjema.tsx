import React, { useState } from "react";
import DialogmoteInnkallingVelgVirksomhet from "./virksomhet/DialogmoteInnkallingVelgVirksomhet";
import { validerKlokkeslett, validerVideoLink } from "@/utils/valideringUtils";
import {
  DialogmoteInnkallingDTO,
  TidStedDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  IInnkallingDocument,
  useInnkallingDocument,
} from "@/hooks/dialogmote/document/useInnkallingDocument";
import { useOpprettInnkallingDialogmote } from "@/data/dialogmote/useOpprettInnkallingDialogmote";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import DialogmoteInnkallingBehandler from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { Alert, Box, Button } from "@navikt/ds-react";
import { MalformRadioGroup } from "@/components/MalformRadioGroup";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useMalform } from "@/context/malform/MalformContext";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { DialogmoteDato } from "@/sider/dialogmoter/components/DialogmoteDato";
import DialogmoteKlokkeslett from "@/sider/dialogmoter/components/DialogmoteKlokkeslett";
import DialogmoteSted, {
  MAX_LENGTH_STED,
} from "@/sider/dialogmoter/components/DialogmoteSted";
import DialogmoteVideolink from "@/sider/dialogmoter/components/DialogmoteVideolink";
import { FormProvider, useForm } from "react-hook-form";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import TextareaField from "@/sider/dialogmoter/components/TextareaField";
import { DialogmoteFrist } from "@/sider/dialogmoter/components/DialogmoteFrist";

export interface DialogmoteInnkallingSkjemaValues extends TidStedSkjemaValues {
  fritekstArbeidsgiver: string;
  fritekstArbeidstaker: string;
  fritekstBehandler?: string;
  arbeidsgiver: string;
  behandlerRef: string;
}

export const texts = {
  send: "Send innkallingene",
  cancel: "Avbryt",
  behandler: "Behandler",
  arbeidstakerLabel: "Fritekst til arbeidstakeren (valgfri)",
  arbeidsgiverLabel: "Fritekst til nærmeste leder (valgfri)",
  behandlerLabel: "Fritekst til behandler (valgfri)",
  stedMissing: "Vennligst angi møtested",
  forhandsvisningSubtitle: "Innkalling til dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidsgiver",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis innkalling til dialogmøte behandler",
  reservertAlert:
    "Denne arbeidstakeren vil få brevet sendt som papirpost. Du kan inkludere telefonnummeret til kontaktsenteret i fritekstfeltet (55 55 33 33), slik at arbeidstakeren kan ta kontakt på telefon hvis tidspunktet ikke passer.",
};

export const MAX_LENGTH_INNKALLING_FRITEKST = 2000;

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

export const DialogmoteInnkallingSkjema = () => {
  const fnr = useValgtPersonident();
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const innkallingDocument = useInnkallingDocument();
  const { toTidStedDto } = useSkjemaValuesToDto();
  const opprettInnkalling = useOpprettInnkallingDialogmote(fnr);
  const { malform } = useMalform();
  const methods = useForm<DialogmoteInnkallingSkjemaValues>();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = methods;

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
    Amplitude.logEvent({
      type: EventType.OptionSelected,
      data: {
        url: window.location.href,
        tekst: "Målform valgt",
        option: malform,
      },
    });
  };

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <MalformRadioGroup />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-6">
            <DialogmoteInnkallingVelgVirksomhet />
            <DialogmoteInnkallingBehandler
              setSelectedBehandler={setSelectedBehandler}
              selectedbehandler={selectedBehandler}
            />
          </div>
          <div className="flex flex-col gap-4 mb-6">
            <DialogmoteFrist />
            <div className="flex gap-4 items-start">
              <DialogmoteDato />
              <DialogmoteKlokkeslett
                {...register("klokkeslett", {
                  validate: (value, formValues) =>
                    validerKlokkeslett(formValues.dato, value),
                })}
                error={errors.klokkeslett?.message}
              />
            </div>
            <DialogmoteSted
              {...register("sted", {
                maxLength: MAX_LENGTH_STED,
                required: texts.stedMissing,
              })}
              error={errors.sted?.message}
            />
            <DialogmoteVideolink
              {...register("videoLink", {
                validate: (value) => validerVideoLink(value),
              })}
              error={errors.videoLink?.message}
            />
          </div>
          {brukerKanIkkeVarslesDigitalt && (
            <Alert
              variant="warning"
              size="small"
              className="mb-4 [&>*]:max-w-fit"
            >
              {texts.reservertAlert}
            </Alert>
          )}
          <div className="mb-8">
            <TextareaField
              {...register("fritekstArbeidstaker", {
                maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
              })}
              value={watch("fritekstArbeidstaker")}
              label={texts.arbeidstakerLabel}
              maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
            />
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
              getDocumentComponents={() =>
                innkallingDocument.getInnkallingDocumentArbeidstaker(
                  getValues(),
                  selectedBehandler
                )
              }
              title={texts.forhandsvisningArbeidstakerTitle}
            />
          </div>
          <div className="mb-8">
            <TextareaField
              {...register("fritekstArbeidsgiver", {
                maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
              })}
              value={watch("fritekstArbeidsgiver")}
              label={texts.arbeidsgiverLabel}
              maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
            />
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
              getDocumentComponents={() =>
                innkallingDocument.getInnkallingDocumentArbeidsgiver(
                  getValues(),
                  selectedBehandler
                )
              }
              title={texts.forhandsvisningArbeidsgiverTitle}
            />
          </div>

          {!!selectedBehandler && (
            <div className="mb-8">
              <TextareaField
                {...register("fritekstBehandler", {
                  maxLength: MAX_LENGTH_INNKALLING_FRITEKST,
                })}
                value={watch("fritekstBehandler")}
                label={texts.behandlerLabel}
                maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
              />
              <Forhandsvisning
                contentLabel={texts.forhandsvisningBehandlerContentLabel}
                getDocumentComponents={() =>
                  innkallingDocument.getInnkallingDocumentBehandler(getValues())
                }
                title={texts.forhandsvisningBehandlerTitle}
              />
            </div>
          )}
          {opprettInnkalling.isError && (
            <SkjemaInnsendingFeil error={opprettInnkalling.error} />
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={opprettInnkalling.isPending}
            >
              {texts.send}
            </Button>
            <Button
              as={Link}
              type="button"
              variant="tertiary"
              to={moteoversiktRoutePath}
            >
              {texts.cancel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Box>
  );
};

import React from "react";
import { Link, Navigate } from "react-router-dom";

import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { validerKlokkeslett, validerVideoLink } from "@/utils/valideringUtils";
import { useTidStedDocument } from "@/hooks/dialogmote/document/useTidStedDocument";
import {
  DialogmoteDTO,
  EndreTidStedDialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useEndreTidStedDialogmote } from "@/data/dialogmote/useEndreTidStedDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { Alert, Box, Button } from "@navikt/ds-react";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { FormProvider, useForm } from "react-hook-form";
import TextareaField from "@/components/dialogmote/TextareaField";
import { DialogmoteDato } from "@/sider/mote/components/DialogmoteDato";
import DialogmoteSted, {
  MAX_LENGTH_STED,
} from "@/sider/mote/components/DialogmoteSted";
import DialogmoteVideolink from "@/sider/mote/components/DialogmoteVideolink";
import DialogmoteKlokkeslett from "@/sider/mote/components/DialogmoteKlokkeslett";
import { DialogmoteFrist } from "@/components/dialogmote/DialogmoteFrist";
import { MalformRadioGroup } from "@/components/MalformRadioGroup";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useMalform } from "@/context/malform/MalformContext";

export const texts = {
  send: "Send",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  begrunnelseBehandler: "Begrunnelse til behandler",
  forhandsvisningSubtitle: "Endret dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis endring av dialogmøte behandler",
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk til " +
    "Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
  stedMissing: "Vennligst angi møtested",
  begrunnelseArbeidstakerMissing:
    "Vennligst angi begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverMissing:
    "Vennligst angi begrunnelse til nærmeste leder",
  begrunnelseBehandlerMissing: "Vennligst angi begrunnelse til behandler",
};

export const MAX_LENGTH_ENDRE_BEGRUNNELSE = 2000;

export interface EndreTidStedSkjemaValues extends TidStedSkjemaValues {
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
  begrunnelseBehandler?: string;
}

interface Props {
  dialogmote: DialogmoteDTO;
}

const EndreDialogmoteSkjema = ({ dialogmote }: Props) => {
  const { sted, arbeidsgiver, tid, uuid, behandler, videoLink } = dialogmote;
  const fnr = useValgtPersonident();
  const { currentLedere } = useLedereQuery();
  const { malform } = useMalform();

  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    arbeidsgiver.virksomhetsnummer
  );

  const endreTidStedDialogmote = useEndreTidStedDialogmote(fnr, uuid);

  const {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  } = useTidStedDocument(dialogmote);
  const { toTidStedDto } = useSkjemaValuesToDto();

  const methods = useForm<EndreTidStedSkjemaValues>({
    defaultValues: {
      dato: tid.split("T")[0],
      klokkeslett: tid.split("T")[1].substring(0, 5),
      sted,
      videoLink,
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = methods;

  const toEndreTidSted = (
    values: EndreTidStedSkjemaValues
  ): EndreTidStedDialogmoteDTO => {
    const endreTidStedDto: EndreTidStedDialogmoteDTO = {
      ...toTidStedDto(values),
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        endringsdokument: getTidStedDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        endringsdokument: getTidStedDocumentArbeidsgiver(values),
      },
    };
    if (behandler) {
      endreTidStedDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        endringsdokument: getTidStedDocumentBehandler(values),
      };
    }

    return endreTidStedDto;
  };

  const submit = (values: EndreTidStedSkjemaValues) => {
    const dialogmoteEndring = toEndreTidSted(values);
    endreTidStedDialogmote.mutate(dialogmoteEndring, {
      onSuccess: () => {
        Amplitude.logEvent({
          type: EventType.OptionSelected,
          data: {
            url: window.location.href,
            tekst: "Målform valgt",
            option: malform,
          },
        });
      },
    });
  };

  if (endreTidStedDialogmote.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4 mb-6">
            <MalformRadioGroup />
            <DialogmoteFrist />
            <div className="flex gap-4 items-start">
              <DialogmoteDato />
              <DialogmoteKlokkeslett
                {...register("klokkeslett", {
                  validate: (value, formValues) =>
                    validerKlokkeslett(formValues.dato, value),
                })}
                value={watch("klokkeslett")}
                error={errors.klokkeslett?.message}
              />
            </div>
            <DialogmoteSted
              {...register("sted", {
                maxLength: MAX_LENGTH_STED,
                required: texts.stedMissing,
              })}
              value={watch("sted")}
              error={errors.sted?.message}
            />
            <DialogmoteVideolink
              {...register("videoLink", {
                validate: (value) => validerVideoLink(value),
              })}
              value={watch("videoLink")}
              error={errors.videoLink?.message}
            />
          </div>
          <div className="mb-8">
            <TextareaField
              {...register("begrunnelseArbeidstaker", {
                maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                required: texts.begrunnelseArbeidstakerMissing,
              })}
              value={watch("begrunnelseArbeidstaker")}
              error={errors.begrunnelseArbeidstaker?.message}
              label={texts.begrunnelseArbeidstaker}
              maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
            />
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
              getDocumentComponents={() =>
                getTidStedDocumentArbeidstaker(getValues())
              }
              title={texts.forhandsvisningArbeidstakerTitle}
            />
          </div>
          <div className="mb-8">
            <TextareaField
              {...register("begrunnelseArbeidsgiver", {
                maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                required: texts.begrunnelseArbeidsgiverMissing,
              })}
              value={watch("begrunnelseArbeidsgiver")}
              error={errors.begrunnelseArbeidsgiver?.message}
              label={texts.begrunnelseArbeidsgiver}
              maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
            />
            {!narmesteLeder && (
              <Alert
                variant="warning"
                size="small"
                className="mb-4 [&>*]:max-w-fit"
              >
                {texts.noNarmesteleder}
              </Alert>
            )}
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
              getDocumentComponents={() =>
                getTidStedDocumentArbeidsgiver(getValues())
              }
              title={texts.forhandsvisningArbeidsgiverTitle}
            />
          </div>
          {behandler && (
            <div className="mb-8">
              <TextareaField
                {...register("begrunnelseBehandler", {
                  maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                  required: texts.begrunnelseBehandlerMissing,
                })}
                value={watch("begrunnelseBehandler")}
                error={errors.begrunnelseBehandler?.message}
                label={texts.begrunnelseBehandler}
                maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
              />
              <Forhandsvisning
                contentLabel={texts.forhandsvisningBehandlerContentLabel}
                getDocumentComponents={() =>
                  getTidStedDocumentBehandler(getValues())
                }
                title={texts.forhandsvisningBehandlerTitle}
              />
            </div>
          )}
          {endreTidStedDialogmote.isError && (
            <SkjemaInnsendingFeil error={endreTidStedDialogmote.error} />
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={endreTidStedDialogmote.isPending}
            >
              {texts.send}
            </Button>
            <Button
              as={Link}
              type="button"
              variant="tertiary"
              to={moteoversiktRoutePath}
            >
              {texts.avbryt}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Box>
  );
};

export default EndreDialogmoteSkjema;

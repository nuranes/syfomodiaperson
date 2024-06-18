import React, { ReactElement } from "react";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useAvlysningDocument } from "@/hooks/dialogmote/document/useAvlysningDocument";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useAvlysDialogmote } from "@/data/dialogmote/useAvlysDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Alert, Box, Button, Label } from "@navikt/ds-react";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { useForm } from "react-hook-form";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { MalformRadioGroup } from "@/components/MalformRadioGroup";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useMalform } from "@/context/malform/MalformContext";
import TextareaField from "@/sider/dialogmoter/components/TextareaField";

export const MAX_LENGTH_AVLYS_BEGRUNNELSE = 500;

export const texts = {
  begrunnelseArbeidstakerLabel: "Begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverLabel: "Begrunnelse til nærmeste leder",
  begrunnelseBehandlerLabel: "Begrunnelse til behandler",
  begrunnelseArbeidstakerMissing:
    "Vennligst angi begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverMissing:
    "Vennligst angi begrunnelse til nærmeste leder",
  begrunnelseBehandlerMissing: "Vennligst angi begrunnelse til behandler",
  send: "Send",
  avbryt: "Avbryt",
  alert:
    "Hvis årsaken til avlysning er at arbeidstakeren ikke møtte opp, bør du vurdere om sykepengene skal stanses.",
  forhandsvisningSubtitle: "Avlysning av dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningArbeidstakerContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerContentlabel:
    "Forhåndsvis avlysning av dialogmøte behandler",
  gjelderTitle: "Gjelder dialogmøtet",
};

interface AvlysDialogmoteSkjemaProps {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

export interface AvlysDialogmoteSkjemaValues {
  begrunnelseArbeidstaker: string;
  begrunnelseArbeidsgiver: string;
  begrunnelseBehandler?: string;
}

const AvlysDialogmoteSkjema = ({
  dialogmote,
}: AvlysDialogmoteSkjemaProps): ReactElement => {
  const fnr = useValgtPersonident();
  const avlysDialogmote = useAvlysDialogmote(fnr, dialogmote.uuid);
  const {
    getAvlysningDocumentArbeidstaker,
    getAvlysningDocumentArbeidsgiver,
    getAvlysningDocumentBehandler,
  } = useAvlysningDocument(dialogmote);
  const { malform } = useMalform();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm<AvlysDialogmoteSkjemaValues>();

  const submit = (values: AvlysDialogmoteSkjemaValues) => {
    const avlysDto: AvlysDialogmoteDTO = {
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        avlysning: getAvlysningDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        avlysning: getAvlysningDocumentArbeidsgiver(values),
      },
    };

    if (dialogmote.behandler) {
      avlysDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        avlysning: getAvlysningDocumentBehandler(values),
      };
    }

    avlysDialogmote.mutate(avlysDto, {
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

  if (avlysDialogmote.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)}>
        <MalformRadioGroup />
        <div className="mb-8 flex flex-col">
          <Label size="small">{texts.gjelderTitle}</Label>
          {tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)}
        </div>
        <div className="mb-8">
          <TextareaField
            id="begrunnelseArbeidstaker"
            {...register("begrunnelseArbeidstaker", {
              maxLength: MAX_LENGTH_AVLYS_BEGRUNNELSE,
              required: texts.begrunnelseArbeidstakerMissing,
            })}
            value={watch("begrunnelseArbeidstaker")}
            error={errors.begrunnelseArbeidstaker?.message}
            label={texts.begrunnelseArbeidstakerLabel}
            maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
          />
          <Forhandsvisning
            title={texts.forhandsvisningArbeidstakerTitle}
            contentLabel={texts.forhandsvisningArbeidstakerContentlabel}
            getDocumentComponents={() =>
              getAvlysningDocumentArbeidstaker(getValues())
            }
          />
        </div>
        <div className="mb-8">
          <TextareaField
            id="begrunnelseArbeidsgiver"
            {...register("begrunnelseArbeidsgiver", {
              maxLength: MAX_LENGTH_AVLYS_BEGRUNNELSE,
              required: texts.begrunnelseArbeidsgiverMissing,
            })}
            value={watch("begrunnelseArbeidsgiver")}
            error={errors.begrunnelseArbeidsgiver?.message}
            label={texts.begrunnelseArbeidsgiverLabel}
            maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
          />
          <Forhandsvisning
            title={texts.forhandsvisningArbeidsgiverTitle}
            contentLabel={texts.forhandsvisningArbeidsgiverContentlabel}
            getDocumentComponents={() =>
              getAvlysningDocumentArbeidsgiver(getValues())
            }
          />
        </div>
        {dialogmote.behandler && (
          <div className="mb-8">
            <TextareaField
              id="begrunnelseBehandler"
              {...register("begrunnelseBehandler", {
                maxLength: MAX_LENGTH_AVLYS_BEGRUNNELSE,
                required: texts.begrunnelseBehandlerMissing,
              })}
              value={watch("begrunnelseBehandler")}
              error={errors.begrunnelseBehandler?.message}
              label={texts.begrunnelseBehandlerLabel}
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <Forhandsvisning
              title={texts.forhandsvisningBehandlerTitle}
              contentLabel={texts.forhandsvisningBehandlerContentlabel}
              getDocumentComponents={() =>
                getAvlysningDocumentBehandler(getValues())
              }
            />
          </div>
        )}
        {avlysDialogmote.isError && (
          <SkjemaInnsendingFeil error={avlysDialogmote.error} />
        )}
        <Alert variant="warning" size="small" className="mb-8 [&>*]:max-w-fit">
          {texts.alert}
        </Alert>
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            loading={avlysDialogmote.isPending}
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
    </Box>
  );
};

export default AvlysDialogmoteSkjema;

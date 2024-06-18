import React, { ReactElement, useState } from "react";
import { Form, FormSpy } from "react-final-form";
import arrayMutators from "final-form-arrays";
import Deltakere from "./Deltakere";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import {
  validerReferatDeltakere,
  validerSkjemaTekster,
} from "@/utils/valideringUtils";
import { useReferatDocument } from "@/hooks/dialogmote/document/useReferatDocument";
import { StandardTekst } from "@/data/dialogmote/dialogmoteTexts";
import {
  NewDialogmotedeltakerAnnenDTO,
  NewDialogmoteReferatDTO,
} from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { useFerdigstillDialogmote } from "@/data/dialogmote/useFerdigstillDialogmote";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMellomlagreReferat } from "@/data/dialogmote/useMellomlagreReferat";
import { useInitialValuesReferat } from "@/hooks/dialogmote/useInitialValuesReferat";
import { StandardTekster } from "@/sider/dialogmoter/components/referat/StandardTekster";
import { useEndreReferat } from "@/data/dialogmote/useEndreReferat";
import dayjs, { Dayjs } from "dayjs";
import { useDebouncedCallback } from "use-debounce";
import { FormState } from "final-form";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Alert, BodyShort, Box, Button, Heading, Link } from "@navikt/ds-react";
import { Link as RouterLink } from "react-router-dom";
import { MalformRadioGroup } from "@/components/MalformRadioGroup";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useMalform } from "@/context/malform/MalformContext";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { ReferatTextArea } from "@/sider/dialogmoter/components/referat/ReferatTextArea";
import {
  showTimeIncludingSeconds,
  tilDatoMedManedNavn,
} from "@/utils/datoUtils";
import { SaveFile } from "../../../../../img/ImageComponents";

export const MAX_LENGTH_SITUASJON = 6500;
export const MAX_LENGTH_KONKLUSJON = 1500;
export const MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE = 600;
export const MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE = 600;
export const MAX_LENGTH_BEHANDLERS_OPPGAVE = 600;
export const MAX_LENGTH_VEILEDERS_OPPGAVE = 600;
export const MAX_LENGTH_BEGRUNNELSE_ENDRING = 500;

export const texts = {
  save: "Lagre",
  send: "Lagre og send",
  abort: "Avbryt",
  digitalReferat:
    "Referatet formidles her på nav.no. Det er bare de arbeidstakerne som har reservert seg mot digital kommunikasjon, som vil få referatet i posten.",
  personvern:
    "Du må aldri skrive sensitive opplysninger om helse, diagnose, behandling og prognose. Dette gjelder også hvis arbeidstakeren er åpen om helsen og snakket om den i møtet. Se artikkel 9, Lov om behandling av personopplysninger. ",
  personvernLenketekst:
    "Du kan også lese mer om dette på Navet (åpnes i ny fane).",
  forhandsvisningContentLabel: "Forhåndsvis referat fra dialogmøte",
  referatSaved: "Referatet er lagret",
  fritekster: {
    situasjon: {
      label: "Situasjon og muligheter",
      description: "Skriv hva deltakerne forteller om situasjonen",
      infoboks: {
        eksempler: "Eksempler:",
        jobb: "Hvordan har det gått å prøve seg i jobb?",
        tilrettelegging: "Hvordan har tilretteleggingen fungert?",
        mer: "Er det noe mer som kan gjøres?",
        framover: "Hva ser man for seg framover?",
        husk: "Husk å skrive i du-form, referatet er rettet mot arbeidstakeren selv om det går til flere.",
      },
    },
    konklusjon: {
      label: "Konklusjon",
      description: "Gi en kort oppsummering",
      infoboks:
        "Konklusjonen og oppgavene nedenfor vil vises øverst i referatet.",
    },
    arbeidstaker: {
      label: "Arbeidstakerens oppgave:",
      description: "Hva avtalte dere at arbeidstakeren skal gjøre?",
      infoboks: "Husk å skrive i du-form i feltet om arbeidstakerens oppgave.",
    },
    arbeidsgiver: {
      label: "Arbeidsgiverens oppgave:",
      description: "Hva avtalte dere at arbeidsgiveren skal gjøre?",
    },
    begrunnelseEndring: {
      label: "Årsaken til at referatet må endres",
      description: "Fortell hva som er årsaken til at referatet må endres",
      infoboks:
        "Det er viktig å oppgi årsak til endringen slik at alle møtedeltakerne blir informert. Det er også viktig i videre oppfølging.",
    },
    veileder: {
      label: "Veilederens oppgave (valgfri):",
      description: "Hva avtalte dere at du skal gjøre?",
    },
    behandler: {
      label: "Behandlerens oppgave (valgfri):",
      description: "Hva avtalte dere at behandleren skal gjøre?",
    },
  },
};

const personvernUrl =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-arbeidsrettet-brukeroppfolging/SitePages/Sykmeldt-med-arbeidsgiver-%E2%80%93-avholde-dialogm%C3%B8te.aspx";

export const valideringsTexts = {
  situasjonMissing: "Vennligst angi situasjon og muligheter",
  konklusjonMissing: "Vennligst angi konklusjon",
  arbeidstakersOppgaveMissing: "Vennligst angi arbeidstakerens oppgave",
  arbeidsgiversOppgaveMissing: "Vennligst angi arbeidsgiverens oppgave",
  begrunnelseEndringMissing:
    "Vennligst angi årsaken til at referatet må endres",
};

export enum ReferatMode {
  NYTT,
  ENDRET,
}

interface ReferatSkjemaTekster {
  situasjon: string;
  konklusjon: string;
  arbeidstakersOppgave: string;
  arbeidsgiversOppgave: string;
  behandlersOppgave?: string;
  veiledersOppgave: string;
  begrunnelseEndring?: string;
}

export interface ReferatSkjemaValues extends ReferatSkjemaTekster {
  naermesteLeder: string;
  standardtekster: StandardTekst[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
  behandlerDeltatt?: boolean;
  behandlerMottarReferat?: boolean;
}

interface ReferatProps {
  dialogmote: DialogmoteDTO;
  mode: ReferatMode;
}

const toNewReferat = (
  dialogmote: DialogmoteDTO,
  values: Partial<ReferatSkjemaValues>,
  getReferatDocument: (
    values: Partial<ReferatSkjemaValues>
  ) => DocumentComponentDto[]
): NewDialogmoteReferatDTO => ({
  narmesteLederNavn: values.naermesteLeder ?? "",
  situasjon: values.situasjon ?? "",
  konklusjon: values.konklusjon ?? "",
  arbeidsgiverOppgave: values.arbeidsgiversOppgave ?? "",
  arbeidstakerOppgave: values.arbeidstakersOppgave ?? "",
  ...(dialogmote.behandler
    ? {
        behandlerOppgave: values.behandlersOppgave,
        behandlerDeltatt: values.behandlerDeltatt,
        behandlerMottarReferat: values.behandlerMottarReferat,
      }
    : {}),
  ...(values.begrunnelseEndring
    ? {
        begrunnelseEndring: values.begrunnelseEndring,
      }
    : {}),
  veilederOppgave: values.veiledersOppgave,
  document: getReferatDocument(values),
  andreDeltakere: values.andreDeltakere || [],
});

const Referat = ({ dialogmote, mode }: ReferatProps): ReactElement => {
  const navbruker = useNavBrukerData();
  const ferdigstillDialogmote = useFerdigstillDialogmote(dialogmote.uuid);
  const mellomlagreReferat = useMellomlagreReferat(dialogmote.uuid);
  const endreReferat = useEndreReferat(dialogmote.uuid);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<Dayjs>(dayjs());
  const [uendretSidenMellomlagring, setUendretSidenMellomlagring] = useState<
    boolean | undefined
  >();

  const dateAndTimeForMeeting = tilDatoMedManedNavn(dialogmote.tid);
  const header = `${navbruker?.navn}, ${dateAndTimeForMeeting}, ${dialogmote.sted}`;
  const isEndringAvReferat = mode === ReferatMode.ENDRET;

  const { getReferatDocument } = useReferatDocument(dialogmote, mode);
  const { malform } = useMalform();

  const isSendingReferat = () => {
    return ferdigstillDialogmote.isPending || endreReferat.isPending;
  };

  const validate = (values: Partial<ReferatSkjemaValues>) => {
    const friteksterFeil = validerSkjemaTekster<ReferatSkjemaTekster>({
      situasjon: {
        value: values.situasjon || "",
        maxLength: MAX_LENGTH_SITUASJON,
        missingRequiredMessage: valideringsTexts.situasjonMissing,
      },
      konklusjon: {
        value: values.konklusjon || "",
        maxLength: MAX_LENGTH_KONKLUSJON,
        missingRequiredMessage: valideringsTexts.konklusjonMissing,
      },
      arbeidstakersOppgave: {
        value: values.arbeidstakersOppgave || "",
        maxLength: MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
        missingRequiredMessage: valideringsTexts.arbeidstakersOppgaveMissing,
      },
      arbeidsgiversOppgave: {
        value: values.arbeidsgiversOppgave || "",
        maxLength: MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
        missingRequiredMessage: valideringsTexts.arbeidsgiversOppgaveMissing,
      },
      ...(dialogmote.behandler
        ? {
            behandlersOppgave: {
              value: values.behandlersOppgave || "",
              maxLength: MAX_LENGTH_BEHANDLERS_OPPGAVE,
            },
          }
        : {}),
      veiledersOppgave: {
        value: values.veiledersOppgave || "",
        maxLength: MAX_LENGTH_VEILEDERS_OPPGAVE,
      },
      ...(isEndringAvReferat
        ? {
            begrunnelseEndring: {
              value: values.begrunnelseEndring || "",
              maxLength: MAX_LENGTH_BEGRUNNELSE_ENDRING,
              missingRequiredMessage:
                valideringsTexts.begrunnelseEndringMissing,
            },
          }
        : {}),
    });

    return {
      ...validerReferatDeltakere(values),
      ...friteksterFeil,
    };
  };

  const submit = (values: ReferatSkjemaValues) => {
    const newDialogmoteReferatDTO = toNewReferat(
      dialogmote,
      values,
      getReferatDocument
    );
    if (isEndringAvReferat) {
      endreReferat.mutate(newDialogmoteReferatDTO);
    } else {
      ferdigstillDialogmote.mutate(newDialogmoteReferatDTO);
    }
    Amplitude.logEvent({
      type: EventType.OptionSelected,
      data: {
        url: window.location.href,
        tekst: "Målform valgt",
        option: malform,
      },
    });
  };

  const isNullOrEmpty = (value?: string | undefined) => {
    return !value || value === "";
  };

  const isEmptyReferat = (values: ReferatSkjemaValues) => {
    return (
      (!values.standardtekster || values.standardtekster.length === 0) &&
      isNullOrEmpty(values.situasjon) &&
      isNullOrEmpty(values.konklusjon) &&
      isNullOrEmpty(values.arbeidstakersOppgave) &&
      isNullOrEmpty(values.arbeidsgiversOppgave) &&
      isNullOrEmpty(values.behandlersOppgave) &&
      isNullOrEmpty(values.veiledersOppgave) &&
      isNullOrEmpty(values.begrunnelseEndring)
    );
  };

  const mellomlagre = (values: ReferatSkjemaValues) => {
    mellomlagreReferat.mutate(
      toNewReferat(dialogmote, values, getReferatDocument),
      {
        onSuccess: () => {
          setUendretSidenMellomlagring(true);
          setShowToast(true);
          setLastSavedTime(dayjs());
        },
        onError: () => setShowToast(false),
      }
    );
  };

  const debouncedAutoSave = useDebouncedCallback(
    (values: ReferatSkjemaValues) => {
      if (!isSendingReferat() && !isEmptyReferat(values)) {
        mellomlagre(values);
      }
    },
    5000,
    { maxWait: 20000 }
  );

  const handleLagreClick = (values: ReferatSkjemaValues) => {
    debouncedAutoSave.cancel();
    mellomlagre(values);
  };

  const savedReferatText = (savedDate: Date) => {
    return `${texts.referatSaved} ${showTimeIncludingSeconds(savedDate)}`;
  };

  const initialValues = useInitialValuesReferat(dialogmote);

  if (ferdigstillDialogmote.isSuccess || endreReferat.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <Box background="surface-default" padding="4">
      <Form
        onSubmit={submit}
        validate={validate}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
      >
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <FormSpy
              subscription={{ values: true }}
              onChange={(formState: FormState<ReferatSkjemaValues>) => {
                setUendretSidenMellomlagring(false);
                debouncedAutoSave(formState.values);
              }}
            />
            <Heading size="large" className="mb-8">
              {header}
            </Heading>
            <Alert variant="info" size="small" className="mb-8 [&>*]:max-w-fit">
              {texts.digitalReferat}
            </Alert>
            <Deltakere behandler={dialogmote.behandler} />
            <Alert
              variant="warning"
              size="small"
              inline
              className="mb-8 [&>*]:max-w-fit"
            >
              {texts.personvern}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={personvernUrl}
              >
                {texts.personvernLenketekst}
              </Link>
            </Alert>
            <MalformRadioGroup />
            {showToast && (
              <div className="mb-4 font-bold flex gap-2">
                <img src={SaveFile} alt="saved" />
                <span>{savedReferatText(lastSavedTime.toDate())}</span>
              </div>
            )}
            <div className="flex flex-col gap-8 mb-8">
              {mode === ReferatMode.ENDRET && (
                <ReferatTextArea
                  field="begrunnelseEndring"
                  label={texts.fritekster.begrunnelseEndring.label}
                  description={texts.fritekster.begrunnelseEndring.description}
                  maxLength={MAX_LENGTH_BEGRUNNELSE_ENDRING}
                  minRows={8}
                  infoBox={texts.fritekster.begrunnelseEndring.infoboks}
                />
              )}
              <ReferatTextArea
                field="situasjon"
                label={texts.fritekster.situasjon.label}
                description={texts.fritekster.situasjon.description}
                maxLength={MAX_LENGTH_SITUASJON}
                minRows={12}
                infoBox={Object.values(texts.fritekster.situasjon.infoboks).map(
                  (text, index) => (
                    <BodyShort key={index} size="small">
                      {text}
                    </BodyShort>
                  )
                )}
              />
              <ReferatTextArea
                field="konklusjon"
                label={texts.fritekster.konklusjon.label}
                description={texts.fritekster.konklusjon.description}
                maxLength={MAX_LENGTH_KONKLUSJON}
                minRows={8}
                infoBox={texts.fritekster.konklusjon.infoboks}
              />
              <ReferatTextArea
                field="arbeidstakersOppgave"
                label={texts.fritekster.arbeidstaker.label}
                description={texts.fritekster.arbeidstaker.description}
                maxLength={MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE}
                minRows={4}
                infoBox={texts.fritekster.arbeidstaker.infoboks}
              />
              <ReferatTextArea
                field="arbeidsgiversOppgave"
                label={texts.fritekster.arbeidsgiver.label}
                description={texts.fritekster.arbeidsgiver.description}
                maxLength={MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE}
                minRows={4}
              />
              {dialogmote.behandler && (
                <ReferatTextArea
                  field="behandlersOppgave"
                  label={texts.fritekster.behandler.label}
                  description={texts.fritekster.behandler.description}
                  maxLength={MAX_LENGTH_BEHANDLERS_OPPGAVE}
                  minRows={4}
                />
              )}
              <ReferatTextArea
                field="veiledersOppgave"
                label={texts.fritekster.veileder.label}
                description={texts.fritekster.veileder.description}
                maxLength={MAX_LENGTH_VEILEDERS_OPPGAVE}
                minRows={4}
              />
            </div>
            <StandardTekster />
            <div className="mb-8">
              <Forhandsvisning
                contentLabel={texts.forhandsvisningContentLabel}
                getDocumentComponents={() => getReferatDocument(values)}
              />
            </div>
            {ferdigstillDialogmote.isError && (
              <SkjemaInnsendingFeil error={ferdigstillDialogmote.error} />
            )}
            {endreReferat.isError && (
              <SkjemaInnsendingFeil error={endreReferat.error} />
            )}
            {mellomlagreReferat.isError && (
              <SkjemaInnsendingFeil error={mellomlagreReferat.error} />
            )}
            {mellomlagreReferat.isSuccess && uendretSidenMellomlagring && (
              <Alert variant="success" size="small">
                {savedReferatText(lastSavedTime.toDate())}
              </Alert>
            )}
            <div className="flex gap-4 pt-12">
              <Button
                type="button"
                variant="secondary"
                loading={mellomlagreReferat.isPending}
                onClick={() => handleLagreClick(values)}
              >
                {texts.save}
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSendingReferat()}
                onClick={() => debouncedAutoSave.cancel()}
              >
                {texts.send}
              </Button>
              <Button
                as={RouterLink}
                type="button"
                variant="tertiary"
                to={moteoversiktRoutePath}
              >
                {texts.abort}
              </Button>
            </div>
          </form>
        )}
      </Form>
    </Box>
  );
};

export default Referat;

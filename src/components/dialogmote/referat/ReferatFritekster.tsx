import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import React, { ReactElement } from "react";
import { ReferatInfoColumn } from "@/components/dialogmote/referat/ReferatInfoColumn";
import { Field } from "react-final-form";
import { ReferatMode } from "@/components/dialogmote/referat/Referat";
import { BodyShort, Textarea } from "@navikt/ds-react";

export const MAX_LENGTH_SITUASJON = 6500;
export const MAX_LENGTH_KONKLUSJON = 1500;
export const MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE = 600;
export const MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE = 600;
export const MAX_LENGTH_BEHANDLERS_OPPGAVE = 600;
export const MAX_LENGTH_VEILEDERS_OPPGAVE = 600;
export const MAX_LENGTH_BEGRUNNELSE_ENDRING = 500;

const texts = {
  situasjon: {
    label: "Situasjon og muligheter",
    placeholder: "Skriv hva deltakerne forteller om situasjonen",
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
    placeholder: "Gi en kort oppsummering",
    infoboks:
      "Konklusjonen og oppgavene nedenfor vil vises øverst i referatet.",
  },
  arbeidstaker: {
    label: "Arbeidstakerens oppgave:",
    placeholder: "Hva avtalte dere at arbeidstakeren skal gjøre?",
    infoboks: "Husk å skrive i du-form i feltet om arbeidstakerens oppgave.",
  },
  arbeidsgiver: {
    label: "Arbeidsgiverens oppgave:",
    placeholder: "Hva avtalte dere at arbeidsgiveren skal gjøre?",
  },
  behandler: {
    label: "Behandlerens oppgave (valgfri):",
    placeholder: "Hva avtalte dere at behandleren skal gjøre?",
  },
  veileder: {
    label: "Veilederens oppgave (valgfri):",
    placeholder: "Hva avtalte dere at du skal gjøre?",
  },
  begrunnelseEndring: {
    label: "Årsaken til at referatet må endres",
    placeholder: "Fortell hva som er årsaken til at referatet må endres",
    infoboks:
      "Det er viktig å oppgi årsak til endringen slik at alle møtedeltakerne blir informert. Det er også viktig i videre oppfølging.",
  },
};

const BegrunnelseEndring = (): ReactElement => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName="begrunnelseEndring"
      label={texts.begrunnelseEndring.label}
      placeholder={texts.begrunnelseEndring.placeholder}
      maxLength={MAX_LENGTH_BEGRUNNELSE_ENDRING}
      minRows={8}
    />
    <ReferatInfoColumn>{texts.begrunnelseEndring.infoboks}</ReferatInfoColumn>
  </div>
);

const Situasjon = (): ReactElement => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName="situasjon"
      label={texts.situasjon.label}
      placeholder={texts.situasjon.placeholder}
      maxLength={MAX_LENGTH_SITUASJON}
      minRows={12}
    />
    <ReferatInfoColumn>
      <BodyShort size="small">{texts.situasjon.infoboks.eksempler}</BodyShort>
      <BodyShort size="small">{texts.situasjon.infoboks.jobb}</BodyShort>
      <BodyShort size="small">
        {texts.situasjon.infoboks.tilrettelegging}
      </BodyShort>
      <BodyShort size="small">{texts.situasjon.infoboks.mer}</BodyShort>
      <BodyShort size="small">{texts.situasjon.infoboks.framover}</BodyShort>
      <br />
      <BodyShort size="small">{texts.situasjon.infoboks.husk}</BodyShort>
    </ReferatInfoColumn>
  </div>
);

const Konklusjon = (): ReactElement => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName="konklusjon"
      label={texts.konklusjon.label}
      placeholder={texts.konklusjon.placeholder}
      maxLength={MAX_LENGTH_KONKLUSJON}
      minRows={8}
    />
    <ReferatInfoColumn>{texts.konklusjon.infoboks}</ReferatInfoColumn>
  </div>
);

const ArbeidstakersOppgave = (): ReactElement => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName="arbeidstakersOppgave"
      label={texts.arbeidstaker.label}
      placeholder={texts.arbeidstaker.placeholder}
      maxLength={MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE}
      minRows={4}
    />
    <ReferatInfoColumn>{texts.arbeidstaker.infoboks}</ReferatInfoColumn>
  </div>
);

const ArbeidsgiversOppgave = (): ReactElement => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName="arbeidsgiversOppgave"
      label={texts.arbeidsgiver.label}
      placeholder={texts.arbeidsgiver.placeholder}
      maxLength={MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE}
      minRows={4}
    />
    <ReferatInfoColumn />
  </div>
);

const BehandlersOppgave = () => (
  <div className="flex mb-8">
    <ReferatTextareaFieldColumn
      fieldName={"behandlersOppgave"}
      label={texts.behandler.label}
      placeholder={texts.behandler.placeholder}
      maxLength={MAX_LENGTH_BEHANDLERS_OPPGAVE}
      minRows={4}
    />
    <ReferatInfoColumn />
  </div>
);

const VeiledersOppgave = (): ReactElement => (
  <div className="flex mb-12">
    <ReferatTextareaFieldColumn
      fieldName={"veiledersOppgave"}
      label={texts.veileder.label}
      placeholder={texts.veileder.placeholder}
      maxLength={MAX_LENGTH_VEILEDERS_OPPGAVE}
      minRows={4}
    />
    <ReferatInfoColumn />
  </div>
);

interface ReferatTextareaColumnProps
  extends React.ComponentPropsWithRef<typeof Textarea> {
  fieldName: string;
}

const ReferatTextareaFieldColumn = ({
  fieldName,
  ...rest
}: ReferatTextareaColumnProps): ReactElement => (
  <div className="flex-1 mr-8">
    <Field<string> name={fieldName}>
      {({ input, meta }) => (
        <Textarea
          size="small"
          error={meta.submitFailed && meta.error}
          id={fieldName}
          {...input}
          {...rest}
        />
      )}
    </Field>
  </div>
);

interface ReferatTeksterProps {
  dialogmote: DialogmoteDTO;
  mode: ReferatMode;
}

export const ReferatFritekster = ({
  dialogmote,
  mode,
}: ReferatTeksterProps) => (
  <>
    {mode === ReferatMode.ENDRET && <BegrunnelseEndring />}
    <Situasjon />
    <Konklusjon />
    <ArbeidstakersOppgave />
    <ArbeidsgiversOppgave />
    {dialogmote.behandler && <BehandlersOppgave />}
    <VeiledersOppgave />
  </>
);

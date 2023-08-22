import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import React, { ReactElement } from "react";
import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import { ReferatInfoColumn } from "@/components/dialogmote/referat/ReferatInfoColumn";
import { Normaltekst } from "nav-frontend-typografi";
import styled from "styled-components";
import { Field } from "react-final-form";
import Fritekst, { FritekstSize } from "@/components/Fritekst";
import { ReferatMode } from "@/components/dialogmote/referat/Referat";

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
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      fieldName="begrunnelseEndring"
      size="stor"
      label={texts.begrunnelseEndring.label}
      placeholder={texts.begrunnelseEndring.placeholder}
      maxLength={MAX_LENGTH_BEGRUNNELSE_ENDRING}
    />
    <ReferatInfoColumn>
      <Normaltekst>{texts.begrunnelseEndring.infoboks}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);

const Situasjon = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="ekstra-stor"
      fieldName="situasjon"
      label={texts.situasjon.label}
      placeholder={texts.situasjon.placeholder}
      maxLength={MAX_LENGTH_SITUASJON}
    />
    <ReferatInfoColumn>
      <Normaltekst>{texts.situasjon.infoboks.eksempler}</Normaltekst>
      <Normaltekst>{texts.situasjon.infoboks.jobb}</Normaltekst>
      <Normaltekst>{texts.situasjon.infoboks.tilrettelegging}</Normaltekst>
      <Normaltekst>{texts.situasjon.infoboks.mer}</Normaltekst>
      <Normaltekst>{texts.situasjon.infoboks.framover}</Normaltekst>
      <br />
      <Normaltekst>{texts.situasjon.infoboks.husk}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);

const Konklusjon = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="stor"
      fieldName="konklusjon"
      label={texts.konklusjon.label}
      placeholder={texts.konklusjon.placeholder}
      maxLength={MAX_LENGTH_KONKLUSJON}
    />
    <ReferatInfoColumn>
      <Normaltekst>{texts.konklusjon.infoboks}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);

const ArbeidstakersOppgave = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="medium"
      fieldName="arbeidstakersOppgave"
      label={texts.arbeidstaker.label}
      placeholder={texts.arbeidstaker.placeholder}
      maxLength={MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE}
    />
    <ReferatInfoColumn>
      <Normaltekst>{texts.arbeidstaker.infoboks}</Normaltekst>
    </ReferatInfoColumn>
  </FlexRow>
);

const ArbeidsgiversOppgave = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="medium"
      fieldName="arbeidsgiversOppgave"
      label={texts.arbeidsgiver.label}
      placeholder={texts.arbeidsgiver.placeholder}
      maxLength={MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE}
    />
    <ReferatInfoColumn />
  </FlexRow>
);

const BehandlersOppgave = () => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="medium"
      fieldName={"behandlersOppgave"}
      label={texts.behandler.label}
      placeholder={texts.behandler.placeholder}
      maxLength={MAX_LENGTH_BEHANDLERS_OPPGAVE}
    />
    <ReferatInfoColumn />
  </FlexRow>
);

const VeiledersOppgave = (): ReactElement => (
  <FlexRow bottomPadding={PaddingSize.LG}>
    <ReferatTextareaFieldColumn
      size="medium"
      fieldName={"veiledersOppgave"}
      label={texts.veileder.label}
      placeholder={texts.veileder.placeholder}
      maxLength={MAX_LENGTH_VEILEDERS_OPPGAVE}
    />
    <ReferatInfoColumn />
  </FlexRow>
);

const TextAreaColumn = styled(FlexColumn)`
  margin-right: 2em;
`;

interface ReferatTextareaColumnProps {
  fieldName: string;
  size: FritekstSize;
  label: string;
  placeholder: string;
  maxLength: number;
}

const ReferatTextareaFieldColumn = ({
  fieldName,
  size,
  ...rest
}: ReferatTextareaColumnProps): ReactElement => (
  <TextAreaColumn flex={1}>
    <Field<string> name={fieldName}>
      {({ input, meta }) => (
        <Fritekst
          size={size}
          feil={meta.submitFailed && meta.error}
          id={fieldName}
          {...input}
          {...rest}
        />
      )}
    </Field>
  </TextAreaColumn>
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

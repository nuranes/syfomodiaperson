import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Field, useFormState } from "react-final-form";
import styled from "styled-components";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { AndreDeltakere } from "./AndreDeltakere";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { behandlerDeltokTekst } from "@/utils/behandlerUtils";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import {
  PersonIcon,
  PersonPencilIcon,
  PersonSuitIcon,
} from "@navikt/aksel-icons";
import { MedisinskrinImage } from "../../../../img/ImageComponents";
import { Checkbox, ExpansionCard, Heading, TextField } from "@navikt/ds-react";

export const texts = {
  title: "Deltakere i møtet",
  arbeidsgiverLabel: "Navn",
  arbeidsgiverTekst:
    "Referatet sendes alltid ut til personen som er registrert som nærmeste leder i Altinn, uavhengig av hvem som deltok i møtet.",
  behandlerTekst:
    "Behandler var innkalt til dette møtet, men hvis behandler likevel ikke møtte opp bør det nevnes i referatet slik at deltakerlisten blir riktig.",
  behandlerDeltokLabel: "Behandleren deltok i møtet",
  behandlerMottaReferatLabel: "Behandleren skal motta referatet",
  behandlerReferatSamtykke:
    "Dersom behandleren ikke deltok i møtet, men likevel ønsker å motta referat, krever det et samtykke fra arbeidstakeren.",
};

const deltakerIconProps = {
  role: "img",
  focusable: false,
  width: 24,
  height: 24,
};

interface DeltakerEkspanderbartPanelProps {
  ariaLabel: string;
  tittel: ReactNode;
  children: ReactNode;
  harValideringsfeil?: boolean;
}

const DeltakerEkspanderbartPanel = ({
  ariaLabel,
  tittel,
  children,
  harValideringsfeil,
}: DeltakerEkspanderbartPanelProps) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (harValideringsfeil) {
      setOpen(true);
    }
  }, [harValideringsfeil]);

  return (
    <ExpansionCard
      className="mb-2"
      size="small"
      open={open}
      onToggle={() => setOpen(!open)}
      aria-label={ariaLabel}
    >
      <ExpansionCard.Header>{tittel}</ExpansionCard.Header>
      <ExpansionCard.Content>{children}</ExpansionCard.Content>
    </ExpansionCard>
  );
};

interface DeltakerTekstProps {
  color?: string;
}

const DeltakerTekst = styled(Heading)<DeltakerTekstProps>`
  margin-left: 0.5em;
  ${(props) =>
    props.color && {
      color: props.color,
    }};
`;

interface DeltakerBehandlerProps {
  behandler: DialogmotedeltakerBehandlerDTO;
}

const DeltakerBehandler = ({ behandler }: DeltakerBehandlerProps) => {
  const {
    values: { behandlerDeltatt },
  } = useFormState<ReferatSkjemaValues>();
  const tittelTekst = behandlerDeltokTekst(behandler, behandlerDeltatt);

  return (
    <DeltakerEkspanderbartPanel
      ariaLabel={tittelTekst}
      tittel={
        <FlexRow>
          <img
            src={MedisinskrinImage}
            alt="Medisinskrin-ikon"
            {...deltakerIconProps}
          />
          <DeltakerTekst size="small">{tittelTekst}</DeltakerTekst>
        </FlexRow>
      }
    >
      <FlexRow topPadding={PaddingSize.SM}>{texts.behandlerTekst}</FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Field name="behandlerDeltatt" type="checkbox">
          {({ input }) => (
            <Checkbox size="small" {...input}>
              {texts.behandlerDeltokLabel}
            </Checkbox>
          )}
        </Field>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Field name="behandlerMottarReferat" type="checkbox">
          {({ input }) => (
            <Checkbox size="small" {...input}>
              {texts.behandlerMottaReferatLabel}
            </Checkbox>
          )}
        </Field>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        {texts.behandlerReferatSamtykke}
      </FlexRow>
    </DeltakerEkspanderbartPanel>
  );
};

const DeltakerArbeidsgiver = () => {
  return (
    <Field<string> name="naermesteLeder">
      {({ input, meta }) => {
        const harValideringsfeil = meta.submitFailed && !!meta.error;
        const tittelFarge = harValideringsfeil
          ? "var(--a-text-danger)"
          : undefined;
        const tittelTekst = `Fra arbeidsgiver: ${input.value || ""}`;

        return (
          <DeltakerEkspanderbartPanel
            ariaLabel={tittelTekst}
            harValideringsfeil={harValideringsfeil}
            tittel={
              <FlexRow>
                <PersonSuitIcon {...deltakerIconProps} color={tittelFarge} />
                <DeltakerTekst size="small" color={tittelFarge}>
                  {tittelTekst}
                </DeltakerTekst>
              </FlexRow>
            }
          >
            <FlexRow topPadding={PaddingSize.SM}>
              <FlexColumn flex={0.5}>
                <TextField
                  {...input}
                  id="naermesteLeder"
                  label={texts.arbeidsgiverLabel}
                  error={meta.submitFailed && meta.error}
                  type="text"
                  size="small"
                />
              </FlexColumn>
            </FlexRow>
            <FlexRow topPadding={PaddingSize.MD}>
              {texts.arbeidsgiverTekst}
            </FlexRow>
          </DeltakerEkspanderbartPanel>
        );
      }}
    </Field>
  );
};

interface DeltakereProps {
  behandler: DialogmotedeltakerBehandlerDTO | undefined;
}

const Deltakere = ({ behandler }: DeltakereProps): ReactElement => {
  const navbruker = useNavBrukerData();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();

  return (
    <div className="mb-16">
      <Heading size="medium" className="mb-4">
        {texts.title}
      </Heading>
      <FlexRow leftPadding={PaddingSize.SM} bottomPadding={PaddingSize.MD}>
        <PersonIcon {...deltakerIconProps} />
        <DeltakerTekst size="small">{`Arbeidstaker: ${navbruker?.navn}`}</DeltakerTekst>
      </FlexRow>
      <FlexRow leftPadding={PaddingSize.SM} bottomPadding={PaddingSize.MD}>
        <PersonPencilIcon {...deltakerIconProps} />
        <DeltakerTekst size="small">{`Fra NAV: ${veilederinfo?.navn}`}</DeltakerTekst>
      </FlexRow>
      <DeltakerArbeidsgiver />
      {behandler && <DeltakerBehandler behandler={behandler} />}
      <AndreDeltakere />
    </div>
  );
};

export default Deltakere;

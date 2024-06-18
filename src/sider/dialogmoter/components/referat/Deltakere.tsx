import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Field, useFormState } from "react-final-form";
import styled from "styled-components";
import { AndreDeltakere } from "./AndreDeltakere";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { behandlerDeltokTekst } from "@/utils/behandlerUtils";
import { ReferatSkjemaValues } from "@/sider/dialogmoter/components/referat/Referat";
import {
  PersonIcon,
  PersonPencilIcon,
  PersonSuitIcon,
} from "@navikt/aksel-icons";
import {
  BodyLong,
  Checkbox,
  ExpansionCard,
  Heading,
  TextField,
} from "@navikt/ds-react";
import { MedisinskrinImage } from "../../../../../img/ImageComponents";

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

interface DeltakerHeadingProps {
  color?: string;
}

const DeltakerHeading = styled(Heading)<DeltakerHeadingProps>`
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
        <div className="flex gap-2">
          <img
            src={MedisinskrinImage}
            alt="Medisinskrin-ikon"
            {...deltakerIconProps}
          />
          <Heading size="small">{tittelTekst}</Heading>
        </div>
      }
    >
      <div className="flex flex-col gap-4 mt-4 mb-4">
        <BodyLong size="small">{texts.behandlerTekst}</BodyLong>
        <Field name="behandlerDeltatt" type="checkbox">
          {({ input }) => (
            <Checkbox size="small" {...input}>
              {texts.behandlerDeltokLabel}
            </Checkbox>
          )}
        </Field>
        <Field name="behandlerMottarReferat" type="checkbox">
          {({ input }) => (
            <Checkbox size="small" {...input}>
              {texts.behandlerMottaReferatLabel}
            </Checkbox>
          )}
        </Field>
        <BodyLong size="small">{texts.behandlerReferatSamtykke}</BodyLong>
      </div>
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
              <div className="flex gap-2">
                <PersonSuitIcon {...deltakerIconProps} color={tittelFarge} />
                <DeltakerHeading size="small" color={tittelFarge}>
                  {tittelTekst}
                </DeltakerHeading>
              </div>
            }
          >
            <div className="flex flex-col gap-8 mt-4">
              <TextField
                className="w-2/4"
                {...input}
                id="naermesteLeder"
                label={texts.arbeidsgiverLabel}
                error={meta.submitFailed && meta.error}
                type="text"
                size="small"
              />
              <BodyLong size="small">{texts.arbeidsgiverTekst}</BodyLong>
            </div>
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
    <div className="flex flex-col gap-4 mb-16">
      <Heading size="medium">{texts.title}</Heading>
      <div className="flex pl-4 gap-2">
        <PersonIcon {...deltakerIconProps} />
        <Heading size="small">{`Arbeidstaker: ${navbruker?.navn}`}</Heading>
      </div>
      <div className="flex pl-4 gap-2">
        <PersonPencilIcon {...deltakerIconProps} />
        <Heading size="small">
          {`Fra NAV: ${veilederinfo?.fulltNavn()}`}
        </Heading>
      </div>
      <DeltakerArbeidsgiver />
      {behandler && <DeltakerBehandler behandler={behandler} />}
      <AndreDeltakere />
    </div>
  );
};

export default Deltakere;

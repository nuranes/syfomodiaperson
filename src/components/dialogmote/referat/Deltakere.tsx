import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import { Field, useFormState } from "react-final-form";
import styled from "styled-components";
import { Checkbox, Input } from "nav-frontend-skjema";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { AndreDeltakere } from "./AndreDeltakere";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { behandlerDeltokTekst } from "@/utils/behandlerUtils";
import { EkspanderbartpanelBase } from "nav-frontend-ekspanderbartpanel";
import navFarger from "nav-frontend-core";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import {
  PersonIcon,
  PersonPencilIcon,
  PersonSuitIcon,
} from "@navikt/aksel-icons";
import { MedisinskrinImage } from "../../../../img/ImageComponents";

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

const DeltakereBoks = styled.div`
  margin-bottom: 4em;
`;

const Header = styled(Systemtittel)`
  margin-bottom: 1.5em;
`;

const deltakerIconProps = {
  role: "img",
  focusable: false,
  width: 24,
  height: 24,
};

const StyledEkspanderbartpanel = styled(EkspanderbartpanelBase)`
  margin-bottom: 0.5em;
  border: 1px solid ${navFarger.navGra60};
`;

interface DeltakerEkspanderbartPanelProps {
  tittel: ReactNode;
  children: ReactNode;
  harValideringsfeil?: boolean;
}

const DeltakerEkspanderbartPanel = ({
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
    <StyledEkspanderbartpanel
      renderContentWhenClosed
      apen={open}
      onClick={() => setOpen(!open)}
      tittel={tittel}
    >
      {children}
    </StyledEkspanderbartpanel>
  );
};

interface DeltakerTekstProps {
  color?: string;
}

const DeltakerTekst = styled(Undertittel)<DeltakerTekstProps>`
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

  return (
    <DeltakerEkspanderbartPanel
      tittel={
        <FlexRow>
          <img
            src={MedisinskrinImage}
            alt="Medisinskrin-ikon"
            {...deltakerIconProps}
          />
          <DeltakerTekst>
            {behandlerDeltokTekst(behandler, behandlerDeltatt)}
          </DeltakerTekst>
        </FlexRow>
      }
    >
      <FlexRow topPadding={PaddingSize.SM}>
        <Normaltekst>{texts.behandlerTekst}</Normaltekst>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Field name="behandlerDeltatt" type="checkbox">
          {({ input }) => (
            <Checkbox {...input} label={texts.behandlerDeltokLabel} />
          )}
        </Field>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Field name="behandlerMottarReferat" type="checkbox">
          {({ input }) => (
            <Checkbox {...input} label={texts.behandlerMottaReferatLabel} />
          )}
        </Field>
      </FlexRow>
      <FlexRow topPadding={PaddingSize.MD}>
        <Normaltekst>{texts.behandlerReferatSamtykke}</Normaltekst>
      </FlexRow>
    </DeltakerEkspanderbartPanel>
  );
};

const DeltakerArbeidsgiver = () => {
  return (
    <Field<string> name="naermesteLeder">
      {({ input, meta }) => {
        const harValideringsfeil = meta.submitFailed && !!meta.error;
        const tittelFarge = harValideringsfeil ? navFarger.redError : undefined;

        return (
          <DeltakerEkspanderbartPanel
            harValideringsfeil={harValideringsfeil}
            tittel={
              <FlexRow>
                <PersonSuitIcon {...deltakerIconProps} color={tittelFarge} />
                <DeltakerTekst color={tittelFarge}>{`Fra arbeidsgiver: ${
                  input.value || ""
                }`}</DeltakerTekst>
              </FlexRow>
            }
          >
            <FlexRow topPadding={PaddingSize.SM}>
              <FlexColumn flex={0.5}>
                <Input
                  {...input}
                  id="naermesteLeder"
                  label={texts.arbeidsgiverLabel}
                  feil={meta.submitFailed && meta.error}
                />
              </FlexColumn>
            </FlexRow>
            <FlexRow topPadding={PaddingSize.MD}>
              <Normaltekst>{texts.arbeidsgiverTekst}</Normaltekst>
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
    <DeltakereBoks>
      <Header>{texts.title}</Header>
      <FlexRow leftPadding={PaddingSize.SM} bottomPadding={PaddingSize.MD}>
        <PersonIcon {...deltakerIconProps} />
        <DeltakerTekst>{`Arbeidstaker: ${navbruker?.navn}`}</DeltakerTekst>
      </FlexRow>
      <FlexRow leftPadding={PaddingSize.SM} bottomPadding={PaddingSize.MD}>
        <PersonPencilIcon {...deltakerIconProps} />
        <DeltakerTekst>{`Fra NAV: ${veilederinfo?.navn}`}</DeltakerTekst>
      </FlexRow>
      <DeltakerArbeidsgiver />
      {behandler && <DeltakerBehandler behandler={behandler} />}
      <AndreDeltakere />
    </DeltakereBoks>
  );
};

export default Deltakere;

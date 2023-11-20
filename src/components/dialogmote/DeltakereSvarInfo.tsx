import {
  DialogmotedeltakerBehandlerDTO,
  DialogmotedeltakerBehandlerVarselSvarDTO,
  DialogmotedeltakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { FlexColumn, FlexRow } from "@/components/Layout";
import navFarger from "nav-frontend-core";
import React, { ReactElement } from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { Element, Normaltekst } from "nav-frontend-typografi";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { capitalizeAllWords } from "@/utils/stringUtils";
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  MinusCircleFillIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";

const texts = {
  naermesteLeder: "Nærmeste leder:",
  arbeidstaker: "Arbeidstakeren:",
  behandler: "Behandleren:",
  harAapnetInnkalling: "åpnet innkallingen",
  harIkkeAapnetInnkalling: "har ikke åpnet innkallingen",
  harAapnetEndring: "åpnet endringen",
  harIkkeAapnetEndring: "har ikke åpnet endringen",
  svarMottatt: "Svar mottatt",
  svarIkkeMottatt: "Har ikke gitt svar",
  oppdateringMottatt: "Oppdatering mottatt",
  begrunnelseHeader: "Begrunnelse",
  begrunnelseMottattHeader: "Begrunnelse mottatt",
  harIkkeBegrunnelse: "Ingen detaljer er tilgjengelig.",
  svarKommer: "kommer",
  svarNyttTidSted: "ønsker å endre tidspunkt eller sted",
  svarKommerIkke: "ønsker å avlyse",
  noNarmesteleder: "Nærmeste leder er ikke registrert.",
};

const getHarAapnetTekst = (
  varselType: MotedeltakerVarselType | undefined,
  lestDato: string | undefined
): string => {
  if (varselType === MotedeltakerVarselType.INNKALT) {
    return lestDato
      ? `${texts.harAapnetInnkalling} ${tilLesbarDatoMedArUtenManedNavn(
          lestDato
        )} - ${texts.svarIkkeMottatt}`
      : texts.harIkkeAapnetInnkalling;
  } else if (varselType === MotedeltakerVarselType.NYTT_TID_STED) {
    return lestDato
      ? `${texts.harAapnetEndring} ${tilLesbarDatoMedArUtenManedNavn(
          lestDato
        )} - ${texts.svarIkkeMottatt}`
      : texts.harIkkeAapnetEndring;
  } else {
    return "";
  }
};

const getSvarTekst = (
  svarTidspunkt: string,
  svarType: SvarType,
  antallSvar = 1
) => {
  const mottattPrefiks =
    antallSvar > 1 ? texts.oppdateringMottatt : texts.svarMottatt;
  const mottattTekst = `${mottattPrefiks} ${tilLesbarDatoMedArUtenManedNavn(
    svarTidspunkt
  )}`;
  switch (svarType) {
    case SvarType.KOMMER:
      return `${texts.svarKommer} - ${mottattTekst}`;
    case SvarType.NYTT_TID_STED:
      return `${texts.svarNyttTidSted} - ${mottattTekst}`;
    case SvarType.KOMMER_IKKE:
      return `${texts.svarKommerIkke} - ${mottattTekst}`;
  }
};

interface DeltakerSvarIconProps {
  svarType: SvarType | undefined;
}

const DeltakerSvarIcon = ({
  svarType,
}: DeltakerSvarIconProps): ReactElement => {
  switch (svarType) {
    case SvarType.KOMMER:
      return (
        <CheckmarkCircleFillIcon
          fontSize="1.5em"
          color={navFarger.navGronn}
          title="suksess-ikon"
        />
      );
    case SvarType.NYTT_TID_STED:
      return (
        <ExclamationmarkTriangleFillIcon
          fontSize="1.5em"
          color={navFarger.navOransje}
          title="advarsel-ikon"
        />
      );
    case SvarType.KOMMER_IKKE:
      return (
        <XMarkOctagonFillIcon
          fontSize="1.5em"
          color={navFarger.navRod}
          title="feil-ikon"
        />
      );
    default:
      return (
        <MinusCircleFillIcon
          fontSize="1.5em"
          color={navFarger.navGra40}
          title="minus-sirkel-ikon"
        />
      );
  }
};

interface SvarDetaljerTekstProps {
  header: string;
  tekst: string;
}

const SvarDetaljerTekst = ({ header, tekst }: SvarDetaljerTekstProps) => (
  <DetaljerTekst>
    <Element>{header}</Element>
    <Normaltekst>{tekst}</Normaltekst>
  </DetaljerTekst>
);

interface DeltakerBehandlerSvarDetaljerProps {
  svarList: DialogmotedeltakerBehandlerVarselSvarDTO[];
}

const DeltakerBehandlerSvarDetaljer = ({
  svarList,
}: DeltakerBehandlerSvarDetaljerProps) => {
  const begrunnelseHeaderTekst = (
    svar: DialogmotedeltakerBehandlerVarselSvarDTO
  ) =>
    `${texts.begrunnelseMottattHeader} ${tilLesbarDatoMedArUtenManedNavn(
      svar.createdAt
    )}`;

  if (svarList.length === 0) {
    return <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>;
  }

  if (svarList.length === 1) {
    const svar = svarList[0];
    return svar.tekst ? (
      <SvarDetaljerTekst
        header={begrunnelseHeaderTekst(svar)}
        tekst={svar.tekst}
      />
    ) : (
      <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>
    );
  }

  return (
    <>
      {svarList
        .filter((svar) => svar.tekst)
        .map((svar, idx) => (
          <SvarDetaljerTekst
            key={idx}
            header={begrunnelseHeaderTekst(svar)}
            tekst={svar.tekst ?? ""}
          />
        ))}
    </>
  );
};

interface DeltakerBehandlerSvarPanelProps {
  behandler: DialogmotedeltakerBehandlerDTO;
}

const DeltakerBehandlerSvarPanel = ({
  behandler,
}: DeltakerBehandlerSvarPanelProps) => {
  const svarList = behandler.varselList[0]?.svar || [];
  const latestSvar: DialogmotedeltakerBehandlerVarselSvarDTO | undefined =
    svarList[0];
  const svarTittelTekst = !latestSvar
    ? texts.svarIkkeMottatt.toLowerCase()
    : getSvarTekst(latestSvar.createdAt, latestSvar.svarType, svarList.length);

  return (
    <EkspanderbartSvarPanel
      icon={<DeltakerSvarIcon svarType={latestSvar?.svarType} />}
      deltaker={texts.behandler}
      tittel={`${behandler.behandlerNavn}, ${svarTittelTekst}`}
    >
      <DeltakerBehandlerSvarDetaljer svarList={svarList} />
    </EkspanderbartSvarPanel>
  );
};

const DeltakerLabel = styled(Element)`
  margin-left: 0.5em;
`;

const TittelTekst = styled(Normaltekst)`
  margin-left: 0.5em;
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  margin-bottom: 1em;
  border: 1px solid ${navFarger.navGra60};
`;

interface EkspanderbartSvarPanelProps {
  deltaker: string;
  tittel: string;
  icon: ReactElement;
  children: ReactElement;
}

const EkspanderbartSvarPanel = ({
  icon,
  deltaker,
  tittel,
  children,
}: EkspanderbartSvarPanelProps) => (
  <StyledEkspanderbartpanel
    renderContentWhenClosed
    tittel={
      <FlexRow>
        {icon}
        <DeltakerLabel>{deltaker}</DeltakerLabel>
        <TittelTekst>{tittel}</TittelTekst>
      </FlexRow>
    }
  >
    {children}
  </StyledEkspanderbartpanel>
);

const DetaljerTekst = styled.div`
  margin-top: 0.5em;
`;

interface DeltakerSvarPanelProps {
  deltakerLabel: string;
  deltakerNavn: string;
  varsel: DialogmotedeltakerVarselDTO | undefined;
  customTitle?: string;
}

const DeltakerSvarPanel = ({
  varsel,
  deltakerLabel,
  deltakerNavn,
  customTitle,
}: DeltakerSvarPanelProps) => {
  const svar = varsel?.svar;
  const svarTittelTekst = !svar
    ? getHarAapnetTekst(varsel?.varselType, varsel?.lestDato)
    : getSvarTekst(svar.svarTidspunkt, svar.svarType);

  const title = customTitle
    ? customTitle
    : `${capitalizeAllWords(deltakerNavn)}, ${svarTittelTekst}`;

  return (
    <EkspanderbartSvarPanel
      icon={<DeltakerSvarIcon svarType={svar?.svarType} />}
      deltaker={deltakerLabel}
      tittel={title}
    >
      {svar?.svarTekst ? (
        <SvarDetaljerTekst
          header={texts.begrunnelseHeader}
          tekst={svar.svarTekst}
        />
      ) : (
        <DetaljerTekst>{texts.harIkkeBegrunnelse}</DetaljerTekst>
      )}
    </EkspanderbartSvarPanel>
  );
};

const StyledColumn = styled(FlexColumn)`
  width: 100%;
`;

interface DeltakereSvarInfoProps {
  dialogmote: DialogmoteDTO;
}

export const DeltakereSvarInfo = ({ dialogmote }: DeltakereSvarInfoProps) => {
  const bruker = useNavBrukerData();
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const narmesteLederNavn = getCurrentNarmesteLeder(
    dialogmote.arbeidsgiver.virksomhetsnummer
  )?.narmesteLederNavn;

  const noNarmesteLeder = !narmesteLederNavn;
  const customTitle = noNarmesteLeder ? texts.noNarmesteleder : undefined;

  return (
    <StyledColumn>
      <DeltakerSvarPanel
        deltakerLabel={texts.naermesteLeder}
        deltakerNavn={narmesteLederNavn ?? ""}
        varsel={dialogmote.arbeidsgiver.varselList[0]}
        customTitle={customTitle}
      />
      <DeltakerSvarPanel
        deltakerLabel={texts.arbeidstaker}
        deltakerNavn={bruker.navn}
        varsel={dialogmote.arbeidstaker.varselList[0]}
      />
      {dialogmote.behandler && (
        <DeltakerBehandlerSvarPanel behandler={dialogmote.behandler} />
      )}
    </StyledColumn>
  );
};

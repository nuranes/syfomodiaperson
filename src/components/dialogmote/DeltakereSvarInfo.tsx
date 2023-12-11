import {
  DialogmotedeltakerBehandlerDTO,
  DialogmotedeltakerBehandlerVarselSvarDTO,
  DialogmotedeltakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import React, { ReactElement } from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { capitalizeAllWords } from "@/utils/stringUtils";
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  MinusCircleFillIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";
import { BodyLong, BodyShort, ExpansionCard, Label } from "@navikt/ds-react";

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
          color="var(--a-icon-success)"
          title="suksess-ikon"
        />
      );
    case SvarType.NYTT_TID_STED:
      return (
        <ExclamationmarkTriangleFillIcon
          fontSize="1.5em"
          color="var(--a-icon-warning)"
          title="advarsel-ikon"
        />
      );
    case SvarType.KOMMER_IKKE:
      return (
        <XMarkOctagonFillIcon
          fontSize="1.5em"
          color="var(--a-icon-danger)"
          title="feil-ikon"
        />
      );
    default:
      return (
        <MinusCircleFillIcon
          fontSize="1.5em"
          color="var(--a-gray-600)"
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
  <>
    <Label size="small">{header}</Label>
    <BodyLong size="small">{tekst}</BodyLong>
  </>
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
    return <BodyLong size="small">{texts.harIkkeBegrunnelse}</BodyLong>;
  }

  if (svarList.length === 1) {
    const svar = svarList[0];
    return svar.tekst ? (
      <SvarDetaljerTekst
        header={begrunnelseHeaderTekst(svar)}
        tekst={svar.tekst}
      />
    ) : (
      <BodyLong size="small">{texts.harIkkeBegrunnelse}</BodyLong>
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
  <ExpansionCard size="small" aria-label={tittel} className="mb-4">
    <ExpansionCard.Header>
      <ExpansionCard.Title size="small">
        <div className="flex gap-1 items-center">
          {icon}
          <Label size="small">{deltaker}</Label>
          <BodyShort size="small">{tittel}</BodyShort>
        </div>
      </ExpansionCard.Title>
    </ExpansionCard.Header>
    <ExpansionCard.Content>{children}</ExpansionCard.Content>
  </ExpansionCard>
);

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
        <BodyLong size="small">{texts.harIkkeBegrunnelse}</BodyLong>
      )}
    </EkspanderbartSvarPanel>
  );
};

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
    <div className="flex flex-col w-full">
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
    </div>
  );
};

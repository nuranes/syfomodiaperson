import React, { ReactElement } from "react";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { Vis } from "@/utils";
import { StatusNokkelopplysning } from "../../Statuspanel";
import SykmeldingNokkelOpplysning from "../sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";

const texts = {
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  status: {
    tittel: "Status",
    sender: "Sender...",
    avbrutt: "Avbrutt av deg",
    bekreftet: "Bekreftet av deg",
    sendt: "Sendt til arbeidsgiver",
  },
  dato: {
    bekreftet: "Dato bekreftet",
    avbrutt: "Dato avbrutt",
    sendt: "Dato sendt",
  },
  arbeidsgiver: "Arbeidsgiver",
  orgnr: "Organisasjonsnummer",
  egenmeldingPapir: "Egenmelding og/eller sykmelding på papir",
  egenmeldingPapirNei: "Har ikke hatt egenmelding og/eller sykmelding på papir",
  forsikring: "Forsikring",
  ja: "Ja",
  nei: "Har ikke forsikring som gjelder de første 16 dagene av sykefraværet",
};

const { BEKREFTET, AVBRUTT, TIL_SENDING, SENDT } = SykmeldingStatus;

const textStatus = (status: SykmeldingStatus) => {
  switch (status) {
    case BEKREFTET:
      return texts.status.bekreftet;
    case AVBRUTT:
      return texts.status.avbrutt;
    case TIL_SENDING:
      return texts.status.sender;
    case SENDT:
      return texts.status.sendt;
    default:
      return "";
  }
};

interface SykmeldingstatusProps {
  sykmelding: SykmeldingOldFormat;
}

export const Sykmeldingstatus = (
  sykmeldingstatusProps: SykmeldingstatusProps
): ReactElement => {
  const { sykmelding } = sykmeldingstatusProps;
  return (
    <StatusNokkelopplysning tittel={texts.status.tittel}>
      {sykmelding.status === TIL_SENDING ? (
        <div className="medHjelpetekst">
          <span>{textStatus(sykmelding.status)}</span>
          <Hjelpetekst>{texts.hjelpetekst}</Hjelpetekst>
        </div>
      ) : (
        <p className="js-status">{textStatus(sykmelding.status)}</p>
      )}
    </StatusNokkelopplysning>
  );
};

interface SendtDatoProps {
  sykmelding: SykmeldingOldFormat;
}

export const SendtDato = (sendtDatoProps: SendtDatoProps): ReactElement => {
  const { sykmelding } = sendtDatoProps;
  const tittel =
    sykmelding.status === BEKREFTET
      ? texts.dato.bekreftet
      : sykmelding.status === AVBRUTT
      ? texts.dato.avbrutt
      : texts.dato.sendt;
  return (
    <StatusNokkelopplysning tittel={tittel}>
      <p className="js-dato">{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
    </StatusNokkelopplysning>
  );
};

interface ArbeidsgiverProps {
  sykmelding: SykmeldingOldFormat;
}

export const Arbeidsgiver = (
  arbeidsgiverProps: ArbeidsgiverProps
): ReactElement => {
  const { sykmelding } = arbeidsgiverProps;
  return (
    <StatusNokkelopplysning tittel={texts.arbeidsgiver}>
      <p className="js-arbeidsgiver">{sykmelding.innsendtArbeidsgivernavn}</p>
    </StatusNokkelopplysning>
  );
};

interface OrgnummerProps {
  sykmelding: SykmeldingOldFormat;
}

export const Orgnummer = (orgnummerProps: OrgnummerProps): ReactElement => {
  const { sykmelding } = orgnummerProps;
  const orgnummer = sykmelding.orgnummer
    ? sykmelding.orgnummer.replace(/(...)(...)(...)/g, "$1 $2 $3")
    : null;
  return (
    <StatusNokkelopplysning tittel={texts.orgnr}>
      <p className="js-organisasjonsnummer">{orgnummer}</p>
    </StatusNokkelopplysning>
  );
};

interface SykmeldingopplysningFravaersperioderProps {
  sykmelding: SykmeldingOldFormat;
  className?: string;
}

export const SykmeldingopplysningFravaersperioder = (
  sykmeldingopplysningFravaersperioderProps: SykmeldingopplysningFravaersperioderProps
): ReactElement => {
  const { sykmelding, className } = sykmeldingopplysningFravaersperioderProps;
  return (
    <SykmeldingNokkelOpplysning
      className={className}
      tittel={texts.egenmeldingPapir}
    >
      {sykmelding.sporsmal.fravaersperioder &&
      sykmelding.sporsmal.fravaersperioder.length > 0 ? (
        <ul className="nokkelopplysning__liste">
          {sykmelding.sporsmal.fravaersperioder?.map((p, index) => {
            return (
              <li key={index}>{tilLesbarPeriodeMedArstall(p.fom, p.tom)}</li>
            );
          })}
        </ul>
      ) : (
        <p>{texts.egenmeldingPapirNei}</p>
      )}
    </SykmeldingNokkelOpplysning>
  );
};

interface SykmeldingopplysningForsikringProps {
  sykmelding: SykmeldingOldFormat;
  className?: string;
}

export const SykmeldingopplysningForsikring = (
  sykmeldingopplysningForsikringProps: SykmeldingopplysningForsikringProps
): ReactElement => {
  const { sykmelding, className } = sykmeldingopplysningForsikringProps;
  const text = sykmelding.sporsmal.harForsikring ? texts.ja : texts.nei;
  return (
    <SykmeldingNokkelOpplysning className={className} tittel={texts.forsikring}>
      <p>{text}</p>
    </SykmeldingNokkelOpplysning>
  );
};

interface FrilansersporsmalProps {
  sykmelding: SykmeldingOldFormat;
}

export const Frilansersporsmal = (
  frilansersporsmalProps: FrilansersporsmalProps
): ReactElement => {
  const { sykmelding } = frilansersporsmalProps;
  return (
    <Vis
      hvis={
        sykmelding.sporsmal &&
        (sykmelding.sporsmal.harAnnetFravaer !== null ||
          sykmelding.sporsmal.harForsikring !== null)
      }
      render={() => {
        return [
          sykmelding.sporsmal.harAnnetFravaer !== null && (
            <SykmeldingopplysningFravaersperioder
              key={`fravaersperioder-${sykmelding.id}`}
              sykmelding={sykmelding}
              className="nokkelopplysning--statusopplysning"
            />
          ),
          sykmelding.sporsmal.harForsikring !== null && (
            <SykmeldingopplysningForsikring
              key={`forsikring-${sykmelding.id}`}
              sykmelding={sykmelding}
              className="nokkelopplysning--statusopplysning"
            />
          ),
        ];
      }}
    />
  );
};

import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  erSendtTilBeggeMenIkkeSamtidig,
  getSendtTilSuffix,
} from "@/utils/sykepengesoknadUtils";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
  toDatePrettyPrint,
} from "@/utils/datoUtils";
import {
  GlobeHoverImage,
  GlobeImage,
  SoknaderHoverImage,
  SoknaderImage,
} from "../../../../img/ImageComponents";
import {
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  sendt: "Sendt til",
  fremtidig: "Planlagt",
  avbrutt: "Avbrutt av deg",
  teaser: "Gjelder perioden",
  utland: "Søknad om å beholde sykepenger utenfor EØS\n",
  reisetilskudd: "Søknad om reisetilskudd",
  tittel: "Søknad om sykepenger",
};

const textDato = (dato?: string) => {
  return `Opprettet ${dato}`;
};

const textSendtTilArbeidsgiver = (dato?: string, arbeidsgiver?: string) => {
  return `${texts.sendt} ${arbeidsgiver} ${dato}`;
};

const textSendtTilNav = (dato?: string) => {
  return `${texts.sendt} NAV ${dato}`;
};

const textAvbrutt = (dato?: string) => {
  return `${texts.avbrutt} ${dato}`;
};

const textTeaserTekst = (periode: string) => {
  return `Gjelder for perioden ${periode}`;
};

interface TeaserComponentProps {
  soknad: SykepengesoknadDTO;
}

const SendtUlikt = ({ soknad }: TeaserComponentProps) => {
  return (
    <span>
      {textSendtTilArbeidsgiver(
        toDatePrettyPrint(soknad.sendtTilArbeidsgiverDato),
        soknad.arbeidsgiver?.navn
      )}
      <br />
      {textSendtTilNav(toDatePrettyPrint(soknad.sendtTilNAVDato))}
    </span>
  );
};

const visIkon = (soknadstype: Soknadstype) => {
  return soknadstype === Soknadstype.OPPHOLD_UTLAND ? (
    <img alt="" className="js-ikon" src={GlobeImage} />
  ) : (
    <img alt="" className="js-ikon" src={SoknaderImage} />
  );
};

const visIkonHover = (soknadstype: Soknadstype) => {
  return soknadstype === Soknadstype.OPPHOLD_UTLAND ? (
    <img alt="" className="js-ikon" src={GlobeHoverImage} />
  ) : (
    <img alt="" className="js-ikon" src={SoknaderHoverImage} />
  );
};

const textSoknadTeaserStatus = (
  key: string,
  dato?: string,
  arbeidsgiver?: string
) => {
  switch (key) {
    case "soknad.teaser.status.TIL_SENDING":
      return "Sender...";
    case "soknad.teaser.status.TIL_SENDING.til-arbeidsgiver-og-nav":
      return `Sender til ${arbeidsgiver} og NAV...`;
    case "soknad.teaser.status.SENDT":
      return `Sendt ${dato}`;
    case "soknad.teaser.status.SENDT.til-nav":
      return `Sendt til NAV ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver":
      return `Sendt til ${arbeidsgiver} ${dato}`;
    case "soknad.teaser.status.SENDT.til-arbeidsgiver-og-nav":
      return `Sendt til ${arbeidsgiver} og NAV ${dato}`;
    case "soknad.teaser.status.UTKAST_TIL_KORRIGERING":
      return "Utkast til endring";
    case "soknad.teaser.status.UTGAATT":
      return "Ikke brukt på nett";
    case "soknad.teaser.status.FREMTIDIG":
      return "Planlagt";
    case "soknad.teaser.status.AVBRUTT":
      return textAvbrutt(dato);
    default:
      return "";
  }
};

const beregnUndertekst = (soknad: SykepengesoknadDTO) => {
  const sendtTilBeggeMenIkkeSamtidig = erSendtTilBeggeMenIkkeSamtidig(soknad);

  if (soknad.status === Soknadstatus.AVBRUTT) {
    return textAvbrutt(tilLesbarDatoMedArstall(soknad.avbruttDato));
  }

  if (soknad.status === Soknadstatus.FREMTIDIG) {
    return texts.fremtidig;
  }

  switch (soknad.soknadstype) {
    case Soknadstype.OPPHOLD_UTLAND:
    case Soknadstype.ARBEIDSLEDIG:
    case Soknadstype.ANNET_ARBEIDSFORHOLD:
    case Soknadstype.SELVSTENDIGE_OG_FRILANSERE: {
      return soknad.status === Soknadstatus.SENDT && soknad.sendtTilNAVDato
        ? textSendtTilNav(tilLesbarDatoMedArstall(soknad.sendtTilNAVDato))
        : "";
    }
    case Soknadstype.BEHANDLINGSDAGER:
    case Soknadstype.ARBEIDSTAKERE: {
      switch (soknad.status) {
        case Soknadstatus.UTKAST_TIL_KORRIGERING:
        case Soknadstatus.NY: {
          return soknad.arbeidsgiver?.navn ?? "";
        }
        case Soknadstatus.SENDT:
        case Soknadstatus.TIL_SENDING: {
          return sendtTilBeggeMenIkkeSamtidig ? (
            <SendtUlikt soknad={soknad} />
          ) : (
            textSoknadTeaserStatus(
              `soknad.teaser.status.${soknad.status}${getSendtTilSuffix(
                soknad
              )}`,
              tilLesbarDatoMedArstall(
                soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
              ),
              soknad.arbeidsgiver?.navn ?? ""
            )
          );
        }
        default: {
          return "";
        }
      }
    }
    default: {
      switch (soknad.status) {
        case Soknadstatus.SENDT:
        case Soknadstatus.TIL_SENDING: {
          return sendtTilBeggeMenIkkeSamtidig ? (
            <SendtUlikt soknad={soknad} />
          ) : (
            textSoknadTeaserStatus(
              `soknad.teaser.status.${soknad.status}${getSendtTilSuffix(
                soknad
              )}`,
              tilLesbarDatoMedArstall(
                soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
              ),
              soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : ""
            )
          );
        }
        case Soknadstatus.NY:
        case Soknadstatus.UTKAST_TIL_KORRIGERING: {
          return soknad.arbeidsgiver ? soknad.arbeidsgiver.navn : "";
        }
        default: {
          return "";
        }
      }
    }
  }
};

const TeaserStatus = ({ soknad }: TeaserComponentProps) => (
  <p className="inngangspanel__status js-status">
    {textSoknadTeaserStatus(
      `soknad.teaser.status.${soknad.status}`,
      tilLesbarDatoMedArstall(
        soknad.sendtTilArbeidsgiverDato || soknad.sendtTilNAVDato
      )
    )}
  </p>
);

const tittelFromSoknadstype = (soknadstype: Soknadstype) => {
  switch (soknadstype) {
    case Soknadstype.OPPHOLD_UTLAND: {
      return texts.utland;
    }
    case Soknadstype.REISETILSKUDD: {
      return texts.reisetilskudd;
    }
    default: {
      return texts.tittel;
    }
  }
};

const TeaserTittel = ({ soknad }: TeaserComponentProps) => (
  <h3 className="js-title" id={`soknad-header-${soknad.id}`}>
    <small className="inngangspanel__meta js-meta">
      {textDato(tilLesbarDatoMedArstall(soknad.opprettetDato))}
    </small>
    <span className="inngangspanel__tittel">
      {tittelFromSoknadstype(soknad.soknadstype)}
    </span>
  </h3>
);

const TeaserPeriode = ({ soknad }: TeaserComponentProps) => (
  <p className="inngangspanel__tekst js-tekst">
    {textTeaserTekst(tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom))}
  </p>
);

const SykepengesoknadTeaser = ({
  soknad,
}: TeaserComponentProps): ReactElement => {
  const status = soknad.status ? soknad.status.toLowerCase() : "";
  const visStatus =
    [Soknadstatus.NY, Soknadstatus.SENDT, Soknadstatus.AVBRUTT].indexOf(
      soknad.status
    ) === -1;
  const undertekst = beregnUndertekst(soknad);
  return (
    <article aria-labelledby={`soknader-header-${soknad.id}`}>
      <Link
        className={`inngangspanel js-panel js-soknad-${status}`}
        to={`/sykefravaer/sykepengesoknader/${soknad.id}`}
      >
        <span className="inngangspanel__ikon inngangspanel__ikon--normal">
          {visIkon(soknad.soknadstype)}
        </span>
        <span className="inngangspanel__ikon inngangspanel__ikon--hover">
          {visIkonHover(soknad.soknadstype)}
        </span>
        <div className="inngangspanel__innhold">
          <header className="inngangspanel__header">
            <TeaserTittel soknad={soknad} />
            {visStatus && <TeaserStatus soknad={soknad} />}
          </header>
          {soknad.soknadstype !== Soknadstype.OPPHOLD_UTLAND && (
            <TeaserPeriode soknad={soknad} />
          )}
          {undertekst && (
            <p className="inngangspanel__undertekst js-undertekst mute">
              {undertekst}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default SykepengesoknadTeaser;

import dayjs from "dayjs";
import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  VarselSvarDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  ENHET_GRUNERLOKKA,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { BehandlerDTO, BehandlerType } from "@/data/behandler/BehandlerDTO";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";

dayjs.extend(customParseFormat);

export const arbeidstaker = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
};
export const arbeidsgiver = {
  orgnr: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
};
export const navEnhet = {
  id: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};
export const veileder = VEILEDER_DEFAULT;

export const narmesteLederNavn = NARMESTE_LEDER_DEFAULT.navn;

export const behandler: BehandlerDTO = {
  fnr: "01038521470",
  behandlerRef: "behandler-ref-uuid",
  kontor: "Greendale Legekontor",
  telefon: "11223344",
  fornavn: "Dean",
  etternavn: "Pelton",
  type: BehandlerType.FASTLEGE,
};
export const behandlerDeltaker: DialogmotedeltakerBehandlerDTO = {
  behandlerType: behandler.type,
  type: "BEHANDLER",
  uuid: "456def",
  personIdent: "01038521470",
  behandlerRef: "behandler-ref-uuid",
  varselList: [],
  behandlerKontor: "Greendale Legekontor",
  behandlerNavn: "Dean Pelton",
  deltatt: true,
  mottarReferat: true,
};

export const dialogmote: DialogmoteDTO = {
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: [],
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: [],
  },
  createdAt: "",
  opprettetAv: "",
  status: DialogmoteStatus.INNKALT,
  tildeltEnhet: "",
  tildeltVeilederIdent: "",
  updatedAt: "",
  uuid: "123abc",
  tid: "2021-05-10T09:00:00.000",
  sted: "Videomøte",
  videoLink: "",
  referatList: [],
};
export const dialogmoteMedBehandler: DialogmoteDTO = {
  ...dialogmote,
  behandler: behandlerDeltaker,
};
const dialogmoteMedBehandlerIkkeDeltatt: DialogmoteDTO = {
  ...dialogmote,
  behandler: {
    ...behandlerDeltaker,
    deltatt: false,
    mottarReferat: false,
  },
};

export const varselArbeidsgiver = (
  type: MotedeltakerVarselType,
  lestDato?: string,
  svar?: VarselSvarDTO
): DialogmotedeltakerArbeidsgiverVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  createdAt: "",
  lestDato,
  status: "",
  svar,
});

export const varselArbeidstaker = (
  type: MotedeltakerVarselType,
  lestDato?: string,
  svar?: VarselSvarDTO
): DialogmotedeltakerArbeidstakerVarselDTO => ({
  uuid: "",
  varselType: type,
  fritekst: "",
  document: [],
  digitalt: true,
  createdAt: "",
  lestDato,
  svar,
});

export const dialogmoteMedVarsel = (
  varselArbeidsgiver: DialogmotedeltakerArbeidsgiverVarselDTO[],
  varselArbeidstaker: DialogmotedeltakerArbeidstakerVarselDTO[]
): DialogmoteDTO => ({
  ...dialogmote,
  arbeidsgiver: {
    virksomhetsnummer: arbeidsgiver.orgnr,
    type: "ARBEIDSGIVER",
    varselList: varselArbeidsgiver,
  },
  arbeidstaker: {
    personIdent: arbeidstaker.personident,
    type: "ARBEIDSTAKER",
    varselList: varselArbeidstaker,
  },
});

const moteSted = "Sted for møtet";
const moteDato = toDatePrettyPrint(dayjs(new Date()).add(1, "days")) as string;
const moteDatoAsISODateString = dayjs(moteDato, "DD.MM.YYYY").format(
  "YYYY-MM-DD"
);
const moteKlokkeslett = "08:00";
const moteDatoTid = `${moteDatoAsISODateString}T${moteKlokkeslett}:00`;
const moteVideoLink = "https://video.nav.no";
const arbeidsgivernavn = VIRKSOMHET_PONTYPANDY.virksomhetsnavn;

const endretSted = "Videomøte endret";
const endretDato = toDatePrettyPrint(
  dayjs(new Date()).add(2, "days")
) as string;
const endretKlokkeslett = "09:00";
const endretDatoAsISODateString = dayjs(endretDato, "DD.MM.YYYY").format(
  "YYYY-MM-DD"
);
const endretDatoTid = `${endretDatoAsISODateString}T${endretKlokkeslett}:00`;
const endretVideolink = "https://video.nav.no/asxs";

const fritekstTilBehandler = "Noe fritekst til behandler";
const fritekstTilArbeidstaker = "Noe fritekst til arbeidstaker";
const fritekstTilArbeidsgiver = "Noe fritekst til arbeidsgiver";
const situasjonTekst = "Noe tekst om situasjonen";
const konklusjonTekst = "Noe tekst om konklusjon";
const arbeidsgiversOppgave = "Noe tekst om arbeidsgivers oppgave";
const arbeidstakersOppgave = "Noe tekst om arbeidstakers oppgave";
const veiledersOppgave = "Noe tekst om veileders oppgave";
const behandlersOppgave = "Noe tekst om behandlers oppgave";
const begrunnelseEndring = "Noe tekst om hvorfor referatet endres";

export const annenDeltakerNavn = "Bodil Bolle";
export const annenDeltakerFunksjon = "Verneombud";
export const behandlerDeltakerTekst = `Behandler: ${behandlerNavn(behandler)}`;

export const mote = {
  sted: moteSted,
  dato: moteDato,
  datoAsISODateString: moteDatoAsISODateString,
  klokkeslett: moteKlokkeslett,
  datoTid: moteDatoTid,
  videolink: moteVideoLink,
  arbeidsgivernavn: arbeidsgivernavn,
};
export const endretMote: typeof mote = {
  sted: endretSted,
  dato: endretDato,
  datoAsISODateString: endretDatoAsISODateString,
  datoTid: endretDatoTid,
  klokkeslett: endretKlokkeslett,
  videolink: endretVideolink,
  arbeidsgivernavn: arbeidsgivernavn,
};

export const moteTekster = {
  fritekstTilArbeidstaker,
  fritekstTilArbeidsgiver,
  fritekstTilBehandler,
  situasjonTekst,
  konklusjonTekst,
  arbeidsgiversOppgave,
  arbeidstakersOppgave,
  veiledersOppgave,
  behandlersOppgave,
  begrunnelseEndring,
};

export const referatStandardTekst = referatTexts.standardTekster[3];

export const createMellomlagretReferat = (tid?: string) => ({
  uuid: "123abc",
  createdAt: tid || "2021-05-10T11:00:00.000",
  updatedAt: tid || "2021-05-10T11:00:00.000",
  situasjon: situasjonTekst,
  arbeidsgiverOppgave: arbeidsgiversOppgave,
  arbeidstakerOppgave: arbeidstakersOppgave,
  narmesteLederNavn: narmesteLederNavn,
  konklusjon: konklusjonTekst,
  document: [
    {
      key: referatStandardTekst.key,
      title: referatStandardTekst.label,
      texts: [referatStandardTekst.text],
      type: DocumentComponentType.PARAGRAPH,
    },
  ],
  begrunnelseEndring: begrunnelseEndring,
  ferdigstilt: false,
  andreDeltakere: [
    { navn: annenDeltakerNavn, funksjon: annenDeltakerFunksjon },
  ],
});

export const createFerdigstiltReferat = (tid: string) => ({
  uuid: "123abc",
  createdAt: tid,
  updatedAt: tid,
  situasjon: situasjonTekst,
  arbeidsgiverOppgave: arbeidsgiversOppgave,
  arbeidstakerOppgave: arbeidstakersOppgave,
  narmesteLederNavn: narmesteLederNavn,
  konklusjon: konklusjonTekst,
  document: [],
  ferdigstilt: true,
  andreDeltakere: [],
});

export const dialogmoteMedMellomlagretReferat: DialogmoteDTO = {
  ...dialogmote,
  referatList: [createMellomlagretReferat()],
};

export const dialogmoteMedFerdigstiltReferat: DialogmoteDTO = {
  ...dialogmote,
  referatList: [createFerdigstiltReferat(dialogmote.tid)],
};

export const dialogmoteMedMellomlagretReferatBehandlerIkkeDeltatt: DialogmoteDTO =
  {
    ...dialogmoteMedBehandlerIkkeDeltatt,
    referatList: [createMellomlagretReferat()],
  };

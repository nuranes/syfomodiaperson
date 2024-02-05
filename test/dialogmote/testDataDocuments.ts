import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandler,
  behandlerDeltakerTekst,
  dialogmote,
  endretMote,
  mote,
  moteTekster,
  narmesteLederNavn,
  veileder,
} from "./testData";
import {
  avlysningTexts,
  commonTextsBokmal,
  endreTidStedTexts,
  getInnkallingTexts,
  referatTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "@/sider/mote/utils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { Malform } from "@/context/malform/MalformContext";
import { addBehandlerTypeAndName } from "@/hooks/dialogmote/document/useInnkallingDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";

const innkallingTextsBokmal = getInnkallingTexts(Malform.BOKMAL);

const expectedArbeidstakerInnkalling = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidstaker.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidstaker.intro2WithBehandler
        : innkallingTextsBokmal.arbeidstaker.intro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidstaker.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? addBehandlerTypeAndName(
            innkallingTextsBokmal.arbeidstaker.outro1WithBehandler,
            behandler
          )
        : innkallingTextsBokmal.arbeidstaker.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidstaker.outro2WithBehandler
        : innkallingTextsBokmal.arbeidstaker.outro2,
    ],
    title: innkallingTextsBokmal.arbeidstaker.outro2Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverInnkalling = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidsgiver.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidsgiver.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? addBehandlerTypeAndName(
            innkallingTextsBokmal.arbeidsgiver.outro1WithBehandler,
            behandler
          )
        : innkallingTextsBokmal.arbeidsgiver.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: innkallingTextsBokmal.arbeidsgiver.outro2Title,
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidsgiver.outro2WithBehandler
        : innkallingTextsBokmal.arbeidsgiver.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.arbeidsgiverTlfLabel,
      commonTextsBokmal.arbeidsgiverTlf,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerInnkalling = (): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte, svar ønskes"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.behandler.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },

  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.behandler.outro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverEndringsdokument = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidsgiver.outro1WithBehandler
        : endreTidStedTexts.arbeidsgiver.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.arbeidsgiver.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTexts.arbeidsgiver.outro2WithBehandler
          } ${behandlerNavn(behandler)}.`
        : endreTidStedTexts.arbeidsgiver.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidsgiver.outro3WithBehandler
        : endreTidStedTexts.arbeidsgiver.outro3,
    ],
    title: endreTidStedTexts.arbeidsgiver.outro3Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Arbeidsgivertelefonen", "55 55 33 36"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidstakerEndringsdokument = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidstaker.outro1WithBehandler
        : endreTidStedTexts.arbeidstaker.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.arbeidstaker.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTexts.arbeidstaker.outro2WithBehandler
          } ${behandlerNavn(behandler)}.`
        : endreTidStedTexts.arbeidstaker.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidstaker.outro3WithBehandler
        : endreTidStedTexts.arbeidstaker.outro3,
    ],
    title: endreTidStedTexts.arbeidstaker.outro3Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerEndringsdokument = (): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte, svar ønskes"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [endreTidStedTexts.behandler.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.behandler.outro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidsgiver = (): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidstaker = (): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningBehandler = (): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedReferatDocument = (): DocumentComponentDto[] => [
  {
    texts: [referatTexts.nyttHeader],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [dialogmote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Arbeidstaker: ${arbeidstaker.navn}`,
      `Fra NAV: ${veileder.navn}`,
      `Fra arbeidsgiver: ${narmesteLederNavn}`,
      behandlerDeltakerTekst,
      `${annenDeltakerFunksjon}: ${annenDeltakerNavn}`,
    ],
    title: referatTexts.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [moteTekster.konklusjonTekst],
    title: referatTexts.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidstakersOppgave],
    title: referatTexts.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidsgiversOppgave],
    title: referatTexts.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.behandlersOppgave],
    title: referatTexts.behandlersOppgave,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.veiledersOppgave],
    title: referatTexts.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.situasjonTekst],
    title: referatTexts.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedEndretReferatDocument = (): DocumentComponentDto[] => [
  {
    texts: [referatTexts.endretHeader],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.endring],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.begrunnelseEndring],
    title: referatTexts.begrunnelseEndringTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [dialogmote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Arbeidstaker: ${arbeidstaker.navn}`,
      `Fra NAV: ${veileder.navn}`,
      `Fra arbeidsgiver: ${narmesteLederNavn}`,
    ],
    title: referatTexts.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [moteTekster.konklusjonTekst],
    title: referatTexts.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidstakersOppgave],
    title: referatTexts.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidsgiversOppgave],
    title: referatTexts.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.veiledersOppgave],
    title: referatTexts.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.situasjonTekst],
    title: referatTexts.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Med vennlig hilsen", veileder.navn ?? "", "NAV"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedInnkallingDocuments = {
  arbeidsgiver: (medBehandler = false) =>
    expectedArbeidsgiverInnkalling(medBehandler),
  arbeidstaker: (medBehandler = false) =>
    expectedArbeidstakerInnkalling(medBehandler),
  behandler: expectedBehandlerInnkalling,
};

export const expectedEndringDocuments = {
  arbeidsgiver: (medBehandler = false) =>
    expectedArbeidsgiverEndringsdokument(medBehandler),
  arbeidstaker: (medBehandler = false) =>
    expectedArbeidstakerEndringsdokument(medBehandler),
  behandler: expectedBehandlerEndringsdokument,
};

export const expectedAvlysningDocuments = {
  arbeidsgiver: expectedAvlysningArbeidsgiver,
  arbeidstaker: expectedAvlysningArbeidstaker,
  behandler: expectedAvlysningBehandler,
};

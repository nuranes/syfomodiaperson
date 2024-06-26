import { Malform } from "../../context/malform/MalformContext";

const innkallingTextsBokmal = {
  arbeidstaker: {
    intro1:
      "Velkommen til dialogmøte mellom deg, arbeidsgiveren din og en veileder fra NAV. I møtet skal vi snakke om situasjonen din og bli enige om en plan som kan hjelpe deg videre.",
    intro2:
      "I møtet vil vi høre både hva du og arbeidsgiveren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    intro2WithBehandler:
      "I møtet vil vi høre både hva du, arbeidsgiveren og behandleren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    outroObligatorisk: "Det er obligatorisk å delta i dialogmøtet.",
    outro1:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    outro1WithBehandler:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi sett behov for å innkalle",
    outro2Title: "Før møtet",
    outro2:
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    outro2WithBehandler:
      "Det er viktig at du og arbeidsgiveren din fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
  },
  arbeidsgiver: {
    intro1:
      "Velkommen til dialogmøte mellom deg, arbeidstakeren din og en veileder fra NAV. I møtet skal vi snakke om din ansattes arbeidssituasjon og mulighetene for å jobbe. Vi skal bli enige om en plan som kan hjelpe din ansatte videre.",
    outroObligatorisk:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passer eller ikke. Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.",
    outro1:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    outro1WithBehandler:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi sett behov for å innkalle",
    outro2Title: "Før møtet",
    outro2:
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV senest én uke før møtet. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    outro2WithBehandler:
      "Det er viktig at du og arbeidstakeren fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
  },

  behandler: {
    header: "Innkalling til dialogmøte, svar ønskes",
    intro:
      "Vi ønsker svar fra deg om du kan stille til møtet. Det er i utgangspunktet obligatorisk å delta i dialogmøtet, men tidspunktet kan endres eller møtet kan avlyses ved behov.",
    outro:
      "Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.",
  },
};

const innkallingTextsNynorsk = {
  arbeidstaker: {
    intro1:
      "Velkomen til dialogmøte mellom deg, arbeidsgivaren din og ein rettleiar frå NAV. I møtet kjem vi til å snakke om situasjonen din og bli samde om ein plan som kan hjelpe deg vidare.",
    intro2:
      "Vi ønskjer å høyre kva du og arbeidsgivaren seier om arbeidssituasjonen og moglegheitene for å jobbe.",
    intro2WithBehandler:
      "Vi ønskjer å høyre kva du, arbeidsgivaren og behandlaren seier om arbeidssituasjonen og moglegheitene for å jobbe.",
    outroObligatorisk: "Det er obligatorisk å delta i dialogmøtet.",
    outro1:
      "Fastlegen eller ein annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi ikkje sett behov for det.",
    outro1WithBehandler:
      "Fastlegen eller ein annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi sett behov for å kalle inn",
    outro2Title: "Før møtet",
    outro2:
      "Det er viktig at de fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
    outro2WithBehandler:
      "Det er viktig at du og arbeidsgivaren din fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke saman om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
  },
  arbeidsgiver: {
    intro1:
      "Velkomen til dialogmøte mellom deg, arbeidstakaren din og ein rettleiar frå NAV. I møtet kjem vi til å snakke om arbeidssituasjonen til arbeidstakaren din og moglegheitene vedkomande har til å jobbe. Målet er å bli samde om ein plan som kan hjelpe arbeidstakaren din vidare.",
    outroObligatorisk:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passar eller ikkje. Vi minner om at sensitive personopplysningar ikkje skal sendast på e-post eller SMS.",
    outro1:
      "Fastlegen eller ein annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi ikkje sett behov for det.",
    outro1WithBehandler:
      "Fastlege eller annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi sett behov for å kalle inn",
    outro2Title: "Før møtet",
    outro2:
      "Det er viktig at de fyller ut oppfølgingsplanen saman og deler han med NAV seinast éi veke før møtet. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
    outro2WithBehandler:
      "Det er viktig at du og arbeidstakaren din fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
  },

  behandler: {
    header: "Innkalling til dialogmøte (ønskje om svar)",
    intro:
      "Vi ønskjer svar frå deg om du kan stille til møtet. Det er i utgangspunktet obligatorisk å delta i dialogmøtet, men tidspunktet kan endrast eller møtet kan avlysast ved behov.",
    outro:
      "Vi minner om at sensitive personopplysningar ikkje skal sendast på e-post eller SMS.",
  },
};

export const getInnkallingTexts = (malform: Malform) => {
  return malform === Malform.NYNORSK
    ? innkallingTextsNynorsk
    : innkallingTextsBokmal;
};

const endreTidStedTextsBokmal = {
  header: "Endret dialogmøte",
  intro1:
    "Du har tidligere blitt innkalt til et dialogmøte. Møtet skulle vært avholdt",
  intro2: "Møtet må flyttes. Dette tidspunktet og møtestedet gjelder nå:",
  arbeidsgiver: {
    outro1:
      "I møtet vil vi høre både hva du og arbeidstakeren sier om arbeidssituasjonen og mulighetene for å jobbe. Vi blir enige om en plan som kan hjelpe arbeidstakeren videre.",
    outro2:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    outro1WithBehandler:
      "I møtet vil vi høre både hva du, den ansatte og behandleren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    outro2WithBehandler:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi sett behov for å innkalle",
    outroObligatorisk:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passer eller ikke. Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.",
    outro3Title: "Før møtet",
    outro3:
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    outro3WithBehandler:
      "Det er viktig at du og arbeidstakeren fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
  },
  arbeidstaker: {
    outro1:
      "I møtet vil vi høre både hva du og arbeidsgiveren sier om arbeidssituasjonen og mulighetene for å jobbe. Vi blir enige om en plan som kan hjelpe deg videre.",
    outro2:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi ikke sett behov for det.",
    outro1WithBehandler:
      "I møtet vil vi høre både hva du, arbeidsgiveren og behandleren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    outro2WithBehandler:
      "Fastlegen eller en annen behandler kan bli invitert til å delta i dialogmøte. Til dette møtet har vi sett behov for å innkalle",
    outroObligatorisk: "Det er obligatorisk å delta i dialogmøtet.",
    outro3Title: "Før møtet",
    outro3:
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
    outro3WithBehandler:
      "Det er viktig at du og arbeidsgiveren din fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
  },
  behandler: {
    intro:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passer eller ikke.",
    outro:
      "Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.",
    endring: "Endret dialogmøte, svar ønskes",
  },
};

const endreTidStedTextsNynorsk = {
  header: "Endra dialogmøte",
  intro1:
    "Du har tidlegare blitt kalla inn til dialogmøte. Møtet skulle etter planen ha vore",
  intro2: "Møtet må flyttast. Følgjande tidspunkt og møtestad gjeld no:",
  arbeidsgiver: {
    outro1:
      "I møtet ønskjer vi å høyre kva du og den tilsette seier om arbeidssituasjonen og moglegheitene for jobb. Vi blir einige om ein plan som kan hjelpe den tilsette vidare.",
    outro2:
      "Fastlegen eller annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi ikkje sett behov for det.",
    outro1WithBehandler:
      "I møtet ønskjer vi å høyre kva du, den tilsette og behandlarane seier om arbeidssituasjonen og moglegheitene for jobb. Vi blir einige om ein plan som kan hjelpe den tilsette vidare.",
    outro2WithBehandler:
      "Fastlegen eller annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi sett behov for å kalle inn",
    outroObligatorisk:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passar eller ikkje. Vi minner om at sensitive personopplysningar ikkje skal sendast på e-post eller SMS.",
    outro3Title: "Før møtet",
    outro3:
      "Det er viktig at de fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
    outro3WithBehandler:
      "Det er viktig at du og arbeidstakaren din fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
  },
  arbeidstaker: {
    outro1:
      "Vi ønskjer å høyre kva du og arbeidsgivaren seier om arbeidssituasjonen og moglegheitene for å jobbe. Vi blir einige om ein plan som kan hjelpe deg vidare.",
    outro2:
      "Fastlegen eller annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi ikkje sett behov for det.",
    outro1WithBehandler:
      "Vi ønskjer å høyre kva du, arbeidsgivaren og behandlaren seier om arbeidssituasjonen og moglegheitene for å jobbe. Vi blir einige om ein plan som kan hjelpe deg vidare.",
    outro2WithBehandler:
      "Fastlegen eller annan behandlar kan bli invitert til å delta i dialogmøtet. Til dette møtet har vi sett behov for å kalle inn",
    outroObligatorisk: "Det er obligatorisk å delta i dialogmøtet.",
    outro3Title: "Før møtet",
    outro3:
      "Det er viktig at de fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
    outro3WithBehandler:
      "Det er viktig at du og arbeidsgivaren din fyller ut oppfølgingsplanen saman og deler han med NAV. Denne gir oss eit godt utgangspunkt for å snakke om kva som fungerer, kva som har blitt forsøkt, og kva moglegheiter som finst framover.",
  },
  behandler: {
    intro:
      "Det er obligatorisk å delta i dialogmøtet. Gi oss svar om tidspunktet passar eller ikkje.",
    outro:
      "Vi minner om at sensitive personopplysningar ikkje skal sendast på e-post eller SMS.",
    endring: "Endra dialogmøte (ønskje om svar)",
  },
};

export const getEndreTidStedTexts = (malform: Malform) => {
  return malform === Malform.NYNORSK
    ? endreTidStedTextsNynorsk
    : endreTidStedTextsBokmal;
};

const avlysningTextsBokmal = {
  header: "Avlysning av dialogmøte",
  intro1: "NAV har tidligere innkalt til dialogmøtet som skulle vært avholdt",
  intro2: "Dette møtet er avlyst.",
};

const avlysningTextsNynorsk = {
  header: "Avlysing dialogmøte",
  intro1:
    "NAV har tidlegare kalla inn til eit dialogmøte som etter planen skulle vere",
  intro2: "Dette møtet er avlyst.",
};

export const getAvlysningTexts = (malform: Malform) => {
  return malform === Malform.NYNORSK
    ? avlysningTextsNynorsk
    : avlysningTextsBokmal;
};

const commonTextsBokmal = {
  arbeidsgiverTitle: "Arbeidsgiver",
  moteTidTitle: "Møtetidspunkt",
  moteStedTitle: "Møtested",
  videoLinkTitle: "Lenke til videomøte",
  arbeidsgiverTlfLabel: "Arbeidsgivertelefonen",
  arbeidsgiverTlf: "55 55 33 36",
  hilsen: "Med vennlig hilsen",
  gjelder: "Gjelder",
};

const commonTextsNynorsk = {
  arbeidsgiverTitle: "Arbeidsgivar",
  moteTidTitle: "Møtetidspunkt",
  moteStedTitle: "Møtestad",
  videoLinkTitle: "Lenke til videomøte",
  arbeidsgiverTlfLabel: "Arbeidsgivartelefonen",
  arbeidsgiverTlf: "55 55 33 36",
  hilsen: "Vennleg helsing",
  gjelder: "Gjeld",
};

export const getCommonTexts = (malform: Malform) => {
  return malform === Malform.NYNORSK ? commonTextsNynorsk : commonTextsBokmal;
};

// Disse nøklene knyttes til linker i eSyfo og skal ikke endres.
export enum StandardtekstKey {
  IKKE_BEHOV = "IKKE_BEHOV",
  FRISKMELDING_ARBEIDSFORMIDLING = "FRISKMELDING_ARBEIDSFORMIDLING",
  AVKLARING_ARBEIDSEVNE = "AVKLARING_ARBEIDSEVNE",
  OPPFOLGINGSTILTAK = "OPPFOLGINGSTILTAK",
  ARBEIDSRETTET_REHABILITERING = "ARBEIDSRETTET_REHABILITERING",
  OPPLAERING_UTDANNING = "OPPLAERING_UTDANNING",
  UNNTAK_ARBEIDSGIVERPERIODE = "UNNTAK_ARBEIDSGIVERPERIODE",
  REISETILSKUDD = "REISETILSKUDD",
  HJELPEMIDLER_TILRETTELEGGING = "HJELPEMIDLER_TILRETTELEGGING",
  MIDLERTIDIG_LONNSTILSKUDD = "MIDLERTIDIG_LONNSTILSKUDD",
  OKONOMISK_STOTTE = "OKONOMISK_STOTTE",
  INGEN_RETTIGHETER = "INGEN_RETTIGHETER",
  EKSPERTBISTAND = "EKSPERTBISTAND",
}

export interface StandardTekst {
  key: StandardtekstKey;
  label: string;
  text: string;
}

const referatStandardTekster: StandardTekst[] = [
  {
    key: StandardtekstKey.IKKE_BEHOV,
    label: "Ikke behov for bistand fra NAV nå",
    text: "Slik situasjonen er nå, er det ikke behov for noen spesiell bistand fra NAV. Dere kan likevel be om nytt dialogmøte når dere har behov for det.",
  },
  {
    key: StandardtekstKey.FRISKMELDING_ARBEIDSFORMIDLING,
    label: "Friskmelding til arbeidsformidling",
    text: "Denne ordningen er aktuell hvis helsen din er slik at du kan komme tilbake i arbeid, men ikke til den jobben du er sykmeldt fra. Hvis alle muligheter for å komme tilbake til arbeidsplassen din er forsøkt, kan du få sykepenger i inntil 12 uker mens du søker ny jobb. Maksimal periode med sykepenger er 52 uker, inkludert ukene med friskmelding til arbeidsformidling.",
  },
  {
    key: StandardtekstKey.AVKLARING_ARBEIDSEVNE,
    label: "Avklaring av arbeidsevnen",
    text: "Du kan få kartlagt eller prøvd ut arbeidsevnen din. Avklaringen kan skje der du jobber eller på en annen arbeidsplass. Da undersøker vi om du kan utføre jobben med noen tilpasninger, om du kan få påfyll av kompetanse, eller om det er muligheter i et annet yrke. Avklaringen varer som regel i fire uker, men kan forlenges med inntil åtte uker ved behov.",
  },
  {
    key: StandardtekstKey.OPPFOLGINGSTILTAK,
    label: "Oppfølgingstiltak",
    text: "Du kan få støtte eller veiledning til å finne eller beholde en jobb. Tiltaket skal tilpasses dine behov ut fra mulighetene dine på arbeidsmarkedet.",
  },
  {
    key: StandardtekstKey.ARBEIDSRETTET_REHABILITERING,
    label: "Arbeidsrettet rehabilitering",
    text: "Du kan få individuell veiledning tilpasset behovet ditt, for eksempel hjelp til å kartelegge helse, arbeidsplass og funksjon. Slik kan mulighetene dine til å komme i jobb igjen bli styrket.",
  },
  {
    key: StandardtekstKey.OPPLAERING_UTDANNING,
    label: "Opplæring og utdanning",
    text: "Har du vært lenge syk, kan kurs eller utdanning ha ekstra stor betydning for å komme i jobb igjen. Kanskje kan det være aktuelt med noen kurs (arbeidsmarkedsopplæring - AMO), opplæring på videregående nivå, fagskole eller høyere utdanning.",
  },
  {
    key: StandardtekstKey.UNNTAK_ARBEIDSGIVERPERIODE,
    label: "Unntak fra arbeidsgiverperioden - langvarig eller kronisk sykdom",
    text: "De første 16 dagene av sykefraværet er det arbeidsgiveren som dekker sykepengene. Har du en kronisk eller langvarig sykdom  som gjør at du har mye fravær, kan NAV dekke sykepengene også i arbeidsgiverperioden.",
  },
  {
    key: StandardtekstKey.REISETILSKUDD,
    label: "Reisetilskudd",
    text: "Du kan få reisetilskudd i stedet for sykepenger hvis det gjør at du kan være i arbeid helt eller delvis. Reisetilskuddet dekker nødvendige ekstra reiseutgifter til og fra jobben mens du er syk, altså transportutgifter utover det du har til vanlig.",
  },
  {
    key: StandardtekstKey.HJELPEMIDLER_TILRETTELEGGING,
    label: "Hjelpemidler og tilrettelegging",
    text: "Hjelpemiddelsentralene i NAV kan bidra med både veiledning og hjelpemidler på arbeidsplassen. De finner løsninger på problemer med syn, hørsel, hukommelse, konsentrasjon, lesing, skriving eller muligheter for å bruke dataløsninger. NAV-kontoret kan sette dere i kontakt med den nærmeste hjelpemiddelsentralen.",
  },
  {
    key: StandardtekstKey.MIDLERTIDIG_LONNSTILSKUDD,
    label: "Midlertidig lønnstilskudd",
    text: "Arbeidsgiveren din kan få et tilskudd til lønnen hvis det er fare for at du ikke kommer tilbake etter tolv måneder med full eller gradert sykmelding. Med lønnstilskudd skal du utføre vanlige oppgaver, men du trenger ikke gjøre dem med full intensitet.",
  },
  {
    key: StandardtekstKey.EKSPERTBISTAND,
    label: "Tilskudd til ekspertbistand",
    text: "Dette tiltaket kan være aktuelt når du har en arbeidsgiver, men har utfordringer med å være i jobben. Målet er at du skal komme tilbake til jobb, eller annet arbeid hos samme eller en annen arbeidsgiver. Eksperten skal bidra til å kartlegge og avklare utfordringene på arbeidsplassen som fører til sykefravær, og foreslå tiltak som gjør deg i stand til å utføre arbeidet ditt. Det er arbeidsgiveren din som søker om tilskuddet.",
  },
  {
    key: StandardtekstKey.OKONOMISK_STOTTE,
    label: "Hjelp til å søke om annen økonomisk støtte",
    text: "Klarer du ikke å komme tilbake i arbeid før den siste dagen du har rett til sykepenger, trenger vi et nytt dialogmøte. Da vil vi snakke sammen om hvordan du eventuelt kan søke om annen økonomisk støtte fra NAV.",
  },
  {
    key: StandardtekstKey.INGEN_RETTIGHETER,
    label: "Ingen videre rettigheter",
    text: "Slik situasjonen er nå, har du ikke krav på noen utbetalinger fra NAV. Det betyr at du må gå tilbake til arbeidet eller søke ny jobb. Du er velkommen til å se etter stillinger på arbeidsplassen.nav.no",
  },
];

const referatStandardTeksterNynorsk: StandardTekst[] = [
  {
    key: StandardtekstKey.IKKE_BEHOV,
    label: "Ikkje behov for bistand frå NAV no",
    text: "Slik situasjonen er no, er det ikkje behov for spesiell bistand frå NAV. De kan likevel be om nytt dialogmøte når de treng det.",
  },
  {
    key: StandardtekstKey.FRISKMELDING_ARBEIDSFORMIDLING,
    label: "Friskmelding til arbeidsformidling",
    text: "Denne ordninga er aktuell dersom helsa di er slik at du kan kome tilbake i arbeid, men ikkje til den jobben du er sjukmeld frå. Dersom alle moglegheiter for å kome tilbake til arbeidsplassen din er forsøkt, kan du få sjukepengar i inntil 12 veker medan du søkjer ny jobb. Maksimal periode med sjukepengar er 52 veker, inkludert vekene med friskmelding til arbeidsformidling.",
  },
  {
    key: StandardtekstKey.AVKLARING_ARBEIDSEVNE,
    label: "Avklaring av arbeidsevne",
    text: "Du kan få kartlagt eller prøvd ut arbeidsevna di. Avklaringa kan skje der du jobbar, eller på ein annan arbeidsplass. Vi undersøkjer då om du kan utføre jobben med enkelte tilpassingar, om du kan få påfyll av kompetanse, eller om eit anna yrke kan vere aktuelt. Avklaringa varer som regel i fire veker, men kan forlengast med inntil åtte veker ved behov.",
  },
  {
    key: StandardtekstKey.OPPFOLGINGSTILTAK,
    label: "Oppfølgingstiltak",
    text: "Du kan få støtte eller rettleiing til å behalde jobben din eller finne ein ny. Tiltaket skal tilpassast behova dine ut frå moglegheitene du har på arbeidsmarknaden.",
  },
  {
    key: StandardtekstKey.ARBEIDSRETTET_REHABILITERING,
    label: "Arbeidsretta rehabilitering",
    text: "Du kan få individuell rettleiing tilpassa behovet ditt (t.d. hjelp til å kartleggje helse, arbeidsplass og funksjon). Dette aukar sjansane dine til å kome i jobb att.",
  },
  {
    key: StandardtekstKey.OPPLAERING_UTDANNING,
    label: "Opplæring og utdanning",
    text: "Dersom du har vore sjuk lenge, kan kurs eller utdanning ha ekstra stor betydning for å kome i jobb att. Kanskje kan det vere aktuelt med kurs (arbeidsmarknadsopplæring – AMO), opplæring på vidaregåande nivå, fagskule eller høgare utdanning.",
  },
  {
    key: StandardtekstKey.UNNTAK_ARBEIDSGIVERPERIODE,
    label: "Unntak frå arbeidsgivarperiode – langvarig eller kronisk sjukdom",
    text: "Dei første 16 dagane av sjukefråværet er det arbeidsgivaren som dekkjer sjukepengane. Dersom du har mykje fråvær grunna kronisk eller langvarig sjukdom, kan NAV dekke sjukepengane i arbeidsgivarperioden.",
  },
  {
    key: StandardtekstKey.REISETILSKUDD,
    label: "Reisetilskot",
    text: "Du kan få reisetilskot i staden for sjukepengar viss det gjer at du kan vere heilt eller delvis i arbeid. Reisetilskotet dekkjer nødvendige ekstra reiseutgifter til og frå jobben medan du er sjuk, altså transportutgifter utover dei du har til vanleg.",
  },
  {
    key: StandardtekstKey.HJELPEMIDLER_TILRETTELEGGING,
    label: "Hjelpemiddel og tilrettelegging",
    text: "Hjelpemiddelsentralane i NAV kan bidra med både rettleiing og hjelpemiddel på arbeidsplassen. Dei finn løysingar på problem med syn, høyrsel, hugs, konsentrasjon, lesing, skriving eller moglegheiter for å bruke dataløysingar. NAV-kontoret kan setje dykk i kontakt med nærmaste hjelpemiddelsentral.",
  },
  {
    key: StandardtekstKey.MIDLERTIDIG_LONNSTILSKUDD,
    label: "Mellombels lønstilskot",
    text: "Arbeidsgivaren din kan få tilskot til løna dersom det er fare for at du ikkje kjem tilbake etter tolv månader med full eller gradert sjukmelding. Med lønstilskot skal du utføre vanlege oppgåver, men du treng ikkje gjere dei med full intensitet.",
  },
  {
    key: StandardtekstKey.EKSPERTBISTAND,
    label: "Tilskot til ekspertbistand",
    text: "Dette tiltaket kan vere aktuelt når du har ein arbeidsgivar, men har utfordringar med å vere i arbeid. Målet er at du skal kome tilbake til det same arbeidet, eller anna arbeid hos same eller ein annan arbeidsgivar. Eksperten skal bidra til å kartleggje og avklare utfordringane på arbeidsplassen som fører til sjukefråvær, og foreslå tiltak som gjer deg i stand til å utføre arbeidet ditt. Det er arbeidsgivaren din som søker om tilskot.",
  },
  {
    key: StandardtekstKey.OKONOMISK_STOTTE,
    label: "Hjelp til å søkje om anna økonomisk støtte",
    text: "Viss du ikkje klarer å kome tilbake i arbeid før den siste dagen du har rett til sjukepengar, må det avtalast eit nytt dialogmøte. Vi tek då ein prat saman om korleis du eventuelt kan søkje om anna økonomisk støtte frå NAV.",
  },
  {
    key: StandardtekstKey.INGEN_RETTIGHETER,
    label: "Ingen vidare rettar",
    text: "Slik situasjonen din er no, har du ikkje krav på utbetalingar frå NAV. Det betyr at du må gå tilbake til jobben eller søkje ny jobb. Ta gjerne ein kik på ledige stillingar på arbeidsplassen.nav.no.",
  },
];

const referatTextsBokmal = {
  nyttHeader: "Referat fra dialogmøte",
  endretHeader: "Endret referat fra dialogmøte",
  deltakereTitle: "Deltakere i møtet",
  deltakere: {
    arbeidsgiver: "Fra arbeidsgiver",
    arbeidstaker: "Arbeidstaker",
    nav: "Fra NAV",
    behandler: "Behandler",
    deltakelse: "deltok ikke",
  },
  endring:
    "Dette referatet er en endring av et referat du har mottatt tidligere. Dette referatet erstatter det forrige, og det forrige referatet er derfor utdatert.",
  begrunnelseEndringTitle: "Årsaken til at referatet er endret",
  intro1:
    "Formålet med dialogmøtet var å oppsummere situasjonen, drøfte mulighetene for å arbeide og legge en plan for tiden framover.",
  intro2:
    "Sykdom og diagnose er underlagt taushetsplikt. Derfor er helsen din bare et tema hvis du selv velger å være åpen om den. Av hensyn til personvernet inneholder referatet uansett ikke slike opplysninger. Se artikkel 9, Lov om behandling av personopplysninger.",
  detteSkjeddeHeader: "Dette skjedde i møtet",
  konklusjonTitle: "Konklusjon",
  arbeidstakersOppgaveTitle: "Din oppgave",
  arbeidsgiversOppgaveTitle: "Arbeidsgiverens oppgave",
  navOppgaveTitle: "NAVs oppgave",
  behandlersOppgave: "Behandlerens oppgave",
  situasjonTitle: "Situasjon og muligheter",
  standardTeksterHeader: "Dette informerte NAV om i møtet",
  standardTekster: referatStandardTekster,
};

const referatTextsNynorsk = {
  nyttHeader: "Referat frå dialogmøte",
  endretHeader: "Endra referat frå dialogmøte",
  deltakereTitle: "Deltakarar i møtet",
  deltakere: {
    arbeidsgiver: "Frå arbeidsgivar",
    arbeidstaker: "Arbeidstakar",
    nav: "Frå NAV",
    behandler: "Behandlar",
    deltakelse: "deltok ikkje",
  },
  endring:
    "Dette referatet er ein endra versjon av eit referat du har motteke tidlegare. Dette referatet erstattar det førre, og det førre referatet er difor utdatert.",
  begrunnelseEndringTitle: "Årsaka til at referatet er endra",
  intro1:
    "Målet med dialogmøtet var å oppsummere situasjonen din, drøfte moglegheitene dine for å jobbe, og leggje ein plan for tida framover.",
  intro2:
    "Sjukdom og diagnose er informasjon som er underlagt teieplikt. Helsa di er såleis berre eit tema dersom du sjølv vel å vere open om henne. Av omsyn til personvernet inneheld referatet uansett ikkje slike opplysingar. Sjå artikkel 9, Lov om behandling av personopplysingar.",
  detteSkjeddeHeader: "Dette skjedde i møtet",
  konklusjonTitle: "Konklusjon",
  arbeidstakersOppgaveTitle: "Di oppgåve",
  arbeidsgiversOppgaveTitle: "Oppgåva til arbeidsgivar",
  navOppgaveTitle: "Oppgåva til NAV",
  behandlersOppgave: "Oppgåva til behandlar",
  situasjonTitle: "Situasjon og moglegheiter",
  standardTeksterHeader: "Dette informerte NAV om i møtet",
  standardTekster: referatStandardTeksterNynorsk,
};

export const getReferatTexts = (malform: Malform) => {
  return malform === Malform.NYNORSK ? referatTextsNynorsk : referatTextsBokmal;
};

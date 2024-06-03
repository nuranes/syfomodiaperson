import {
  DialogmotedeltakerArbeidsgiverVarselDTO,
  DialogmotedeltakerArbeidstakerVarselDTO,
  DialogmotedeltakerBehandlerDTO,
  DialogmotedeltakerBehandlerVarselDTO,
  DialogmotedeltakerVarselDTO,
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  SvarType,
  VarselSvarDTO,
} from "../../src/data/dialogmote/types/dialogmoteTypes";
import { BehandlerType } from "../../src/data/behandler/BehandlerDTO";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { ReferatDTO } from "../../src/data/dialogmote/types/dialogmoteReferatTypes";
import { getReferatTexts } from "../../src/data/dialogmote/dialogmoteTexts";
import dayjs from "dayjs";
import { DocumentComponentType } from "../../src/data/documentcomponent/documentComponentTypes";
import { Malform } from "../../src/context/malform/MalformContext";
import { addDays } from "../../src/utils/datoUtils";

type VarselOpts = {
  varselType: MotedeltakerVarselType.INNKALT | MotedeltakerVarselType.AVLYST;
  uuid: string;
  svar?: VarselSvarDTO;
};

const createVarsel = ({
  svar,
  uuid,
  varselType,
}: VarselOpts): DialogmotedeltakerVarselDTO => {
  switch (varselType) {
    case MotedeltakerVarselType.INNKALT: {
      return {
        uuid: uuid + 2,
        createdAt: "2021-05-26T12:56:26.271381",
        varselType: varselType,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum",
        ...(svar ? { svar } : {}),
        document: [
          {
            type: DocumentComponentType.PARAGRAPH,
            title: "Tittel innkalling",
            texts: [],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            title: "Møtetid:",
            texts: ["5. mai 2021"],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            texts: ["Brødtekst"],
          },
          {
            type: DocumentComponentType.LINK,
            texts: ["https://nav.no/"],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            texts: ["Med vennlig hilsen", "NAV Staden", "Kari Saksbehandler"],
          },
        ],
      };
    }
    case MotedeltakerVarselType.AVLYST: {
      return {
        uuid: uuid + 4,
        createdAt: "2021-05-26T12:56:26.271381",
        varselType: varselType,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum",
        ...(svar ? { svar } : {}),
        document: [
          {
            type: DocumentComponentType.PARAGRAPH,
            title: "Avlysning",
            texts: [],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            title: "Møtetid:",
            texts: ["5. mai 2021"],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            texts: ["Brødtekst"],
          },
          {
            type: DocumentComponentType.LINK,
            texts: ["https://nav.no/"],
          },
          {
            type: DocumentComponentType.PARAGRAPH,
            texts: ["Med vennlig hilsen", "NAV Staden", "Kari Saksbehandler"],
          },
        ],
      };
    }
  }
};

export const createDialogmote = (
  uuid: string,
  moteStatus: DialogmoteStatus,
  moteTid: Date,
  behandler?: DialogmotedeltakerBehandlerDTO
) => {
  const arbeidstakerVarselList: DialogmotedeltakerArbeidstakerVarselDTO[] = [
    {
      ...createVarsel({
        svar: {
          svarTidspunkt: addDays(moteTid, -3).toJSON(),
          svarType: SvarType.KOMMER,
        },
        uuid,
        varselType: MotedeltakerVarselType.INNKALT,
      }),
      digitalt: true,
    },
  ];
  const arbeidsgiverVarselList: DialogmotedeltakerArbeidsgiverVarselDTO[] = [
    {
      ...createVarsel({
        svar: {
          svarTidspunkt: addDays(moteTid, -3).toJSON(),
          svarTekst: "Passer ikke denne dagen.",
          svarType: SvarType.NYTT_TID_STED,
        },
        uuid,
        varselType: MotedeltakerVarselType.INNKALT,
      }),
      status: "",
    },
  ];
  const behandlerVarselList: DialogmotedeltakerBehandlerVarselDTO[] = [
    {
      uuid: uuid + 5,
      createdAt: "2021-05-26T12:56:26.271381",
      varselType: MotedeltakerVarselType.INNKALT,
      fritekst: "Ipsum lorum behandler",
      document: [],
      svar: [
        {
          uuid: uuid + 6,
          createdAt: "2021-12-05T14:56:26.282386",
          svarType: SvarType.KOMMER,
          tekst: "Jeg kommer i møtet.",
        },
        {
          uuid: uuid + 7,
          createdAt: "2021-12-04T13:56:26.282386",
          svarType: SvarType.NYTT_TID_STED,
          tekst: "Jeg vil endre møtet!",
        },
        {
          uuid: uuid + 8,
          createdAt: "2021-12-03T12:56:26.282386",
          svarType: SvarType.KOMMER_IKKE,
          tekst: "Jeg kommer IKKE!!!!!! i møtet.",
        },
      ],
    },
  ];

  if (moteStatus === DialogmoteStatus.AVLYST) {
    arbeidstakerVarselList.push({
      ...createVarsel({
        uuid,
        varselType: MotedeltakerVarselType.AVLYST,
      }),
      digitalt: true,
    });
    arbeidsgiverVarselList.push({
      ...createVarsel({
        uuid,
        varselType: MotedeltakerVarselType.AVLYST,
      }),
      status: "",
    });
    behandlerVarselList.push({
      uuid: uuid + 5,
      createdAt: addDays(moteTid, -4).toJSON(),
      varselType: MotedeltakerVarselType.AVLYST,
      fritekst: "Ipsum lorum behandler",
      document: [],
      svar: [],
    });
  }

  const dialogMote: DialogmoteDTO = {
    uuid: uuid,
    createdAt: addDays(moteTid, -4).toJSON(),
    updatedAt: addDays(moteTid, -4).toJSON(),
    status: moteStatus,
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
    tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
    arbeidstaker: {
      personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
      type: "ARBEIDSTAKER",
      varselList: arbeidstakerVarselList,
    },
    arbeidsgiver: {
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      type: "ARBEIDSGIVER",
      varselList: arbeidsgiverVarselList,
    },
    ...(behandler
      ? {
          behandler: {
            ...behandler,
            varselList: behandlerVarselList,
          },
        }
      : {}),
    sted: "This is a very lang text that has a lot of characters and describes where the meeting will take place.",
    tid: moteTid.toJSON(),
    videoLink: "https://video.nav.no/xyz",
    referatList: [],
  };

  if (moteStatus === DialogmoteStatus.FERDIGSTILT) {
    return {
      ...dialogMote,
      referatList: [createReferat(true, dialogMote.tid)],
    };
  }

  return dialogMote;
};

export const createReferat = (
  ferdigstilt: boolean,
  tid: string
): ReferatDTO => {
  const standardTekst = getReferatTexts(Malform.BOKMAL).standardTekster[0];
  return {
    uuid: "520239a6-a973-42f6-a4e7-9fe7d27d2f93",
    createdAt: tid,
    updatedAt: tid,
    ferdigstilt,
    narmesteLederNavn: "Tatten Tattover",
    situasjon: "Dette er en beskrivelse av situasjonen",
    konklusjon: "Dette er en beskrivelse av konklusjon",
    arbeidstakerOppgave: "Dette er en beskrivelse av arbeidstakerOppgave",
    arbeidsgiverOppgave: "Dette er en beskrivelse av arbeidsgiverOppgave",
    veilederOppgave: "Dette er en beskrivelse av veilederOppgave",
    document: [
      {
        type: DocumentComponentType.HEADER_H1,
        title: "Tittel referat",
        texts: [],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        texts: ["Brødtekst"],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        key: standardTekst.key,
        title: standardTekst.label,
        texts: [standardTekst.text],
      },
    ],
    andreDeltakere: [
      {
        funksjon: "Verneombud",
        navn: "Tøff Pyjamas",
      },
    ],
  };
};

const behandler = (uuid: string): DialogmotedeltakerBehandlerDTO => {
  return {
    uuid: uuid + 4,
    personIdent: "01038521470",
    behandlerRef: uuid + 5,
    behandlerNavn: "Lego Legesen",
    behandlerKontor: "Fastlegekontoret",
    behandlerType: BehandlerType.FASTLEGE,
    type: "BEHANDLER",
    varselList: [],
    deltatt: true,
    mottarReferat: true,
  };
};

export const innkaltDialogmote = createDialogmote(
  "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
  DialogmoteStatus.INNKALT,
  dayjs().add(2, "days").toDate()
);
export const avlystDialogmote = createDialogmote(
  "2",
  DialogmoteStatus.AVLYST,
  dayjs().subtract(2, "weeks").toDate()
);
export const ferdigstiltDialogmote = createDialogmote(
  "3",
  DialogmoteStatus.FERDIGSTILT,
  dayjs().subtract(2, "years").toDate()
);

export const innkaltDialogmoteMedBehandler = createDialogmote(
  "4",
  DialogmoteStatus.INNKALT,
  dayjs().add(2, "days").toDate(),
  behandler("4")
);

export const dialogmoterMock = [
  innkaltDialogmote,
  avlystDialogmote,
  ferdigstiltDialogmote,
  innkaltDialogmoteMedBehandler,
];

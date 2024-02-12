import React from "react";
import { expect } from "chai";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import {
  arbeidsgiver,
  arbeidstaker,
  mote,
  moteTekster,
  navEnhet,
} from "../testData";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../../testUtils";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../../../mock/common/mockConstants";
import { DialogmoteInnkallingDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { renderWithRouter } from "../../testRouterUtils";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import userEvent from "@testing-library/user-event";
import { getInnkallingTexts } from "@/data/dialogmote/dialogmoteTexts";
import { brukerinfoMock } from "../../../mock/syfoperson/persondataMock";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import {
  DialogmoteInnkallingSkjema,
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import { BehandlerDTO, BehandlerType } from "@/data/behandler/BehandlerDTO";

let queryClient: QueryClient;

const fastlege = {
  type: BehandlerType.FASTLEGE,
  behandlerRef: "123",
  fornavn: "Lego",
  mellomnavn: "Las",
  etternavn: "Legesen",
};
const behandlere: BehandlerDTO[] = [fastlege];

const renderDialogmoteInnkallingSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MalformProvider>
          <DialogmoteInnkallingSkjema />
        </MalformProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );
};

describe("DialogmoteInnkallingSkjema", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("shows a list of behandlere and possibility to add behandler", () => {
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => behandlere
    );
    renderDialogmoteInnkallingSkjema();

    expect(screen.getByRole("radio", { name: "Legg til en behandler" })).to
      .exist;
    expect(screen.getByRole("radio", { name: "Ingen behandler" })).to.exist;
    expect(screen.getByRole("radio", { name: "Fastlege: Lego Las Legesen" })).to
      .exist;
  });

  it("Possible to add behandler when no suggested behandlere", () => {
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => []
    );
    renderDialogmoteInnkallingSkjema();

    expect(screen.getByRole("radio", { name: "Legg til en behandler" })).to
      .exist;
  });

  it("viser advarsel om papirpost når bruker ikke kan varsles digitalt", () => {
    const kanIkkeVarsles = {
      ...brukerinfoMock,
      kontaktinfo: {
        ...brukerinfoMock.kontaktinfo,
        skalHaVarsel: false,
      },
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kanIkkeVarsles
    );
    renderDialogmoteInnkallingSkjema();

    expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
    expect(screen.getByText(texts.reservertAlert)).to.exist;
  });
  it("viser ikke advarsel om papirpost når bruker kan varsles digitalt", () => {
    const kanVarsles = {
      ...brukerinfoMock,
      kontaktinfo: {
        ...brukerinfoMock.kontaktinfo,
        skalHaVarsel: true,
      },
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => kanVarsles
    );
    renderDialogmoteInnkallingSkjema();

    expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
    expect(screen.queryByText(texts.reservertAlert)).to.not.exist;
  });

  it("validerer arbeidsgiver, dato, tid og sted", async () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(await screen.findByText(valideringsTexts.orgMissing)).to.exist;
    expect(await screen.findByText(/Vennligst angi en gyldig dato/)).to.exist;
    expect(await screen.findByText(valideringsTexts.timeMissing)).to.exist;
    expect(await screen.findByText(texts.stedMissing)).to.exist;
  });

  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(await screen.findByText(valideringsTexts.orgMissing)).to.exist;
    expect(await screen.findByText(/Vennligst angi en gyldig dato/)).to.exist;
    expect(await screen.findByText(valideringsTexts.timeMissing)).to.exist;
    expect(await screen.findByText(texts.stedMissing)).to.exist;

    passSkjemaInput();

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryByText(valideringsTexts.orgMissing)).to.not.exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(/Vennligst angi en gyldig dato/)).to.not.exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(valideringsTexts.timeMissing)).to.not.exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(texts.stedMissing)).to.not.exist;
    });

    // Tøm felt for sted
    const stedInput = getTextInput("Sted");
    changeTextInput(stedInput, "");

    // Feilmelding vises
    expect(await screen.findByText(texts.stedMissing)).to.exist;
  });

  it("oppretter innkalling med verdier fra skjema", async () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    clickButton("Send innkallingene");

    await waitFor(() => {
      const innkallingMutation = queryClient.getMutationCache().getAll()[0];
      const expectedInnkallingDto = {
        arbeidsgiver: {
          virksomhetsnummer: arbeidsgiver.orgnr,
          fritekstInnkalling: moteTekster.fritekstTilArbeidsgiver,
          innkalling: expectedInnkallingDocuments.arbeidsgiver(),
        },
        arbeidstaker: {
          personIdent: arbeidstaker.personident,
          fritekstInnkalling: moteTekster.fritekstTilArbeidstaker,
          innkalling: expectedInnkallingDocuments.arbeidstaker(),
        },
        tidSted: {
          sted: mote.sted,
          tid: mote.datoTid,
          videoLink: mote.videolink,
        },
      };

      expect(innkallingMutation.state.variables).to.deep.equal(
        expectedInnkallingDto
      );
    });

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .not.exist;
    expect(screen.getByText("Nærmeste leder")).to.exist;
    expect(screen.getByText("Epost")).to.exist;
  });

  it("viser alertstripe hvis valgt arbeidsgiver ikke har registrert nærmeste leder", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();
    const virksomhetRadio = screen.getByRole("radio", {
      name: `Fant ikke virksomhetsnavn for ${VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer}`,
    });
    fireEvent.click(virksomhetRadio);

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .exist;
    expect(screen.queryByText("Nærmeste leder")).to.not.exist;
    expect(screen.queryByText("Epost")).to.not.exist;
  });

  it("viser ekstra radioknapp for virksomhet hvis det ikke finnes oppfølgingstilfelle eller ledere", () => {
    const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
      personIdent: arbeidstaker.personident,
      oppfolgingstilfelleList: [],
    };
    queryClient.setQueryData(
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
        arbeidstaker.personident
      ),
      () => oppfolgingstilfellePerson
    );
    queryClient.setQueryData(
      ledereQueryKeys.ledere(arbeidstaker.personident),
      () => []
    );
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    const virksomhetRadio = screen.getByRole("radio", {
      name: "Oppgi virksomhetsnummer",
    });
    fireEvent.click(virksomhetRadio);

    const virksomhetInput = getTextInput("Oppgi virksomhetsnummer");
    changeTextInput(virksomhetInput, "123456789");

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .not.exist;
    expect(screen.queryByText("Nærmeste leder")).to.not.exist;
    expect(screen.queryByText("Epost")).to.not.exist;
  });

  it("velger virksomhet automatisk hvis det kun er én virksomhet", () => {
    const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
      personIdent: arbeidstaker.personident,
      oppfolgingstilfelleList: [],
    };
    queryClient.setQueryData(
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
        arbeidstaker.personident
      ),
      () => oppfolgingstilfellePerson
    );
    queryClient.setQueryData(
      ledereQueryKeys.ledere(arbeidstaker.personident),
      () => [LEDERE_DEFAULT[0]]
    );
    stubInnkallingApi(apiMock());

    renderDialogmoteInnkallingSkjema();
    const virksomhetSelect = screen.getByRole("radio", {
      name: `Fant ikke virksomhetsnavn for ${arbeidsgiver.orgnr}`,
    });
    const virksomhetRadio = screen.getByRole("radio", {
      name: "Oppgi virksomhetsnummer",
    });

    expect(virksomhetSelect).to.exist;
    expect(virksomhetRadio).to.exist;
    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .not.exist;
    expect(screen.getByText("Nærmeste leder")).to.exist;
    expect(screen.getByText("Epost")).to.exist;
  });

  it("trimmer videolenke i innkallingen som sendes til api", async () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const link = "https://video.nav.no/abc";
    const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
    const linkWithWhitespace = `   ${link}  `;
    changeTextInput(videoLinkInput, linkWithWhitespace);
    clickButton("Send innkallingene");

    let innkallingMutation;
    await waitFor(() => {
      innkallingMutation = queryClient.getMutationCache().getAll()[0];
      expect(innkallingMutation).to.exist;
    });

    const {
      tidSted: { videoLink },
      arbeidsgiver,
      arbeidstaker,
    } = innkallingMutation.state
      .variables as unknown as DialogmoteInnkallingDTO;

    const linkDocumentComponents = [
      ...arbeidsgiver.innkalling,
      ...arbeidstaker.innkalling,
    ].filter((d) => d.type === DocumentComponentType.LINK);

    expect(linkDocumentComponents).to.have.length(2);
    linkDocumentComponents.forEach((documentComponentLink) =>
      expect(documentComponentLink.texts[0]).to.equal(link)
    );
    expect(videoLink).to.equal(link);
  });

  it("velger nynorske brev og endrer tekstene", () => {
    renderDialogmoteInnkallingSkjema();

    const malformRadio = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    userEvent.click(malformRadio);

    const forhandsvisningButton = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    })[0];
    userEvent.click(forhandsvisningButton);

    expect(
      screen.getByText(getInnkallingTexts(Malform.NYNORSK).arbeidstaker.intro2)
    ).to.exist;
  });
});

const passSkjemaInput = () => {
  const virksomhetSelect = screen.getByRole("radio", {
    name: `Fant ikke virksomhetsnavn for ${arbeidsgiver.orgnr}`,
  });
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const fritekstArbeidstakerInput = getTextInput(
    "Fritekst til arbeidstakeren (valgfri)"
  );
  const fritekstArbeidsgiverInput = getTextInput(
    "Fritekst til nærmeste leder (valgfri)"
  );

  const behandlerSelect = screen.getByRole("radio", {
    name: `Ingen behandler`,
  });

  fireEvent.click(virksomhetSelect);
  fireEvent.click(behandlerSelect);
  changeTextInput(datoInput, mote.dato);
  fireEvent.blur(datoInput);
  changeTextInput(klokkeslettInput, mote.klokkeslett);
  changeTextInput(stedInput, mote.sted);
  changeTextInput(videoLinkInput, mote.videolink);
  changeTextInput(
    fritekstArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker
  );
  changeTextInput(
    fritekstArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver
  );
};

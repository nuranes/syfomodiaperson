import React from "react";
import { expect } from "chai";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { QueryClientProvider } from "react-query";
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
import { fireEvent, screen } from "@testing-library/react";
import { changeTextInput, clickButton, getTextInput } from "../../testUtils";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import sinon from "sinon";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { VIRKSOMHET_UTEN_NARMESTE_LEDER } from "../../../mock/common/mockConstants";
import {
  DialogmoteInnkallingDTO,
  DocumentComponentType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { renderWithRouter } from "../../testRouterUtils";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

let queryClient: any;

describe("DialogmoteInnkallingSkjema", () => {
  let clock: any;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer arbeidsgiver, dato, tid og sted", () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(screen.getAllByText(valideringsTexts.orgMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.dateMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.timeMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(screen.getByRole("link", { name: valideringsTexts.orgMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.dateMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.timeMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.placeMissing })).to
      .exist;
  });

  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderDialogmoteInnkallingSkjema();
    clickButton("Send innkallingene");

    expect(screen.getAllByText(valideringsTexts.orgMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.dateMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.timeMissing)).to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(screen.getByRole("link", { name: valideringsTexts.orgMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.dateMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.timeMissing })).to
      .exist;
    expect(screen.getByRole("link", { name: valideringsTexts.placeMissing })).to
      .exist;

    passSkjemaInput();

    // Feilmeldinger og feiloppsummering forsvinner
    expect(screen.queryAllByText(valideringsTexts.orgMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.dateMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.timeMissing)).to.be.empty;
    expect(screen.queryAllByText(valideringsTexts.placeMissing)).to.be.empty;

    // Tøm felt for sted
    const stedInput = getTextInput("Sted");
    changeTextInput(stedInput, "");

    // Feilmelding vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.have.length(
      1
    );

    clickButton("Send innkallingene");
    expect(screen.getAllByText(valideringsTexts.placeMissing)).to.have.length(
      2
    );
  });

  it("oppretter innkalling med verdier fra skjema", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    clickButton("Send innkallingene");

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

    expect(innkallingMutation.options.variables).to.deep.equal(
      expectedInnkallingDto
    );

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .not.exist;
    expect(screen.queryByLabelText("Nærmeste leder")).to.exist;
    expect(screen.queryByLabelText("Epost")).to.exist;
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
    expect(screen.queryByLabelText("Nærmeste leder")).to.not.exist;
    expect(screen.queryByLabelText("Epost")).to.not.exist;
  });

  it("viser ekstra radioknapp for virksomhet hvis det ikke finnes oppfølgingstilfelle", () => {
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
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    const virksomhetRadio = screen.getByRole("radio", {
      name: "Oppgi virksomhetsnummer",
    });
    fireEvent.click(virksomhetRadio);

    const virksomhetInput = getTextInput("Oppgi virksomhetsnummer");
    changeTextInput(virksomhetInput, "123456789");

    expect(screen.queryByText(/Det er ikke registrert en nærmeste leder/i)).to
      .exist;
    expect(screen.queryByLabelText("Nærmeste leder")).to.not.exist;
    expect(screen.queryByLabelText("Epost")).to.not.exist;
  });

  it("trimmer videolenke i innkallingen som sendes til api", () => {
    stubInnkallingApi(apiMock());
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const link = "https://video.nav.no/abc";
    const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
    const linkWithWhitespace = `   ${link}  `;
    changeTextInput(videoLinkInput, linkWithWhitespace);
    clickButton("Send innkallingene");

    const innkallingMutation = queryClient.getMutationCache().getAll()[0];
    const {
      tidSted: { videoLink },
      arbeidsgiver,
      arbeidstaker,
    } = innkallingMutation.options.variables as DialogmoteInnkallingDTO;

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
});

const renderDialogmoteInnkallingSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteInnkallingSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );
};

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

  fireEvent.click(virksomhetSelect);
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

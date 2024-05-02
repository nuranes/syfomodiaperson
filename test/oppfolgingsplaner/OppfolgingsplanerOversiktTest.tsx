import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { render, screen, within } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { expect } from "chai";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import dayjs from "dayjs";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import OppfolgingsplanerOversikt from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanerOversikt";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { generateUUID } from "@/utils/uuidUtils";

let queryClient: QueryClient;

const renderOppfolgingsplanerOversikt = (
  oppfolgingsplanerLPS: OppfolgingsplanLPS[]
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <OppfolgingsplanerOversikt
          aktivePlaner={[]}
          inaktivePlaner={[]}
          fnr={ARBEIDSTAKER_DEFAULT.personIdent}
          oppfolgingsplanerLPS={oppfolgingsplanerLPS}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("Oppfølgingsplaner visning", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
  });

  it("Sorterer ubehandlede oppfølgingsplan-LPSer etter opprettet dato", () => {
    const olderOppfolgingsplan = createOppfolgingsplanLps(90, false);
    const newerOppfolgingsplan = createOppfolgingsplanLps(10, false);

    renderOppfolgingsplanerOversikt([
      olderOppfolgingsplan,
      newerOppfolgingsplan,
    ]);

    const olderDate = restdatoTilLesbarDato(olderOppfolgingsplan.opprettet);
    const newerDate = restdatoTilLesbarDato(newerOppfolgingsplan.opprettet);

    const oppfolgingsplanerLPS = screen.getAllByTestId("oppfolgingsplan-lps");

    expect(oppfolgingsplanerLPS.length).to.equal(2);
    expect(oppfolgingsplanerLPS[0].textContent).to.contain(newerDate);
    expect(within(oppfolgingsplanerLPS[0]).getByText("Marker som behandlet")).to
      .exist;
    expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
    expect(within(oppfolgingsplanerLPS[1]).getByText("Marker som behandlet")).to
      .exist;
  });

  it("Sorterer behandlede oppfølgingsplan-LPSer etter opprettet dato", () => {
    const olderOppfolgingsplan = createOppfolgingsplanLps(90, true);
    const newerOppfolgingsplan = createOppfolgingsplanLps(10, true);

    renderOppfolgingsplanerOversikt([
      olderOppfolgingsplan,
      newerOppfolgingsplan,
    ]);

    const olderDate = restdatoTilLesbarDato(olderOppfolgingsplan.opprettet);
    const newerDate = restdatoTilLesbarDato(newerOppfolgingsplan.opprettet);

    const oppfolgingsplanerLPS = screen.getAllByTestId("oppfolgingsplan-lps");

    expect(oppfolgingsplanerLPS.length).to.equal(2);
    expect(oppfolgingsplanerLPS[0].textContent).to.contain(newerDate);
    expect(within(oppfolgingsplanerLPS[0]).queryByText("Marker som behandlet"))
      .to.be.null;
    expect(oppfolgingsplanerLPS[1].textContent).to.contain(olderDate);
    expect(within(oppfolgingsplanerLPS[1]).queryByText("Marker som behandlet"))
      .to.be.null;
  });
});

const createOppfolgingsplanLps = (
  daysSinceOpprettet: number,
  behandlet: boolean
): OppfolgingsplanLPS => {
  const oppfolgingsplanLPS = {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: dayjs().subtract(daysSinceOpprettet, "days").toJSON(),
    sistEndret: new Date().toDateString(),
  };

  const existingPersonOppgaver =
    queryClient.getQueryData<PersonOppgave[]>(
      personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent)
    ) || [];
  queryClient.setQueryData(
    personoppgaverQueryKeys.personoppgaver(ARBEIDSTAKER_DEFAULT.personIdent),
    () => [
      ...existingPersonOppgaver,
      createOppfolgingsplanLpsPersonoppgave(oppfolgingsplanLPS.uuid, behandlet),
    ]
  );

  return oppfolgingsplanLPS;
};

const createOppfolgingsplanLpsPersonoppgave = (
  referanseUuid: string,
  behandlet: boolean
): PersonOppgave => {
  return {
    uuid: generateUUID(),
    referanseUuid: referanseUuid,
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: PersonOppgaveType.OPPFOLGINGSPLANLPS,
    behandletTidspunkt: behandlet
      ? dayjs().subtract(10, "days").toDate()
      : null,
    behandletVeilederIdent: behandlet ? "Veilederident" : null,
    opprettet: new Date(),
  };
};

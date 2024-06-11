import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import { SykmeldingUtdragContainer } from "@/sider/sykepengsoknader/SykmeldingUtdragContainer";
import {
  mockSykepengeSoknad,
  mockSykmeldinger,
} from "../mockdata/sykmeldinger/mockSykmeldinger";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { QueryClientProvider } from "@tanstack/react-query";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";

let queryClient: any;

const sykmelding = mockSykmeldinger.find((s) => {
  return s.id === mockSykepengeSoknad.sykmeldingId;
});

describe("SykmeldingUtdrag", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
      () => mockSykmeldinger
    );
  });

  it("Skal vise SykmeldingUtdrag for riktig sykmelding", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SykmeldingUtdragContainer soknad={mockSykepengeSoknad} />
      </QueryClientProvider>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(sykmelding?.sykmeldingStatus?.arbeidsgiver?.orgNavn).to.equal(
      VIRKSOMHET_PONTYPANDY.virksomhetsnavn
    );
    expect(screen.getByText(VIRKSOMHET_PONTYPANDY.virksomhetsnavn)).to.exist;
  });
});

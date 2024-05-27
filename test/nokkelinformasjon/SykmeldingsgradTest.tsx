import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Sykmeldingsgrad } from "@/sider/nokkelinformasjon/sykmeldingsgrad/Sykmeldingsgrad";
import { expect } from "chai";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { sykmeldingerMock } from "../../mock/syfosmregister/sykmeldingerMock";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "../../mock/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { addDays } from "@/utils/datoUtils";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";

let queryClient: QueryClient;

const renderSykmeldingsgrad = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Sykmeldingsgrad />
    </QueryClientProvider>
  );

function setSykmeldingData(sykmelding: any[]) {
  queryClient.setQueryData(
    sykmeldingerQueryKeys.sykmeldinger(ARBEIDSTAKER_DEFAULT.personIdent),
    () => sykmelding
  );

  const oppfolgingstilfelle = sykmelding.length
    ? {
        ...oppfolgingstilfellePersonMock,
        oppfolgingstilfelleList: [
          {
            ...oppfolgingstilfellePersonMock.oppfolgingstilfelleList[0],
            start: sykmelding[0].sykmeldingsperioder[0].fom,
            end: sykmelding[0].sykmeldingsperioder[0].tom,
          },
        ],
      }
    : { ...oppfolgingstilfellePersonMock, oppfolgingstilfelleList: [] };

  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfelle
  );
}

describe("Sykmeldingsgrad", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  const sykmeldingNow = [
    {
      ...sykmeldingerMock[0],
      sykmeldingsperioder: [
        {
          fom: addDays(new Date(), -10).toString(),
          tom: addDays(new Date(), 10).toString(),
          type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
          reisetilskudd: false,
        },
      ],
    },
  ];

  const sykmeldingEarlier = [
    {
      ...sykmeldingerMock[0],
      sykmeldingsperioder: [
        {
          fom: addDays(new Date(), -30).toString(),
          tom: addDays(new Date(), -20).toString(),
          type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
          reisetilskudd: false,
        },
      ],
    },
  ];

  it("should render Sykmeldingsgrad when active tilfelle", () => {
    setSykmeldingData(sykmeldingNow);
    renderSykmeldingsgrad();

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.getByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.exist;
  });

  it("should render Sykmeldingsgrad when no sykmelding", () => {
    setSykmeldingData([]);
    renderSykmeldingsgrad();

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.queryByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.not.exist;
  });

  it("should render Sykmeldingsgrad when old tilfelle and sykmelding", () => {
    setSykmeldingData(sykmeldingEarlier);
    renderSykmeldingsgrad();

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.getByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.exist;
  });
});

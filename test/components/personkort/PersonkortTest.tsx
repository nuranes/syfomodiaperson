import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiMock } from "../../stubs/stubApi";
import { stubFastlegerApi } from "../../stubs/stubFastlegeRest";
import { render, screen } from "@testing-library/react";
import { queryClientWithAktivBruker } from "../../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../../mock/syfoperson/persondataMock";
import Personkort from "@/components/personkort/Personkort";
import { daysFromToday, getButton } from "../../testUtils";
import userEvent from "@testing-library/user-event";

let queryClient: QueryClient;
let apiMockScope: any;

const renderAndExpandPersonkort = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Personkort />
    </QueryClientProvider>
  );
  const expandable = screen.getAllByRole("button")[0];
  userEvent.click(expandable);
};

describe("Personkort", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );
    apiMockScope = apiMock();
    stubFastlegerApi(apiMockScope);
  });

  it("Skal vise Sikkerhetstiltak-button-tab hvis bruker har sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [
          {
            type: "FYUS",
            beskrivelse: "Fysisk utestengelse",
            gyldigFom: daysFromToday(-10),
            gyldigTom: daysFromToday(10),
          },
        ],
      })
    );

    renderAndExpandPersonkort();

    expect(getButton("Sikkerhetstiltak")).to.exist;
  });

  it("Skal ikke vise Sikkerhetstiltak-button-tab hvis bruker mangler sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => brukerinfoMock
    );

    renderAndExpandPersonkort();

    expect(screen.queryByRole("button", { name: "Sikkerhetstiltak" })).to.not
      .exist;
  });
});

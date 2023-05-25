import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { testQueryClient } from "../testQueryClient";
import { stubMaxdateApi } from "../stubs/stubEsyfovarsel";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

let queryClient: any;
let apiMockScope: any;

describe("maksdatoQuery", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads maksdatoDTO for valgt personident", async () => {
    stubMaxdateApi(apiMockScope, new Date("2023-12-01"));
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useMaksdatoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal({
      maxDate: {
        id: "123",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        forelopig_beregnet_slutt: "2023-12-01",
        utbetalt_tom: "2024-01-01",
        gjenstaende_sykedager: "10",
        opprettet: "2023-11-01T00:00:00.000Z",
      },
    });
  });
});

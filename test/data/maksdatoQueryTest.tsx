import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { testQueryClient } from "../testQueryClient";
import { stubMaxdateApi } from "../stubs/stubEsyfovarsel";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { maksdato, maksdatoMock } from "../../mock/syfoperson/persondataMock";

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
    stubMaxdateApi(apiMockScope, maksdato);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useMaksdatoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(maksdatoMock);
  });
});

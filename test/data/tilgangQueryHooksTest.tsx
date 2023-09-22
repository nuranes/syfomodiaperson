import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubTilgangApi } from "../stubs/stubIstilgangskontroll";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/istilgangskontroll/tilgangtilbrukerMock";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("tilgangQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads tilgang for valgt personident", async () => {
    stubTilgangApi(apiMockScope, tilgangBrukerMock);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useTilgangQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);
    expect(result.current.data).to.deep.equal(tilgangBrukerMock);
  });
});

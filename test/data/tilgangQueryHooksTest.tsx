import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubTilgangApi } from "../stubs/stubSyfotilgangskontroll";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/syfotilgangskontroll/tilgangtilbrukerMock";

let queryClient: any;
let apiMockScope: any;

describe("tilgangQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
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

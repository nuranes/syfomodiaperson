import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMock } from "../../mock/syfobehandlendeenhet/behandlendeEnhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("behandlendeEnhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads behandlende enhet for valgt personident", async () => {
    stubBehandlendeEnhetApi(apiMockScope, behandlendeEnhetMock);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBehandlendeEnhetQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(behandlendeEnhetMock);
  });
});

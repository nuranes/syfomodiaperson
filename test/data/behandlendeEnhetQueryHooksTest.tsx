import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMock } from "../../mock/syfobehandlendeenhet/behandlendeEnhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";

let queryClient: any;
let apiMockScope: any;

describe("behandlendeEnhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
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

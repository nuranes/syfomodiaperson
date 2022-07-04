import { QueryClient } from "react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubPersoninfoApi } from "../stubs/stubSyfoperson";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../mock/syfoperson/brukerinfoMock";

let queryClient: any;
let apiMockScope: any;

describe("navbrukerQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads brukerinfo for valgt personident", async () => {
    stubPersoninfoApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBrukerinfoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(brukerinfoMock);
  });
});

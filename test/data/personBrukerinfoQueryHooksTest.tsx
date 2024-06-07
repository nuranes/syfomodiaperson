import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubPersoninfoApi } from "../stubs/stubSyfoperson";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { testQueryClient } from "../testQueryClient";
import { brukerinfoMock } from "../../mock/syfoperson/persondataMock";

let queryClient: any;
let apiMockScope: any;

describe("navbrukerQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
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

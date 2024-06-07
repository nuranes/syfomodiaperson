import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { stubEgenansattApi } from "../stubs/stubSyfoperson";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("egenansattQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads egenansatt for valgt personident", async () => {
    stubEgenansattApi(apiMockScope, true);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useEgenansattQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(true);
  });
});

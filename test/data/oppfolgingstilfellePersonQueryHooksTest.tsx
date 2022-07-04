import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubOppfolgingstilfellePersonApi } from "../stubs/stubIsoppfolgingstilfelle";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

let queryClient: any;
let apiMockScope: any;

describe("oppfolgingstilfellePersonQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads oppfolgingstilfeller for valgt personident", async () => {
    stubOppfolgingstilfellePersonApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useOppfolgingstilfellePersonQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.latestOppfolgingstilfelle).to.exist;
    expect(result.current.hasActiveOppfolgingstilfelle).to.be.true;
  });
});

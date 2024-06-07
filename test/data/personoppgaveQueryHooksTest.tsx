import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { stubPersonoppgaveApi } from "../stubs/stubIspersonoppgave";
import { personoppgaverMock } from "../../mock/ispersonoppgave/personoppgaveMock";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("personoppgaveQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads personoppgaver for valgt personident", async () => {
    stubPersonoppgaveApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePersonoppgaverQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(personoppgaverMock());
  });
});

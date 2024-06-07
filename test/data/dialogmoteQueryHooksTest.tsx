import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { stubDialogmoterApi } from "../stubs/stubIsdialogmote";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { dialogmoterMock } from "../../mock/isdialogmote/dialogmoterMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("dialogmoteQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads dialogmoter for valgt personident", async () => {
    stubDialogmoterApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDialogmoterQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(dialogmoterMock);
  });
});

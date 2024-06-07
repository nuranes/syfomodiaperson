import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { stubBehandlereDialogmeldingApi } from "../stubs/stubIsdialogmelding";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("behandlereQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads behandlere for valgt personident", async () => {
    stubBehandlereDialogmeldingApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBehandlereQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(behandlereDialogmeldingMock);
  });
});

import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { stubBehandlereDialogmeldingApi } from "../stubs/stubIsdialogmelding";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";

let queryClient: any;
let apiMockScope: any;

describe("behandlereQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
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

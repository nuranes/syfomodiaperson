import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import { createStatusList } from "../../mock/ispengestopp/pengestoppStatusMock";
import { stubPengestoppStatusApi } from "../stubs/stubIspengestopp";

let queryClient: any;
let apiMockScope: any;

const today = new Date();

describe("pengestoppQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads pengestopp status for valgt personident", async () => {
    stubPengestoppStatusApi(apiMockScope, today);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePengestoppStatusQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(createStatusList(today));
  });
});

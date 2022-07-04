import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { stubVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { veilederMock } from "../../mock/syfoveileder/veilederMock";
import { queryHookWrapper } from "./queryHookTestUtils";

let queryClient: any;
let apiMockScope: any;

describe("veilederinfoQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads veilederinfo", async () => {
    stubVeilederinfoApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useVeilederinfoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(veilederMock);
  });
});

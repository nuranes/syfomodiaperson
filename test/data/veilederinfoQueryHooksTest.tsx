import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import {
  useAktivVeilederinfoQuery,
  useVeilederInfoQuery,
} from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  stubAktivVeilederinfoApi,
  stubVeilederinfoApi,
} from "../stubs/stubSyfoveileder";
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

  it("loads aktiv veilederinfo", async () => {
    stubAktivVeilederinfoApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useAktivVeilederinfoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(veilederMock);
  });

  it("loads veilederinfo for ident", async () => {
    stubVeilederinfoApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(
      () => useVeilederInfoQuery(veilederMock.ident),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(veilederMock);
  });
});

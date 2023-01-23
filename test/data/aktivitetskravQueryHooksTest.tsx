import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { aktivitetskravMock } from "../../mock/isaktivitetskrav/aktivitetskravMock";
import { stubAktivitetskravApi } from "../stubs/stubIsaktivitetskrav";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { testQueryClient } from "../testQueryClient";

let queryClient;
let apiMockScope;

describe("aktivitetskravqueryHook tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads aktivitetskrav for valgt personident", async () => {
    stubFeatureTogglesApi(apiMockScope);
    stubAktivitetskravApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useAktivitetskravQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.not.be.undefined;
    expect(result.current.data?.length).to.equal(aktivitetskravMock.length);
  });
});

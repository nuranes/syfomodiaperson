import nock from "nock";
import { apiMock } from "../../stubs/stubApi";
import { testQueryClient } from "../../testQueryClient";
import { stubAktivVeilederinfoApi } from "../../stubs/stubSyfoveileder";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { queryHookWrapper } from "../queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { mockUnleashResponse } from "../../../mock/unleashMocks";

let queryClient: any;
let apiMockScope: any;

describe("unleashQuery tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads unleash toggles", async () => {
    stubAktivVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useFeatureToggles(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);
    expect(result.current.toggles).to.deep.equal(mockUnleashResponse);
  });
});

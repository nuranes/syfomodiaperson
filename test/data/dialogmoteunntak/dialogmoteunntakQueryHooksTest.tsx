import nock from "nock";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { apiMock } from "../../stubs/stubApi";
import { queryHookWrapper } from "../queryHookTestUtils";
import { dialogmotekandidatMock } from "../../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { stubDialogmoteKandidatApi } from "../../stubs/stubIsdialogmotekandidat";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { stubAktivVeilederinfoApi } from "../../stubs/stubSyfoveileder";
import { testQueryClient } from "../../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("dialogmotekandidatQuery tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads dialogmotekandidat for valgt personident", async () => {
    stubAktivVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
    stubDialogmoteKandidatApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDialogmotekandidat(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(dialogmotekandidatMock);
  });
});

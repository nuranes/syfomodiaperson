import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { stubDiskresjonskodeApi } from "../stubs/stubSyfoperson";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";

let queryClient: any;
let apiMockScope: any;

describe("diskresjonskodeQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads diskresjonskode for valgt personident", async () => {
    stubDiskresjonskodeApi(apiMockScope, "7");
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDiskresjonskodeQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal("7");
  });
});

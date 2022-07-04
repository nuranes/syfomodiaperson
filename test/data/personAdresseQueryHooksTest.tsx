import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { stubPersonadresseApi } from "../stubs/stubSyfoperson";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";
import { personAdresseMock } from "../../mock/syfoperson/personAdresseMock";

let queryClient: any;
let apiMockScope: any;

describe("personAdresseQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads personadresse for valgt personident", async () => {
    stubPersonadresseApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePersonAdresseQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(personAdresseMock);
  });
});

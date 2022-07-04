import { stubVirksomhetApi } from "../stubs/stubSyfomoteadmin";
import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { expect } from "chai";
import { virksomhetMock } from "../../mock/syfomoteadmin/virksomhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";

let queryClient: any;
let apiMockScope: any;

const orgnummer = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;

describe("virksomhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads virksomhet for orgnummer", async () => {
    stubVirksomhetApi(apiMockScope, orgnummer);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useVirksomhetQuery(orgnummer), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(virksomhetMock());
  });
});

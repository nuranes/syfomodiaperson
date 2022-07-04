import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "chai";
import {
  parseSoknad,
  useSykepengesoknaderQuery,
} from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { soknaderMock } from "../../mock/sykepengesoknad/soknaderMock";
import { stubSykepengesoknadBackendApi } from "../stubs/stubSykepengesoknadBackend";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

let queryClient: any;
let apiMockScope: any;

describe("sykepengesoknadQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads sykepengesoknader", async () => {
    stubSykepengesoknadBackendApi(
      apiMockScope,
      ARBEIDSTAKER_DEFAULT.personIdent
    );
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useSykepengesoknaderQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(
      (soknaderMock as unknown as SykepengesoknadDTO[]).map(parseSoknad)
    );
  });
});

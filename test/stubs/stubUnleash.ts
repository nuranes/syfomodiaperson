import nock from "nock";
import { UNLEASH_ROOT } from "@/apiConstants";
import { mockUnleashResponse } from "../../mock/unleashMocks";

export const stubFeatureTogglesApi = (scope: nock.Scope) =>
  scope
    .get((uri) => uri.includes(`${UNLEASH_ROOT}/toggles`))
    .reply(200, () => mockUnleashResponse);

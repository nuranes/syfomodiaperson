import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect, describe, it, beforeAll } from "vitest";
import { get, post } from "@/api/axios";
import { isClientError } from "@/api/errors";

describe("errors test", () => {
  let stub: MockAdapter;

  const pathBadRequest = "/400";
  const pathAccessDenied = "/403";
  const pathNotFound = "/404";
  const pathInternalServerError = "/500";

  beforeAll(() => {
    stub = new MockAdapter(axios);
    stub.onPost(pathBadRequest).replyOnce(400);
    stub.onGet(pathAccessDenied).replyOnce(403, { message: "Denied!" });
    stub.onGet(pathNotFound).replyOnce(404);
    stub.onPost(pathInternalServerError).replyOnce(500);
  });

  describe("isClientError", () => {
    it("returns true from http 400", async () => {
      try {
        await post(pathBadRequest, {});
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns true from http 403", async () => {
      try {
        await get(pathAccessDenied);
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns true from http 404", async () => {
      try {
        await get(pathNotFound);
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns false from http 500", async () => {
      try {
        await post(pathInternalServerError, {});
      } catch (e) {
        expect(isClientError(e)).to.equal(false);
      }
    });
  });
});

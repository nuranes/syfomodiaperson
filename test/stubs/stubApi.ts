import axios from "axios";
import nock from "nock";

export const apiMock = () => {
  axios.defaults.adapter = "http";
  return nock("http://localhost").persist();
};

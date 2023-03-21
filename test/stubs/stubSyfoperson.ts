import nock from "nock";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { personAdresseMock } from "../../mock/syfoperson/personAdresseMock";
import { brukerinfoMock } from "../../mock/syfoperson/brukerinfoMock";

export const stubEgenansattApi = (scope: nock.Scope, isEgenansatt: boolean) =>
  scope
    .get(`${SYFOPERSON_ROOT}/person/egenansatt`)
    .reply(200, () => isEgenansatt);

export const stubDiskresjonskodeApi = (
  scope: nock.Scope,
  diskresjonskode = ""
) =>
  scope
    .get(`${SYFOPERSON_ROOT}/person/diskresjonskode`)
    .reply(200, () => diskresjonskode);

export const stubPersonadresseApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOPERSON_ROOT}/person/adresse`)
    .reply(200, () => personAdresseMock);

export const stubPersoninfoApi = (scope: nock.Scope, dodsdato?: string) => {
  const brukerinfo = {
    ...brukerinfoMock,
    dodsdato: dodsdato || null,
  };
  scope
    .get(`${SYFOPERSON_ROOT}/person/brukerinfo`)
    .reply(200, () => brukerinfo);
};

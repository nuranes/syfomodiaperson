import axios, { AxiosError, AxiosRequestHeaders, ResponseType } from "axios";
import {
  accessDeniedError,
  ApiErrorException,
  generalError,
  loginRequiredError,
  networkError,
} from "@/api/errors";
import { generateUUID } from "@/utils/uuidUtils";

export const NAV_CALL_ID_HEADER = "Nav-Call-Id";
export const NAV_CONSUMER_ID_HEADER = "Nav-Consumer-Id";
export const NAV_CONSUMER_ID = "syfomodiaperson";
export const NAV_PERSONIDENT_HEADER = "nav-personident";

export const defaultRequestHeaders = (
  personIdent?: string,
  addHeader?: { [p: string]: string | boolean | number },
  responseType?: ResponseType,
  contentType?: string
): AxiosRequestHeaders => {
  const headers = {
    "Content-Type": !!contentType ? contentType : "application/json",
    [NAV_CONSUMER_ID_HEADER]: NAV_CONSUMER_ID,
    [NAV_CALL_ID_HEADER]: `${NAV_CONSUMER_ID}-${generateUUID()}`,
  };

  if (personIdent) {
    headers[NAV_PERSONIDENT_HEADER] = personIdent;
  }

  if (addHeader) {
    Object.keys(addHeader).forEach(
      (headerKeyName) => (headers[headerKeyName] = addHeader[headerKeyName])
    );
  }

  return headers;
};

const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    switch (error.response.status) {
      case 401: {
        window.location.href = `/login?redirectTo=${window.location.pathname}`;
        throw new ApiErrorException(
          loginRequiredError(error.message),
          error.response.status
        );
      }
      case 403: {
        const message = error.response.data.message;
        throw new ApiErrorException(
          accessDeniedError(message),
          error.response.status
        );
      }
      default:
        throw new ApiErrorException(
          generalError(error.message),
          error.response.status
        );
    }
  } else if (error.request) {
    throw new ApiErrorException(networkError(error.message));
  } else {
    throw new ApiErrorException(generalError(error.message));
  }
};

export const get = <ResponseData>(
  url: string,
  personIdent?: string,
  addHeader?: { [p: string]: string | boolean | number },
  responseType?: ResponseType,
  contentType?: string
): Promise<ResponseData> => {
  return axios
    .get(url, {
      headers: defaultRequestHeaders(
        personIdent,
        addHeader,
        responseType,
        contentType
      ),
      responseType: !!responseType ? responseType : "json",
    })
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        throw new ApiErrorException(generalError(error.message), error.code);
      }
    });
};

export const post = <ResponseData>(
  url: string,
  data: Record<string, any>,
  personIdent?: string
): Promise<ResponseData> => {
  return axios
    .post(url, data, {
      headers: defaultRequestHeaders(personIdent),
    })
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        throw new ApiErrorException(generalError(error.message), error.code);
      }
    });
};

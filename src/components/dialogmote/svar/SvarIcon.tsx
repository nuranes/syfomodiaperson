import React, { ReactElement } from "react";
import { SvarType } from "@/data/dialogmote/types/dialogmoteTypes";
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  MinusCircleFillIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";

interface Props {
  svarType: SvarType | undefined;
}

export const SvarIcon = ({ svarType }: Props): ReactElement => {
  switch (svarType) {
    case SvarType.KOMMER:
      return (
        <CheckmarkCircleFillIcon
          fontSize="1.5em"
          color="var(--a-icon-success)"
          title="suksess-ikon"
        />
      );
    case SvarType.NYTT_TID_STED:
      return (
        <ExclamationmarkTriangleFillIcon
          fontSize="1.5em"
          color="var(--a-icon-warning)"
          title="advarsel-ikon"
        />
      );
    case SvarType.KOMMER_IKKE:
      return (
        <XMarkOctagonFillIcon
          fontSize="1.5em"
          color="var(--a-icon-danger)"
          title="feil-ikon"
        />
      );
    default:
      return (
        <MinusCircleFillIcon
          fontSize="1.5em"
          color="var(--a-gray-600)"
          title="minus-sirkel-ikon"
        />
      );
  }
};

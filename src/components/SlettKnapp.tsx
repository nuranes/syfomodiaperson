import React from "react";
import { Flatknapp, KnappBaseProps } from "nav-frontend-knapper";
import styled from "styled-components";
import { TrashIcon } from "@navikt/aksel-icons";

const DeleteButton = styled(Flatknapp)`
  svg {
    width: 1.25em;
    height: 1.25em;
  }
`;

export const SlettKnapp = (props: KnappBaseProps) => (
  <DeleteButton htmlType="button" kompakt {...props}>
    <TrashIcon fontSize="1.25em" title="Slett ikon" />
  </DeleteButton>
);

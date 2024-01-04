import { FlexColumn } from "../../Layout";
import { ReactElement } from "react";
import React from "react";
import { Box } from "@navikt/ds-react";

interface ReferatInfoColumnProps {
  children?: ReactElement[] | ReactElement;
}

export const ReferatInfoColumn = ({
  children,
}: ReferatInfoColumnProps): ReactElement => (
  <FlexColumn flex={0.5}>
    {children ? (
      <Box
        borderRadius="medium"
        background="surface-subtle"
        borderColor="border-default"
        padding="4"
        borderWidth="1"
        className="mt-8"
      >
        {children}
      </Box>
    ) : null}
  </FlexColumn>
);

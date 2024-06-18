import { BodyShort, ExpansionCard, Label } from "@navikt/ds-react";
import React, { ReactElement } from "react";

interface Props {
  title: {
    icon: React.ReactElement;
    label: string;
    body: string;
  };
  children: ReactElement;
  defaultOpen: boolean;
}

export const EkspanderbartSvarPanel = ({
  title: { icon, label, body },
  defaultOpen,
  children,
}: Props) => (
  <ExpansionCard size="small" aria-label={body} defaultOpen={defaultOpen}>
    <ExpansionCard.Header>
      <ExpansionCard.Title size="small">
        <div className="flex gap-1 items-center">
          {icon}
          <Label size="small">{label}</Label>
          <BodyShort size="small">{body}</BodyShort>
        </div>
      </ExpansionCard.Title>
    </ExpansionCard.Header>
    <ExpansionCard.Content>{children}</ExpansionCard.Content>
  </ExpansionCard>
);

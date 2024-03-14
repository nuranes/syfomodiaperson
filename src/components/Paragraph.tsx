import { BodyLong, Label } from "@navikt/ds-react";
import React from "react";

interface ParagraphProps {
  label: string;
  body: string;
}

export const Paragraph = ({ label, body }: ParagraphProps) => {
  return (
    <div className="mb-4">
      <Label size="small">{label}</Label>
      <BodyLong size="small">{body}</BodyLong>
    </div>
  );
};

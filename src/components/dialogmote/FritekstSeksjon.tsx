import { FlexColumn, FlexRow, PaddingSize } from "../Layout";
import { Field } from "react-final-form";
import React from "react";
import styled from "styled-components";
import Fritekst from "@/components/Fritekst";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import Knapp from "nav-frontend-knapper";

const texts = {
  forhandsvisning: "Forhåndsvisning",
};

const FritekstWrapper = styled.div`
  margin-bottom: 2em;
`;

interface FritekstSeksjonProps {
  fieldName: string;
  label: string;
  handlePreviewClick: () => void;
  maxLength: number;
  alertText?: string;
}

const FritekstSeksjon = ({
  fieldName,
  label,
  handlePreviewClick,
  maxLength,
  alertText,
}: FritekstSeksjonProps) => (
  <FritekstWrapper>
    <FlexRow bottomPadding={PaddingSize.SM}>
      <FlexColumn flex={1}>
        <Field<string> name={fieldName}>
          {({ input, meta }) => (
            <Fritekst
              size="medium"
              maxLength={maxLength}
              label={label}
              feil={meta.submitFailed && meta.error}
              id={fieldName}
              {...input}
            />
          )}
        </Field>
      </FlexColumn>
    </FlexRow>
    {!!alertText && (
      <FlexRow bottomPadding={PaddingSize.SM}>
        <AlertstripeFullbredde type="advarsel">
          <p>{alertText}</p>
        </AlertstripeFullbredde>
      </FlexRow>
    )}
    <FlexRow>
      <Knapp htmlType="button" onClick={handlePreviewClick}>
        {texts.forhandsvisning}
      </Knapp>
    </FlexRow>
  </FritekstWrapper>
);

export default FritekstSeksjon;

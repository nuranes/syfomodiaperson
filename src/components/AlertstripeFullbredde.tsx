import styled from "styled-components";
import AlertStripe from "nav-frontend-alertstriper";

type MarginSize = "1em" | "2em" | "3em" | "4em";

interface AlertstripeFullbreddeProps {
  marginbottom?: MarginSize;
  margintop?: MarginSize;
}

export const AlertstripeFullbredde = styled(
  AlertStripe
)<AlertstripeFullbreddeProps>`
  margin-bottom: ${(props) => props.marginbottom || 0};
  margin-top: ${(props) => props.margintop || 0};

  .alertstripe__tekst {
    max-width: 100%;
  }
`;

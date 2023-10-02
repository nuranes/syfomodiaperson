import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { Column, Container, Row } from "nav-frontend-grid";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isEaster } from "@/utils/festiveUtils";
import { Easter } from "@/components/festive/Easter";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import * as Amplitude from "@/utils/amplitude";
import { OpenHuskelappModalButton } from "@/components/huskelapp/OpenHuskelappModalButton";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

const StyledContainer = styled(Container)`
  width: 95%;
`;

interface SideProps {
  tittel: string;
  children?: ReactNode;
  aktivtMenypunkt: Menypunkter;
}

const Side = (sideProps: SideProps) => {
  useEffect(() => {
    Amplitude.logPageVisit(window.location.href, sideProps.tittel);
  }, [sideProps.tittel]);
  const { toggles } = useFeatureToggles();

  const { tittel, children, aktivtMenypunkt } = sideProps;

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <StyledContainer fluid>
        <Row>
          <Column className="col-xs-12">
            <Personkort />
            {toggles.isHuskelappEnabled && <OpenHuskelappModalButton />}
          </Column>
        </Row>
        <Row>
          <nav className="col-xs-12 col-sm-3">
            <GlobalNavigasjon aktivtMenypunkt={aktivtMenypunkt} />
            {isEaster() && <Easter />}
          </nav>
          <Column className="col-xs-12 col-sm-9">{children}</Column>
        </Row>
      </StyledContainer>
    </DocumentTitle>
  );
};

export default Side;

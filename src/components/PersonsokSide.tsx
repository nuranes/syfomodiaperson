import React from "react";
import { Column, Container, Row } from "nav-frontend-grid";
import Infomelding from "./Infomelding";
import styled from "styled-components";

const texts = {
  title: "Søk på person",
  melding: "Søk på en person. Skriv inn et gyldig fødselsnummer i menylinjen",
};

const InfoWrapper = styled.div`
  width: 40em;
  margin: 0 auto;
`;

export const PersonsokSide = () => (
  <Container>
    <Row>
      <Column className="col-xs-12">
        <InfoWrapper>
          <Infomelding tittel={texts.title} melding={texts.melding} />
        </InfoWrapper>
      </Column>
    </Row>
  </Container>
);

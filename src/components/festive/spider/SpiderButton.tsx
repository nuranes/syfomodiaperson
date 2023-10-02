import styled from "styled-components";
import Knapp from "nav-frontend-knapper";
import React from "react";
import { Spider } from "@/components/festive/spider/Spider";

const texts = {
  letItSnow: "La det snø??",
};

const StyledButton = styled(Knapp)`
  margin-left: auto;
  align-self: center;
  margin-right: 0;
  padding: 0 0.5em;
`;

export const SpiderButton = () => {
  const [showSpider, setShowSpider] = React.useState(false);
  const [dropSpider, setDropSpider] = React.useState(false);

  const clickButton = () => {
    if (showSpider) return;
    setShowSpider(true);

    setTimeout(() => {
      setDropSpider(true);

      setTimeout(() => {
        setShowSpider(false);
        setDropSpider(false);
      }, 3100);
    }, 10000);
  };

  return (
    <>
      <StyledButton onClick={clickButton} mini>
        {texts.letItSnow}
      </StyledButton>
      {showSpider && (
        <Spider dropSpider={dropSpider} setDropSpider={setDropSpider} />
      )}
    </>
  );
};

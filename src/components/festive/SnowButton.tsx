import React from "react";
import { startSnow, stopAndHideSnow } from "@/utils/festiveUtils";
import styled from "styled-components";
import Knapp from "nav-frontend-knapper";

const texts = {
  letItSnow: "La det snø",
  snowButtonTrackingContext: "Jul",
};

const StyledButton = styled(Knapp)`
  margin-left: auto;
  align-self: center;
  margin-right: 0;
  padding: 0 0.5em;
`;

const SnowButton = () => {
  // Bruker require her, siden testene får ikke kjørt hvis vi importerer i starten av filen
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jingle = require("../../../music/jingle_bells_trimmed.mp3");
  const jingleAudio = new Audio(jingle);

  jingleAudio.onended = () => {
    stopAndHideSnow();
  };

  const clickButton = () => {
    if (jingleAudio.paused || jingleAudio.ended) {
      jingleAudio.play();
      startSnow();
    } else {
      stopAndHideSnow();
      jingleAudio.load();
    }
  };

  return (
    <StyledButton onClick={clickButton} mini>
      {texts.letItSnow}
    </StyledButton>
  );
};

export default SnowButton;

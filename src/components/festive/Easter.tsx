import React, { useState } from "react";
import { EasterRoll } from "../../../img/ImageComponents";
import styled from "styled-components";

const EasterGif = styled.img`
  width: 100%;
  flex: 1;
`;

export const Easter = () => {
  const [imgSrc, setImgSrc] = useState<string>(EasterRoll);

  const replayGif = () => {
    setImgSrc("none");
    setTimeout(() => {
      setImgSrc(EasterRoll);
    }, 0);
  };

  return (
    <div>
      <EasterGif src={imgSrc} alt="påskekylling gif" onClick={replayGif} />
    </div>
  );
};

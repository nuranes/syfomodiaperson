import React, { ReactElement, ReactNode, useState } from "react";
import { EkspanderbartpanelBase } from "nav-frontend-ekspanderbartpanel";
import styled from "styled-components";
import navFarger from "nav-frontend-core";
import { FlexRow, JustifyContentType, PaddingSize } from "@/components/Layout";

const texts = {
  close: "Lukk",
};

interface StyledEkspanderbartpanelProps {
  variant?: "lysebla" | "lyselilla";
}

const StyledEkspanderbartpanel = styled(
  EkspanderbartpanelBase
)<StyledEkspanderbartpanelProps>`
  margin-bottom: 2em;

  .ekspanderbartPanel__innhold {
    padding: 2.5em;
    display: flex;
    flex-direction: column;
  }

  .ekspanderbartPanel__hode {
    background-color: ${(props) => {
      switch (props.variant) {
        case "lysebla": {
          return navFarger.navDypBlaLighten80;
        }
        case "lyselilla": {
          return navFarger.navLillaLighten80;
        }
        default: {
          return "transparent";
        }
      }
    }};
  }
`;

interface SpeilingEkspanderbartPanelProps
  extends StyledEkspanderbartpanelProps {
  children: ReactElement;
  tittel: ReactNode;
  visLukkLenke?: boolean;
  defaultOpen?: boolean;
}

export const SpeilingEkspanderbartPanel = ({
  children,
  variant,
  tittel,
  visLukkLenke = true,
  defaultOpen = false,
}: SpeilingEkspanderbartPanelProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <StyledEkspanderbartpanel
      variant={variant}
      tittel={tittel}
      apen={open}
      onClick={() => setOpen(!open)}
    >
      {children}
      {visLukkLenke && (
        <FlexRow
          topPadding={PaddingSize.SM}
          justifyContent={JustifyContentType.CENTER}
        >
          <button className="lenke" onClick={() => setOpen(!open)}>
            {texts.close}
          </button>
        </FlexRow>
      )}
    </StyledEkspanderbartpanel>
  );
};

import { useMemo } from "react";
import { MODIA_HEADER_ID } from "@/sider/Side";
import { SIDETOPP_ID } from "@/components/Sidetopp";
import { INTERNFLATEDECORATOR_ID } from "@/decorator/Decorator";

export const usePageHeight = (
  hasLoaded: boolean
): { height: number; heightStyling: string } => {
  const headerHeight = useMemo(() => {
    if (!hasLoaded) {
      return 0;
    }
    const sidetoppHeight =
      document.getElementById(MODIA_HEADER_ID)?.clientHeight || 0;
    const sideoverskriftHeight =
      document.getElementById(SIDETOPP_ID)?.clientHeight || 0;
    const decoratorHeight =
      document.getElementById(INTERNFLATEDECORATOR_ID)?.clientHeight || 0;

    return sidetoppHeight + sideoverskriftHeight + decoratorHeight;
  }, [hasLoaded]);

  const heightStyling = useMemo(
    () => `calc(100vh - ${headerHeight}px)`,
    [headerHeight]
  );

  return {
    height: headerHeight,
    heightStyling: heightStyling,
  };
};

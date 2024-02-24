/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { spacing } from "./theme";

export type HStackProps = {
  extCSS?: CSSInterpolation;
};
export default function HStack({
  children,
  extCSS,
}: React.PropsWithChildren<HStackProps>) {
  const elemCSS = css(
    {
      display: "flex",
      flexDirection: "row",
      gap: spacing[2],
      alignItems: "center",
      justifyContent: "flex-start",
    },
    extCSS
  );

  return <div css={elemCSS}>{children}</div>;
}

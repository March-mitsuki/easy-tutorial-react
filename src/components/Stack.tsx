/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { spacing } from "./theme";

export type StackProps = {
  extCSS?: CSSInterpolation;
};
export default function Stack({
  children,
  extCSS,
}: React.PropsWithChildren<StackProps>) {
  const elemCSS = css(
    {
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      justifyContent: "center",
    },
    extCSS
  );

  return <div css={elemCSS}>{children}</div>;
}

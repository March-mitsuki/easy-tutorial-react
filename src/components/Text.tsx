/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { colors, spacing } from "./theme";

export type TextProps = {
  maybeDarkMode: boolean;
  extCSS?: CSSInterpolation;
};
export default function Text({
  children,
  extCSS,
  maybeDarkMode,
}: React.PropsWithChildren<TextProps>) {
  const componentCSS: CSSInterpolation = {
    display: "flex",
    gap: spacing[4],
    alignItems: "center",
    justifyContent: "flex-start",
  };
  if (maybeDarkMode) {
    componentCSS.color = colors.white;
  } else {
    componentCSS.color = colors.black;
  }
  const elemCSS = css(componentCSS, extCSS);

  return <div css={elemCSS}>{children}</div>;
}

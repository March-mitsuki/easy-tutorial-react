/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { borderRadius, colors, fontSizes, spacing } from "./theme";
import React from "react";

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  maybeDarkMode: boolean;
  extCSS?: CSSInterpolation;
};
export default function Button({
  onClick,
  extCSS,
  maybeDarkMode,
  children,
}: React.PropsWithChildren<ButtonProps>) {
  let componentCSS: CSSInterpolation = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    fontWeight: 700,
    fontSize: fontSizes.md,
    borderWidth: 0,
    cursor: "pointer",
    padding: `${spacing[2]} ${spacing[4]}`,
    appearance: "none",
    paddingInline: "none",
    paddingBlock: "none",
    transition: "all 0.2s",
  };
  if (maybeDarkMode) {
    componentCSS = {
      ...componentCSS,
      backgroundColor: colors.blackAlpha400,
      color: colors.white,
      ":hover": {
        backgroundColor: colors.blackAlpha600,
        borderColor: "none",
      },
      ":focus": {
        outline: "none",
      },
      ":focus-visible": {
        outline: "none",
      },
    };
  } else {
    componentCSS = {
      ...componentCSS,
      backgroundColor: colors.whiteAlpha700,
      color: colors.blackAlpha700,
      ":hover": {
        backgroundColor: colors.whiteAlpha900,
        borderColor: "none",
      },
      ":focus": {
        outline: "none",
      },
      ":focus-visible": {
        outline: "none",
      },
    };
  }
  const elemCSS = css(componentCSS, extCSS);

  return (
    <button onClick={onClick} type="button" css={elemCSS}>
      {children}
    </button>
  );
}

/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import { borderRadius, colors } from "./theme";

export type IconButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactNode;
  maybeDarkMode: boolean;
  extCSS?: CSSInterpolation;
};
export default function IconButton({
  icon,
  onClick,
  extCSS,
  maybeDarkMode,
}: IconButtonProps) {
  let componentCSS: CSSInterpolation = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    borderWidth: 0,
    cursor: "pointer",
    padding: 0,
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
      },
    };
  } else {
    componentCSS = {
      ...componentCSS,
      backgroundColor: colors.whiteAlpha700,
      color: colors.blackAlpha700,
      ":hover": {
        backgroundColor: colors.whiteAlpha900,
      },
    };
  }
  const elemCSS = css(componentCSS, extCSS);

  return (
    <button onClick={onClick} type="button" css={elemCSS}>
      {icon}
    </button>
  );
}

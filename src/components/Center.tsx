/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";

export type CenterProps = {
  extCSS?: CSSInterpolation;
};
export default function Center({
  children,
  extCSS,
}: React.PropsWithChildren<CenterProps>) {
  const elemCSS = css(
    {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    extCSS
  );

  return <div css={elemCSS}>{children}</div>;
}

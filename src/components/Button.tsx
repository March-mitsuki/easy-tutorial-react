/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { colors } from "./shared";

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};
export default function Button({
  onClick,
  children,
}: React.PropsWithChildren<ButtonProps>) {
  return (
    <button
      onClick={onClick}
      type="button"
      css={css({
        backgroundColor: colors.buttonBackground_light,
        color: colors.buttonColor_light,
        ":hover": {},
      })}
    >
      {children}
    </button>
  );
}

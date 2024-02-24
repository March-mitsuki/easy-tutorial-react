/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { EasyTutorial } from "./tutorial";
import { EasyTutorialNoticeMeta } from "./tutorial";
import Center from "./components/Center";
import { borderRadius, colors, fontSizes, spacing } from "./components/theme";
import { css } from "@emotion/react";
import IconButton from "./components/IconButton";
import CloseIcon from "./components/CloseIcon";
import HStack from "./components/HStack";
import WarningIcon from "./components/WarningIcon";
import Stack from "./components/Stack";
import Text from "./components/Text";

let closeTimer: number | undefined;

export type NoticeRenderer = React.FC<{
  dataSource: EasyTutorial;
  extendRenderArgs?: any[];
}>;

export const EasyTutorialNoticeRenderer: NoticeRenderer = ({
  dataSource,
  extendRenderArgs,
}) => {
  if (typeof extendRenderArgs === "undefined") {
    extendRenderArgs = [];
  } else if (!Array.isArray(extendRenderArgs)) {
    console.error(
      "[EasyTutorial] extendRenderArgs must be an array, but got",
      extendRenderArgs
    );
    extendRenderArgs = [];
  }

  const [notice, setNotice] = useState<EasyTutorialNoticeMeta | undefined>(
    undefined
  );
  // for leaving animation control
  const [animationControl, setAnimationControl] = useState<
    EasyTutorialNoticeMeta | undefined
  >(undefined);
  const thisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dataSource.on("canNotRender", (meta) => {
      setAnimationControl(meta);
      setNotice(meta);
      closeTimer = setTimeout(() => {
        setAnimationControl(undefined);
      }, meta.duration);
    });
  }, [dataSource]);

  const maybeDarkMode = (): boolean => {
    if (typeof extendRenderArgs === "undefined") {
      return false;
    }
    const maybeColorMode = extendRenderArgs[0];
    if (typeof maybeColorMode === "string") {
      return maybeColorMode === "dark";
    }
    return false;
  };

  return (
    <div
      ref={thisRef}
      style={{ opacity: animationControl ? 1 : 0, transition: "all 0.5s" }}
      onTransitionEnd={() => {
        if (!animationControl) {
          setNotice(undefined);
        }
      }}
    >
      {notice && (
        <Center
          extCSS={{
            position: "fixed",
            bottom: spacing[6],
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2100,
          }}
        >
          <div
            css={css({
              position: "relative",
              borderRadius: borderRadius.md,
              padding: spacing[4],
              backgroundColor: maybeDarkMode()
                ? colors.orangeDark
                : colors.orangeLight,
            })}
          >
            <IconButton
              maybeDarkMode={maybeDarkMode()}
              icon={<CloseIcon boxSize="md" />}
              onClick={() => {
                clearTimeout(closeTimer);
                // setNotice(undefined);
                setAnimationControl(undefined);
              }}
              extCSS={{
                position: "absolute",
                right: spacing[2],
                top: spacing[2],
              }}
            />
            <HStack>
              <Text maybeDarkMode={maybeDarkMode()}>
                <WarningIcon boxSize="md" />
              </Text>
              <Stack>
                <Text
                  maybeDarkMode={maybeDarkMode()}
                  extCSS={css({
                    fontSize: fontSizes.xl,
                    fontWeight: "bold",
                  })}
                >
                  {notice.title}
                </Text>
                <Text maybeDarkMode={maybeDarkMode()}>{notice.msg}</Text>
              </Stack>
            </HStack>
          </div>
        </Center>
      )}
    </div>
  );
};

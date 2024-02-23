/* eslint-disable @typescript-eslint/no-unused-vars  */
import { useEffect, useState } from "react";
import { EasyTutorial } from ".";
// import CloseIcon from "./components/CloseIcon";
// import WarningIcon from "./components/WarningIcon";
import { EasyTutorialNoticeMeta } from "./tutorial";

// let closeTimer: number | undefined;

export const EasyTutorialNoticeRenderer: React.FC<{
  dataSource: EasyTutorial;
  extendRenderArgs?: any[];
}> = ({ dataSource, extendRenderArgs }) => {
  const [notice, setNotice] = useState<EasyTutorialNoticeMeta | undefined>(
    undefined
  );

  useEffect(() => {
    dataSource.on("canNotNext", (meta) => {
      setNotice(meta);
      // closeTimer = setTimeout(() => {
      //   setNotice(undefined);
      // }, meta.duration);
    });
  }, [dataSource]); // eslint-disable-line

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

  if (!notice) return null;

  return <div>Notice Renderer {maybeDarkMode()}</div>;
};

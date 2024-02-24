import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EasyTutorial } from "./tutorial";
import { buildPortalElem, findElemByEasyTutorialQuery } from "./utils";

export type Renderer = React.FC<{
  dataSource: EasyTutorial;
  extendRenderArgs?: any[];
}>;

export const EasyTutorialRenderer: Renderer = ({
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

  const [, _setRefresh] = useState(0);
  const callRefresh = () => _setRefresh(Date.now());

  useEffect(() => {
    const portal = buildPortalElem();
    document.body.appendChild(portal);
    callRefresh();
  }, []);

  useEffect(() => {
    dataSource.on("nextStep", () => {
      callRefresh();
    });
    dataSource.on("prevStep", () => {
      callRefresh();
    });
    dataSource.on("start", () => {
      callRefresh();
    });
    dataSource.on("stop", () => {
      callRefresh();
    });
  }, [dataSource]);

  const renderPortal = document.getElementById("easy-tutorial-portal");
  const needReder = dataSource.isTutorialRunning() && !!renderPortal;
  if (!needReder) return null;

  const ct = dataSource.currentTutorial();
  if (!ct) {
    console.error("[EasyTutorial] currentTutorial is undefined");
    return null;
  }
  const placement = ct.currentPlacement();
  if (!placement) {
    console.error("[EasyTutorial] currentPlacement is undefined");
    return null;
  }
  const currentContent = ct.currentContent();
  if (!currentContent) {
    console.error("[EasyTutorial] currentContent is undefined");
    return null;
  }

  const cr = dataSource.currentRender();
  if (!cr) {
    console.error("[EasyTutorial] currentRender is undefined");
    return null;
  }

  const targetElemQuery = dataSource.currentTargetQuery();
  if (!targetElemQuery) {
    console.error("[EasyTutorial] cannot find targetElemQuery");
    return null;
  }

  const targetElem = findElemByEasyTutorialQuery(targetElemQuery);
  if (!targetElem) {
    console.error(
      `[EasyTutorial] targetElem is undefined, select by query ${targetElemQuery}`
    );
    return null;
  }

  return (
    <>
      {createPortal(
        cr(
          {
            targetElem,
            stepType: ct.stepType(),
            next: ct.next.bind(ct),
            prev: ct.prev.bind(ct),
            stop: ct.stop.bind(ct),
            totalStep: ct.totalStepLegth(),
            currentStep: ct.currentStepIdx(),
            placement,
            currentContent,
          },
          ...extendRenderArgs
        ),
        renderPortal
      )}
    </>
  );
};

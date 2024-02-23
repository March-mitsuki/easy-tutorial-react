/* eslint-disable @typescript-eslint/no-unused-vars  */
import mitt from "mitt";
import type { Emitter } from "mitt";
import { findElemByEasyTutorialQuery, getElemAbsPos } from "./utils";

export class EasyTutorial<
  K extends string = string,
  A extends Array<any> = any
> {
  private _currentTutorial: K | undefined;
  private _tutorials: Record<K, TutorialData<A>> = {} as any;
  private _emitter: TutorialEmitter = mitt<TutorialEvents>();
  on = this._emitter.on;
  off = this._emitter.off;
  emit = this._emitter.emit;

  addTutorial(name: K) {
    const t = new TutorialData<A>(this._emitter, this.stop.bind(this));
    this._tutorials[name] = t;
    return t;
  }

  start(name: K) {
    const ct = this._tutorials[name];
    if (!ct) {
      console.error(`[EasyTutorial] Tutorial ${name} not found when start`);
      return;
    }
    if (ct.start()) this._currentTutorial = name;
  }
  private stop() {
    this._currentTutorial = undefined;
    this._emitter.emit("stop");
  }
  next(waiter?: () => boolean) {
    const ct = this.currentTutorial();
    if (!ct) {
      console.error(`[EasyTutorial] currentTutorial is undefined`);
      return;
    }
    if (waiter) {
      const interval = setInterval(() => {
        if (waiter()) {
          clearInterval(interval);
          ct.forceNext();
        }
      }, 100);
      return;
    }
    ct.forceNext();
  }

  currentTutorial() {
    if (!this._currentTutorial) {
      return undefined;
    }
    return this._tutorials[this._currentTutorial];
  }

  currentRender() {
    return this.currentTutorial()?.currentRender();
  }

  currentTargetQuery() {
    return this.currentTutorial()?.currentTargetQuery();
  }

  isTutorialRunning() {
    return !!this._currentTutorial;
  }
}
class TutorialData<A extends Array<any>> {
  private _steps: TutorialStep<A>[] = [];
  private _stopFunc: () => void;
  private _currentStepIdx = 0;
  private _emitter: TutorialEmitter;

  constructor(emitter: TutorialEmitter, stopFunc: () => void) {
    this._emitter = emitter;
    this._stopFunc = stopFunc;
  }

  private currentStepObj() {
    if (
      this._currentStepIdx >= this._steps.length ||
      this._currentStepIdx < 0
    ) {
      return undefined;
    }
    return this._steps[this._currentStepIdx];
  }
  private nextStepObj() {
    const nextIdx = this._currentStepIdx + 1;
    if (nextIdx >= this._steps.length || nextIdx < 0) {
      return undefined;
    }
    return this._steps[nextIdx];
  }
  private prevStepObj() {
    const prevIdx = this._currentStepIdx - 1;
    if (prevIdx >= this._steps.length || prevIdx < 0) {
      return undefined;
    }
    return this._steps[prevIdx];
  }

  totalStepLegth() {
    return this._steps.length;
  }

  currentStepIdx() {
    return this._currentStepIdx;
  }

  currentRender() {
    return this.currentStepObj()?.render;
  }

  currentTargetQuery() {
    return this.currentStepObj()?.targetQuery;
  }

  noticeMeta(type: CheckCanRenderType): EasyTutorialNoticeMeta {
    let step;
    switch (type) {
      case "current":
        step = this.currentStepObj();
        break;
      case "next":
        step = this.nextStepObj();
        break;
      case "prev":
        step = this.prevStepObj();
        break;
      default:
        return { msg: "", title: "", duration: 0 };
    }

    if (!step) {
      return { msg: "", title: "", duration: 0 };
    }
    if (type === "prev") {
      return {
        msg: step.backNoticeMsg,
        title: step.backNoticeTitle,
        duration: step.noticeDuration,
      };
    }
    return {
      msg: step.noticeMsg,
      title: step.noticeTitle,
      duration: step.noticeDuration,
    };
  }

  effectRender() {
    const step = this.currentStepObj();
    if (!step) {
      console.error("[EasyTutorial] effectRender stepObj is undefined");
      return;
    }

    if (step.scrollInView) {
      const targetElem = findElemByEasyTutorialQuery(step.targetQuery);
      if (targetElem) {
        targetElem.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
    return;
  }

  private checkCanRender(type: CheckCanRenderType): boolean {
    let step;
    switch (type) {
      case "current":
        step = this.currentStepObj();
        break;
      case "next":
        step = this.nextStepObj();
        break;
      case "prev":
        step = this.prevStepObj();
        break;
      default:
        return false;
    }

    if (!step) {
      console.error("[EasyTutorial] checkCanRender stepObj is undefined", type);
      return false;
    }
    if (!step.canRender()) {
      this._emitter.emit("canNotNext", this.noticeMeta(type));
      return false;
    }
    return true;
  }

  start(): boolean {
    this._currentStepIdx = 0;
    if (!this.checkCanRender("current")) {
      return false;
    }
    this.effectRender();
    this._emitter.emit("start");
    return true;
  }

  stop() {
    this._currentStepIdx = 0;
    this._stopFunc();
  }

  next() {
    if (!this.checkCanRender("next")) {
      return false;
    }
    this._currentStepIdx++;
    this.effectRender();
    this._emitter.emit("nextStep");
  }

  forceNext() {
    this._currentStepIdx++;
    this.effectRender();
    this._emitter.emit("nextStep");
  }

  prev() {
    if (!this.checkCanRender("prev")) {
      return false;
    }
    this._currentStepIdx--;
    this.effectRender();
    this._emitter.emit("prevStep");
  }

  currentPlacement() {
    return this.currentStepObj()?.placement;
  }

  isLastStep() {
    return this._currentStepIdx >= this._steps.length - 1;
  }
  isFirstStep() {
    return this._currentStepIdx <= 0;
  }
  stepType(): StepType {
    if (this._steps.length === 1) {
      return "single";
    }
    if (this.isLastStep()) {
      return "last";
    }
    if (this.isFirstStep()) {
      return "first";
    }
    return "common";
  }

  addStep({
    targetQuery,
    // content,
    render,
    scrollInView,
    noticeMsg,
    noticeTitle,
    backNoticeMsg,
    backNoticeTitle,
    noticeDuration,
    placement,
    canRender,
  }: AddStepParams<A>) {
    const defaultRender: RenderFunc<A> = (basicArg, ...args) => {
      const {
        targetElem,
        stepType,
        // next,
        // prev,
        // stop,
        placement,
        // totalStep,
        // currentStep,
      } = basicArg;

      if (!(targetElem instanceof HTMLElement)) {
        console.error(
          "[EasyTutorial] targetElem is not HTMLElement, default render only support HTMLElement"
        );
        return (
          // <Stack
          //   pos="absolute"
          //   minW="256px"
          //   minH="128px"
          //   p={4}
          //   rounded="md"
          //   bg="gray.600"
          // >
          //   EasyTutorial default render only support HTMLElement, You should
          //   provide a custom render function.
          // </Stack>
          <div>Error Render</div>
        );
      }

      const maybeDarkMode = (): boolean => {
        if (typeof args === "undefined") {
          return false;
        }
        const maybeColorMode = args[0];
        if (typeof maybeColorMode === "string") {
          return maybeColorMode === "dark";
        }
        return false;
      };
      const { top: targetTop, left: targetLeft } = getElemAbsPos(targetElem);
      const targetHeight = targetElem.offsetHeight;
      const targetWidth = targetElem.offsetWidth;

      const firstBtns = <div>firstBtns Render</div>;
      const commonBtns = <div>commonBtns Render</div>;
      const lastBtn = <div>lastBtns Render</div>;
      const singleBtn = <div>singleBtn Render</div>;
      const btns = () => {
        console.log("stepType", stepType);
        switch (stepType) {
          case "first":
            return firstBtns;
          case "last":
            return lastBtn;
          case "single":
            return singleBtn;
          default:
            return commonBtns;
        }
      };

      let focusEffectZIndex = Number(targetElem.style.zIndex) - 1;
      if (isNaN(focusEffectZIndex)) focusEffectZIndex = 0;

      const focusEffectPadding = 12;
      const space = 8;
      let top: number | undefined;
      let left: number | undefined;
      let transform: string | undefined;
      switch (placement) {
        case "top-left":
          top = targetTop - focusEffectPadding - space;
          left = targetLeft - focusEffectPadding;
          transform = "translateY(-100%)";
          break;
        case "top-center":
          top = targetTop - focusEffectPadding - space;
          left = targetLeft + targetElem.offsetWidth / 2;
          transform = "translate(-50%, -100%)";
          break;
        case "top-right":
          top = targetTop - focusEffectPadding - space;
          left = targetLeft + targetElem.offsetWidth + focusEffectPadding;
          transform = "translate(-100%, -100%)";
          break;
        case "left-top":
          top = targetTop - focusEffectPadding;
          left = targetLeft - focusEffectPadding - space;
          transform = "translateX(-100%)";
          break;
        case "left-center":
          top = targetTop + targetHeight / 2;
          left = targetLeft - focusEffectPadding - space;
          transform = "translate(-100%, -50%)";
          break;
        case "left-bottom":
          top = targetTop + targetHeight + focusEffectPadding;
          left = targetLeft - focusEffectPadding - space;
          transform = "translate(-100%, -100%)";
          break;
        case "right-top":
          top = targetTop - focusEffectPadding;
          left = targetLeft + targetWidth + focusEffectPadding + space;
          transform = undefined;
          break;
        case "right-center":
          top = targetTop + targetHeight / 2;
          left = targetLeft + targetWidth + focusEffectPadding + space;
          transform = "translateY(-50%)";
          break;
        case "right-bottom":
          top = targetTop + targetHeight + focusEffectPadding;
          left = targetLeft + targetWidth + focusEffectPadding + space;
          transform = "translateY(-100%)";
          break;
        case "bottom-right":
          top = targetTop + targetHeight + focusEffectPadding + space;
          left = targetLeft + targetWidth + focusEffectPadding;
          transform = "translateX(-100%)";
          break;
        case "bottom-center":
          top = targetTop + targetHeight + focusEffectPadding + space;
          left = targetLeft + targetWidth / 2;
          transform = "translateX(-50%)";
          break;
        default:
          // bottom-left
          top = targetTop + targetHeight + focusEffectPadding + space;
          left = targetLeft - focusEffectPadding;
          transform = undefined;
          break;
      }

      return (
        <>
          {/* <Stack
            pos="absolute"
            top={`${top}px`}
            left={`${left}px`}
            transform={transform}
            minW="256px"
            minH="128px"
            p={4}
            rounded="md"
            bg={maybeDarkMode() ? "gray.600" : "gray.300"}
            spacing={0}
          >
            {content}
            <Spacer />
            <Box mt={2}>{btns()}</Box>
          </Stack>

          <Box
            zIndex={focusEffectZIndex || "auto"}
            pos="absolute"
            top={`${targetTop - focusEffectPadding}px`}
            left={`${targetLeft - focusEffectPadding}px`}
            w={`${targetWidth + focusEffectPadding * 2}px`}
            h={`${targetHeight + focusEffectPadding * 2}px`}
            border="3px solid"
            rounded="md"
            borderColor={"orange.400"}
            pointerEvents="none"
          /> */}
          <div>
            defaultRender Render
            <div>
              top {top}, left {left}, transform {transform}
            </div>
            <div>{btns()}</div>
            <div>maybeDarkMode {maybeDarkMode()}</div>
          </div>
        </>
      );
    };

    this._steps.push({
      targetQuery,
      render: render ?? defaultRender,
      scrollInView: scrollInView ?? false,
      canRender: canRender ?? (() => true),
      noticeMsg: noticeMsg ?? "You need follow the tutorial.",
      noticeTitle: noticeTitle ?? "Can not go next",
      backNoticeMsg: backNoticeMsg ?? "You can't do previous step twice.",
      backNoticeTitle: backNoticeTitle ?? "Can not back",
      noticeDuration: noticeDuration ?? 3000,
      placement: placement ?? "bottom-left",
    });
  }
}

type CheckCanRenderType = "current" | "next" | "prev";
type StepType = "last" | "first" | "common" | "single";
type Placement =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "left-top"
  | "left-bottom"
  | "left-center"
  | "right-top"
  | "right-bottom"
  | "right-center";
type RenderFuncBasicArg = {
  targetElem: Element;
  stepType: StepType;
  next: () => void;
  prev: () => void;
  stop: () => void;
  placement: Placement;
  totalStep: number;
  currentStep: number;
};
type RenderFunc<A extends Array<any>> = (
  basicArg: RenderFuncBasicArg,
  ...args: A
) => JSX.Element;

type TutorialStep<A extends Array<any>> = {
  targetQuery: string;
  render: RenderFunc<A>;
  noticeMsg: string;
  noticeTitle: string;
  backNoticeMsg: string;
  backNoticeTitle: string;
  noticeDuration: number;
  scrollInView: boolean;
  placement: Placement;
  canRender: () => boolean;
};
type AddStepParams<A extends Array<any>> = Partial<
  Omit<TutorialStep<A>, "targetQuery">
> & {
  targetQuery: string;
  content?: JSX.Element;
};

export type EasyTutorialNoticeMeta = {
  msg: string;
  title: string;
  duration: number;
};
type TutorialEvents = {
  nextStep: void;
  prevStep: void;
  start: void;
  stop: void;
  canNotNext: EasyTutorialNoticeMeta;
};
type TutorialEmitter = Emitter<TutorialEvents>;

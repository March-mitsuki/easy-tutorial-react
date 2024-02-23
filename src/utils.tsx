export const buildPortalElem = () => {
  const portal = document.createElement("div");
  portal.id = "easy-tutorial-portal";
  portal.style.position = "absolute";
  portal.style.zIndex = "2000";
  portal.style.top = "0";
  portal.style.left = "0";
  return portal;
};

export const getElemAbsPos = (elem: HTMLElement) => {
  const rect = elem.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
};

const findElemByXPath = (xpath: string) => {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue;
};

export const findElemByEasyTutorialQuery = (query: string): Element | null => {
  let result: Node | Element | null;
  try {
    result = findElemByXPath(query);
  } catch (error) {
    try {
      result = document.querySelector(query);
    } catch (error) {
      console.error(
        `[EasyTutorial] can not find elem by query ${query}:`,
        error
      );
      result = null;
    }
  }

  if (!result || !(result instanceof Element)) {
    return null;
  }
  return result;
};

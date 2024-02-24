import { EasyTutorial } from "../../src";

export const easyTutorial = new EasyTutorial();

const introduction = easyTutorial.addTutorial("introduction");
introduction.addStep({
  targetQuery: "#logos",
  content: <div>This is the logos section</div>,
  noticeDuration: 1000 * 60 * 60,
});
introduction.addStep({
  targetQuery: `//*[@id="root"]/div[3]/p`,
  content: <div>This is the first paragraph</div>,
});
introduction.addStep({
  targetQuery: `//*[@id="logos"]/a[1]/img`,
  content: <div>This is the vite logo</div>,
});

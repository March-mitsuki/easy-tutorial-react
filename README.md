# Why easy-tutorial-react

1. Easy-to-use Declarative API
2. Full control over rendering process
3. Use any UI library you want to write your own render function
4. Write code that is completely separate from the main rendering logic
5. Default supports rendering in both light mode and dark mode
6. Completely written in TypeScript
7. MIT LICENSE

# Quick Start

Create a `EasyTutorial` class and pass it as a dataSource to the `EasyTutorialRenderer` and `EasyTutorialNoticeRenderer`.

```tsx
import {
  EasyTutorial,
  EasyTutorialRenderer,
  EasyTutorialNoticeRenderer,
} from "easy-tutorial-react";

const easyTutorial = new EasyTutorial();

const intro = easyTutorial.addTutorial("intro")
introduction.addStep({
   // You can also use XPath for search target element.
   // Plase take a look at `Use XPath` section.
   targetQuery: "#page-title",
   // content must be a single JSX.Element
   content: <div>Hello from easy-tutorial-react, you can click next button to go next.</div>
})
introduction.addStep({
   targetQuery: "#page-contents",
   contents: <div>Step 2 here.</div>,
   // You can pass a placement to control where the tutorial appears.
   // Default is "bottom-left"
   placement: "bottom-center",
})

export default function App() {
   return (
      <>
         <EasyTutorialRenderer dataSource={easyTutorial} />
         <EasyTutorialNoticeRenderer dataSource={easyTutorial} />

         <main>
            <button onClick={() => easyTutorial.start("intro")}>
               Start Tutorial
            </button>

            <h1 id="page-title">Page Title</h1>
            <p id="page-contents">Page contents</p>
         </main>
      </>
   )
}
```

**notice**
We won't make any changes to the browser's DOM before you actively render the EasyTutorialRenderer. 

So, We recommend having the EasyTutorialRenderer as one of the first components to render in your React project, such as placing it in `App.tsx` or another initial component where your React app renders.

# Use XPath

You can use XPath in `targetQuery` for searching the target element.

This means you don't have to assign an ID to every target element in order to locate its position.

This gives easy-tutorial-react the ability to write code that is completely separated from the main rendering logic.

You can quickly find the elements you need to locate in a complex and multi-page system, just by using the browser's F12 (Developer Tools).

Something like:
```tsx
myTutorial.addStep({
   targetQuery: `/html/body/ntp-app//div/div[2]/ntp-realbox//div/input`,
   content: <div>Hello tutorial.</div>
})
```

**notice**
Some UI frameworks may change the structure of the DOM tree. ( Such as ChakraUI, which adds some extra nodes to the document when changing color mode. )

This can lead to the same XPath locating diffrent elements.

To solve this problem, we recommend still adding some IDs to your components. This IDs will act similarly to "keyframes" when using XPath to search.

For example, add a top-level ID to each page component:
```tsx
const Header = () => {
   return (
      <div id="my-header">
         Header
      </div>
   )
}

const Footer = () => {
   return (
      <div id="my-footer">
         Footer
      </div>
   )
}

const UserPage = () => {
   return (
      <div id="user-page">
         User Page
      </div>
   )
}

export default function App() {
   return (
      <>
         <Header />

         <UserPage />

         <Footer />
      </>
   )
}

```

# TypeScript Best Practices

First, in your `App.tsx` or another component where your React app first renders, add `EasyTutorialRenderer` and `EasyTutorialNoticeRenderer` components.
```tsx
// App.tsx //

import {
  EasyTutorialRenderer,
  EasyTutorialNoticeRenderer,
} from "easy-tutorial-react";

export default function App() {
   // ...
   return (
      <>
         {/* If you are using typescript,
             you will get some type error here.
             Don't worry, we will fix it later. */}
         <EasyTutorialRenderer />
         <EasyTutorialNoticeRenderer />

         {/* Other components here */}
      </>
   )
}
```

Then, create a new file called `tutorial.tsx`, or any other name you prefer. We will write our tutorial code inside it.
```tsx
// tutorial.tsx //

import { EasyTutorial } from "easy-tutorial-react";

/** Type EasyTutorial Class  */
type MyTutorials = "intro" | "how-to-use"

// Export easyTutorial, we will use it in `App.tsx`
export const easyTutorial = new EasyTutorial<MyTutorials>();

/**
 * Create your tutorials by use `addTutorial` method.
 * Because we passed a custom type to the EasyTutorial Class,
 * IDE will automatically suggest the tutorial names we can choose from.
 */
const intro = easyTutorial.addTutorial("intro")

// Then we can use `addStep` to add steps to the intro tutorial.
intro.addStep({
   // ...
})

// You can do the same things for other tutorials you have created.
const howToUse = easyTutorial.addTutorial("how-to-use")
howToUse.addStep({
   // ...
})
```

Finally, we need to pass easyTutorial as a dataSource to the renderer.
```tsx
// App.tsx //

import {
  EasyTutorialRenderer,
  EasyTutorialNoticeRenderer,
} from "easy-tutorial-react";
import { easyTutorial } from "./tutorial.tsx"

export default function App() {
   // ...
   return (
      <>
         <EasyTutorialRenderer dataSource={easyTutorial} />
         <EasyTutorialNoticeRenderer dataSource={easyTutorial} />

         {/* Other components here */}
      </>
   )
}
```

Optionally, easy-tutorial-react supports rendering in both light mode and dark mode by default.

You can pass a `ColorMode` variable in the **first** parameter of renderer's `extendRenderArgs` to render different components in diffrent modes.

In the convention, the type of ColorMode must be `type ColorMode = "light" | "dark";`

If you are using ChakraUI, you can do it like this:
```tsx
// App.tsx //

import {
  EasyTutorialRenderer,
  EasyTutorialNoticeRenderer,
} from "easy-tutorial-react";
import { useColorMode } from "@chakra-ui/react";

import { easyTutorial } from "./tutorial.tsx"

export default function App() {
   const { colorMode } = useColorMode();

   // ...

   return (
      <>
         <EasyTutorialRenderer
            dataSource={easyTutorial}
            extendRenderArgs={[colorMode]}
         />
         <EasyTutorialNoticeRenderer
            dataSource={easyTutorial}
            extendRenderArgs={[colorMode]}
         />

         {/* Other components */}
      </>
   )
}
```

# Configuration

## Conditional Rendering

The addStep method accepts parameters such as `canRender` and `noticeMsg` for conditional rendering.

This can be used for elements that require the user to click a button before they are rendered.

For example:
```tsx
myTutorial.addStep({
   targetQuery: "#target-elem",
   content: <div>Hello, tutorial</div>,
   canRender: () => {
      if (!document.querySelector("#some-element")) {
         return false
      }
      return true
   },
   noticeMsg: "You need to follow the tutorial and click the button before go to the next step."
   noticeTitle: "Can't go next"
})
```

canRender is called every time an attempt is made to render that step, whether it's rendering the _next_ step or _back_ step.

`noticeMsg` is the message rendered when canRender for the _next_ step returns false, while `backNoticeMsg` is for the _back_ step.

This can be used for operations that cannot be repeatedly clicked within the same flow.

For example:
```tsx
myTutorial.addStep({
   targetQuery: "#target-elem",
   content: <div>Hello, tutorial</div>,
   canRender: () => {
      if (/* some condition */) {
         return false
      }
      return true
   },
   backNoticeMsg: "You cannot do previous action twice."
   backNoticeTitle: "Cannot back"
})
```

The type definition for AddStepParams is as follows in [this file](/src/tutorial.tsx):
```tsx
type TutorialStep<A extends Array<any>> = {
  targetQuery: string;
  content: JSX.Element;
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
  Omit<TutorialStep<A>, "targetQuery" | "content">
> & {
  targetQuery: string;
  content?: JSX.Element;
};
```

## Use Custom Rendering

You have two ways to customize the rendering function.

One, you can call `overrideDefaultRender` method **before** `addStep`.
```tsx
myTutorial.overrideDefaultRender((basicArgs, ...args) => {
  const { currentContent, next, prev, stop } = basicArgs;
  return (
   <div>
      {currentContent}
      <button onClick={prev}>Back</button>
      <button onClick={next}>Next</button>
      <button onClick={stop}>Close</button>
   </div>
  );
});

myTutorial.addStep({
   targetQuery: "#target-elem",
   content: <div>Hello tutorial</div>
})
```

Two, You can passing a render function in every addStep.
```tsx
myTutorial.addStep({
   targetQuery: "#target-elem",
   render: (basicArgs, ...args) => {
      // ...
   }
})
```

The rendering function must accept a basicArgs, as well as any parameters passed through the renderer's extendRenderArgs.

The type definition for BasicArgs is as follows in [this file](/src/tutorial.tsx):
```tsx
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
export type RenderFuncBasicArg = {
  targetElem: Element; // The target element found through targetQuery.
  stepType: StepType; // You should determine the rendering of buttons based on the stepType, for example, for 'single' you should not render `nextBtn` and `backBtn`.
  next: () => void; // Next button should call this function to go next.
  prev: () => void; // Back button should call this function to go back.
  stop: () => void; // Stop button should call this function to stop tutorial.
  placement: Placement; // The placement passed when calling addStep.
  totalStep: number;
  currentStep: number;
};
export type RenderFunc<A extends Array<any>> = (
  basicArg: RenderFuncBasicArg,
  ...args: A // The Args passed through the renderer's extendRenderArgs.
) => JSX.Element;
```

## Use Custom Notice

easy-tutorial-react provides a default notice renderer called `EasyTutorialNoticeRenderer`, but you also have the option to implement your own notice renderer.

When rendering is not possible, the EasyTutorial Class will emit a "canNotRender" event, which you can listen to in order to provide feedback to the user.

The default notice render is written as a standalone React functional component for extensibility.

However, our own implementation logic doesn't necessarily need to be written as a separate component.

Once you have implemented your own notice render logic, you **can** delete the default EasyTutorialNoticeRenderer.

For example:
```tsx
import { useEffect } from "react"
import {
  EasyTutorialRenderer,
} from "easy-tutorial-react";

const easyTutorial = new EasyTutorial();

export default function App() {
   // ...
   useEffect(() => {
      easyTutorial.on("canNotRender", ({ msg, title, duration }) => {
         window.alert(msg);
      });
   }, []);

   return (
      <>
         <EasyTutorialRenderer dataSource={easyTutorial} />

         {/* Other components */}
      </>
   )
}
```

The default implementation is in [this file](/src/notice.tsx).

# LICENSE

MIT

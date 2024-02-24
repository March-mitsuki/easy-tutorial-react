import { useState } from "react";
import { EasyTutorialNoticeRenderer, EasyTutorialRenderer } from "../../src";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { easyTutorial } from "./tutorial";

function App() {
  const [count, setCount] = useState(0);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

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
      <button
        type="button"
        onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
      >
        Change Color Mode
      </button>
      <button
        type="button"
        onClick={() => {
          easyTutorial.start("introduction");
        }}
      >
        Start
      </button>
      <div id="logos" style={{ marginTop: "4rem" }}>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

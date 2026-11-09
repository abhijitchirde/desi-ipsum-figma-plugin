import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import Inputs, { InputValues } from "./components/Inputs";
import Buttons from "./components/Buttons";
import BottomSection from "./components/BottomSection";

function App() {
  const [input, setInput] = React.useState<InputValues>({ num: "5", block: "sentences" });

  const onGenerate = (lang: string) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-desi-ipsum",
          data: { num: input.num, block: input.block, lang },
        },
      },
      "*"
    );
  };

  return (
    <main>
      <Inputs value={input} onChange={setInput} />

      <Buttons onClick={onGenerate} />

      <BottomSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")!).render(<App />);

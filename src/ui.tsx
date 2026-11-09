import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import Inputs, { InputValues } from "./components/Inputs";
import Buttons from "./components/Buttons";
import BottomSection from "./components/BottomSection";

function App() {
  const [input, setInput] = React.useState<InputValues>({ num: "5", block: "sentences" });

  // Restore the last used amount and type (saved per user by the plugin).
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage;
      if (msg?.type === "settings" && msg.value) setInput(msg.value);
    };
    window.addEventListener("message", onMessage);
    parent.postMessage({ pluginMessage: { type: "get-settings" } }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const onInputChange = (value: InputValues) => {
    setInput(value);
    parent.postMessage({ pluginMessage: { type: "save-settings", value } }, "*");
  };

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
      <Inputs value={input} onChange={onInputChange} />

      <Buttons onClick={onGenerate} />

      <BottomSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")!).render(<App />);

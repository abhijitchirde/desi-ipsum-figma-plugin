import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import Inputs from "./components/Inputs";
import Buttons from "./components/Buttons";
import BottomSection from "./components/BottomSection";
import PageHeading from "./components/PageHeading";

declare function require(path: string): any;

function App() {
  var inputCopy = { num: 5, block: "sentences" };

  const getInput = (val) => {
    inputCopy = { num: val.num, block: val.block };
  };

  const onGenerate = (lang) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-desi-ipsum",
          data: { ...inputCopy, lang: lang },
        },
      },
      "*"
    );
  };

  return (
    <main>
      {/* <PageHeading content="Desi Ipsum" /> */}

      <Inputs onInput={getInput} />

      <Buttons onClick={onGenerate} />

      <BottomSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);

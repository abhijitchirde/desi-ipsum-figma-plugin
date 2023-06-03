import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";

declare function require(path: string): any;

function App() {
  const [input, setInput] = React.useState({
    num: 5,
    lang: "Hindi",
    block: "words",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onGenerate = () => {
    console.log(input.num);
    console.log(input.lang);
    console.log(input.block);
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-desi-ipsum",
          data: { ...input },
        },
      },
      "*"
    );
  };

  const onDisclaimer = () => {
    parent.postMessage({ pluginMessage: { type: "disclaimer" } }, "*");
  };

  return (
    <main>
      <p className="head-label">How much text do you want?</p>

      <div className="main-content-div">
        <div className="input-group-div">
          <input
            className="input-number"
            type="number"
            id="inputBox"
            value={input.num}
            min="0"
            onInput={handleChange}
            name="num"
          />
          <select
            className="dropdown-main-type"
            id="type"
            value={input.block}
            onChange={handleChange}
            name="block"
          >
            <option id="words" className="dropdown-item" value="words">
              Words
            </option>
            <option id="sent" className="dropdown-item" value="sentences">
              Sentences
            </option>
            <option id="para" className="dropdown-item" value="paragraphs">
              Paragraphs
            </option>
          </select>

          <p className="conj-text">in</p>

          <select
            className="dropdown-main-lang"
            id="language"
            value={input.lang}
            onChange={handleChange}
            name="lang"
          >
            <option id="hi" className="dropdown-item" value="Hindi">
              Hindi (हिंदी)
            </option>
            <option id="sa" className="dropdown-item" value="Sanskrit">
              Sanskrit (संस्कृतम्)
            </option>
            <option id="mr" className="dropdown-item" value="Marathi">
              Marathi (मराठी)
            </option>
            <option id="kn" className="dropdown-item" value="Kannada">
              Kannada (ಕನ್ನಡ)
            </option>
            <option id="ta" className="dropdown-item" value="Tamil">
              Tamil (தமிழ்)
            </option>
            <option id="te" className="dropdown-item" value="Telugu">
              Telugu (తెలుగు)
            </option>
            <option id="ba" className="dropdown-item" value="Bangla">
              Bangla (বাংলা)
            </option>
            <option id="gu" className="dropdown-item" value="Gujarati">
              Gujarati (ગુજરાતી)
            </option>
            <option id="ma" className="dropdown-item" value="Malayalam">
              Malayalam (മലയാളം)
            </option>
            <option id="od" className="dropdown-item" value="Odia">
              Odia (ଓଡ଼ିଆ)
            </option>
            <option id="pa" className="dropdown-item" value="Punjabi">
              Punjabi (ਪੰਜਾਬੀ)
            </option>
          </select>
        </div>
      </div>

      <div className="buttons-div">
        <button className="button-pri" id="getDesiIpsum" onClick={onGenerate}>
          Generate
        </button>
      </div>

      {/* Container at bottom to hold two elements at fixed position. */}
      <div className="bottomContainer">
        <footer className="bottomItem">
          <button
            className="disclaimer-text"
            id="disclaimer"
            onClick={onDisclaimer}
          >
            Disclaimer
          </button>
          <div className="blank-space-in-footer"></div>
          <p className="credit-text">
            <a href="https://abhijitchirde.com" target="_blank">
              ♥️
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);

import * as React from "react";

const BottomSection = () => {
  const onDisclaimer = () => {
    parent.postMessage({ pluginMessage: { type: "disclaimer" } }, "*");
  };
  return (
    <div className="bottomContainer">
      <button
        className="disclaimer-text"
        id="disclaimer"
        onClick={onDisclaimer}
      >
        Disclaimer
      </button>

      <p className="credit-text">
        <a href="https://abhijitchirde.com" target="_blank">
          <span className="heart">❤️ </span> from Abhijit
        </a>
      </p>
    </div>
  );
};

export default BottomSection;

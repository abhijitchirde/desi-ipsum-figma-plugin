import * as React from "react";
import ThemeToggle from "./ThemeToggle";

const BottomSection = () => {
  const onDisclaimer = () => {
    parent.postMessage({ pluginMessage: { type: "disclaimer" } }, "*");
  };
  return (
    <div className="bottom-wrapper">
      <div className="disclaimer-container">
        <button
          className="disclaimer-text"
          id="disclaimer"
          onClick={onDisclaimer}
        >
          Disclaimer
        </button>
      </div>

      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="credit-container">
        <p className="credit-text">
          <a href="https://x.com/abhxde" target="_blank">
            by Abhijit
          </a>
        </p>
      </div>
    </div>
  );
};

export default BottomSection;

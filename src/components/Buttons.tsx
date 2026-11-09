import * as React from "react";
import LangButton from "./LangButton";
import { LANGUAGES } from "../data/languages";

interface ButtonsProps {
  onClick: (langId: string) => void;
}

const desi = LANGUAGES.filter((lang) => lang.group === "desi");
const classic = LANGUAGES.filter((lang) => lang.group === "classic");

const Buttons = ({ onClick }: ButtonsProps) => {
  return (
    <>
      <div className="content-div">
        <p className="section-label">from</p>
        <div className="buttons-div buttons-grid">
          {desi.map((lang) => (
            <LangButton key={lang.id} lang={lang} onClick={onClick} />
          ))}
        </div>
      </div>

      <div className="content-div">
        <p className="section-label">or western classics</p>
        <div className="buttons-div">
          {classic.map((lang) => (
            <LangButton key={lang.id} lang={lang} onClick={onClick} wide />
          ))}
        </div>
      </div>
    </>
  );
};

export default Buttons;

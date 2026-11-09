import * as React from "react";
import type { LanguageConfig } from "../data/languages";

interface LangProps {
  lang: LanguageConfig;
  onClick: (langId: string) => void;
  wide?: boolean;
}

const LangButton = ({ lang, onClick, wide = false }: LangProps) => {
  return (
    <button
      className={wide ? "button-pri button-wide" : "button-pri"}
      title={lang.nativeName}
      onClick={() => onClick(lang.id)}
    >
      {lang.label}
    </button>
  );
};

export default LangButton;

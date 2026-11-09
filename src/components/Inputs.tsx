import * as React from "react";
import { MAX_COUNT, Mode } from "../data/languages";

export interface InputValues {
  /** Kept as a string so the field can be empty while typing; validated by the plugin. */
  num: string;
  block: Mode;
}

interface InputProps {
  value: InputValues;
  onChange: (value: InputValues) => void;
}

const Inputs = ({ value, onChange }: InputProps) => {
  const isFill = value.block === "fill";

  return (
    <div className="content-div">
      <p className="section-label">I want</p>
      <div className="input-group-div">
        <input
          className="input-number"
          type="number"
          id="inputBox"
          aria-label="How many"
          title={isFill ? "Not needed: the text fills each layer's box" : undefined}
          value={isFill ? "" : value.num}
          placeholder={isFill ? "–" : undefined}
          disabled={isFill}
          min={1}
          max={isFill ? undefined : MAX_COUNT[value.block as Exclude<Mode, "fill">]}
          onChange={(e) => onChange({ ...value, num: e.target.value })}
          name="num"
        />

        <select
          className="dropdown-main-type"
          id="type"
          aria-label="Text unit"
          value={value.block}
          onChange={(e) => onChange({ ...value, block: e.target.value as Mode })}
          name="block"
        >
          <option className="dropdown-item" value="words">
            Words
          </option>
          <option className="dropdown-item" value="sentences">
            Sentences
          </option>
          <option className="dropdown-item" value="paragraphs">
            Paragraphs
          </option>
          <option className="dropdown-item" value="fill">
            Fill text box
          </option>
        </select>
      </div>
    </div>
  );
};

export default Inputs;

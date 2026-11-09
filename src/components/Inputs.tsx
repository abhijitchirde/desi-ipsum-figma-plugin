import * as React from "react";
import { MAX_COUNT, Unit } from "../data/languages";

export interface InputValues {
  /** Kept as a string so the field can be empty while typing; validated by the plugin. */
  num: string;
  block: Unit;
}

interface InputProps {
  value: InputValues;
  onChange: (value: InputValues) => void;
}

const Inputs = ({ value, onChange }: InputProps) => {
  return (
    <div className="content-div">
      <p className="section-label">I want</p>
      <div className="input-group-div">
        <input
          className="input-number"
          type="number"
          id="inputBox"
          aria-label="How many"
          value={value.num}
          min={1}
          max={MAX_COUNT[value.block]}
          onChange={(e) => onChange({ ...value, num: e.target.value })}
          name="num"
        />

        <select
          className="dropdown-main-type"
          id="type"
          aria-label="Text unit"
          value={value.block}
          onChange={(e) => onChange({ ...value, block: e.target.value as Unit })}
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
        </select>
      </div>
    </div>
  );
};

export default Inputs;

import * as React from "react";

interface InputProps {
  onInput: any;
}

const Inputs = ({ onInput }: InputProps) => {
  const [input, setInput] = React.useState({
    num: 5,
    block: "sentences",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => {
      return { ...prev, [name]: value };
    });

    onInput({ ...input, [name]: value });
  };

  return (
    <>
      <div className="content-div">
        <p className="section-label">I want</p>
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
        </div>
      </div>
    </>
  );
};

export default Inputs;

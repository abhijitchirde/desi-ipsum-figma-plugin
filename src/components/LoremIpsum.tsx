import * as React from "react";

const LoremIpsum = ({ onClick }) => {
  const clickHandler = (e) => {
    onClick(e.target.value);
  };

  return (
    <>
      <div className="content-div">
        <p className="section-label">or</p>
        <div className="buttons-div">
          <button
            className="button-pri button-single"
            value="Lorem"
            onClick={clickHandler}
          >
            Traditional Lorem Ipsum
          </button>
        </div>
      </div>
    </>
  );
};

export default LoremIpsum;

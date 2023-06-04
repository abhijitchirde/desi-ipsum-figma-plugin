import * as React from "react";
import LangButton from "./LangButton";

const Buttons = ({ onClick }) => {
  const clickHandler = (e) => {
    onClick(e.target.value);
  };
  return (
    <>
      <div className="content-div">
        <p className="head-label">from</p>
        <div className="buttons-div">
          <LangButton name="Hindi" inScript="हिंदी" action={clickHandler} />
          <LangButton
            name="Sanskrit"
            inScript="संस्कृतम्"
            action={clickHandler}
          />
          <LangButton name="Marathi" inScript="मराठी" action={clickHandler} />
          <LangButton name="Kannada" inScript="ಕನ್ನಡ" action={clickHandler} />
          <LangButton name="Tamil" inScript="தமிழ்" action={clickHandler} />
          <LangButton name="Bangla" inScript="বাংলা" action={clickHandler} />
          <LangButton
            name="Gujarati"
            inScript="ગુજરાતી"
            action={clickHandler}
          />
          <LangButton
            name="Malayalam"
            inScript="മലയാളം"
            action={clickHandler}
          />
          <LangButton name="Odia" inScript="ଓଡ଼ିଆ" action={clickHandler} />
          <LangButton name="Punjabi" inScript="ਪੰਜਾਬੀ" action={clickHandler} />
        </div>
      </div>
    </>
  );
};

export default Buttons;

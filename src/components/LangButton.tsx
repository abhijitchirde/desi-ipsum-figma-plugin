import * as React from "react";

interface LangProps {
  name: string;
  inScript: string;
  action: any;
}

const LangButton = ({ name, inScript, action }: LangProps) => {
  return (
    <>
      <button className="button-pri" value={name} onClick={action}>
        {name} {/* ({inScript}) */}
      </button>
    </>
  );
};

export default LangButton;

import * as React from "react";

const PageHeading = ({ content }: { content: string }) => {
  return (
    <>
      <div className="heading-div">
        <p className="heading-text">{content}</p>
      </div>
    </>
  );
};

export default PageHeading;

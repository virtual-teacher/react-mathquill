import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";

const DevContainer = () => {
  const [value, setValue] = useState("");

  return (
    <ReactMathQuill
      value={value}
      onChange={setValue}
      buttonSets={[]}
      onFocus={() => null}
      onBlur={() => null}
    />
  );
};

ReactDOM.render(<DevContainer />, document.body);

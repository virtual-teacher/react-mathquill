import React, { useState } from "react";
import ReactDOM, { render } from "react-dom";
import MathInput from "./MathInput";

const DevContainer = () => {
  const [value, setValue] = useState("");

  return (
    <MathInput
      value={value}
      onChange={setValue}
      buttonSets={[]}
      onFocus={() => null}
      onBlur={() => null}
    />
  );
};

ReactDOM.render(<DevContainer />, document.body);

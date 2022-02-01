import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("3.1415\\div5");

  return (
    <div>
      <ReactMathQuill
        value={value}
        onChange={setValue}
        replaceOnEdit={[
          [/\\div/g, ":"],
          [/\./g, ","],
        ]}
      />
      <div>{value}</div>
    </div>
  );
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

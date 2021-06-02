import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("");

  console.log("[DEBUG] value changed", value); // eslint-disable-line

  return (
    <div>
      <ReactMathQuill value={value} onChange={setValue} />
      <div>{value}</div>
    </div>
  );
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

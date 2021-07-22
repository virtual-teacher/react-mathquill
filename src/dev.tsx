import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("3.1415");

  console.log("[DEBUG] value changed", value); // eslint-disable-line

  return (
    <div>
      <p>jeżeli formuła wcześniej już miała kropkę</p>
      <ReactMathQuill value={value} onChange={setValue} />
      <div>{value}</div>
    </div>
  );
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

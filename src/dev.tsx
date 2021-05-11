import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("");

  return <ReactMathQuill value={value} onChange={setValue} />;
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

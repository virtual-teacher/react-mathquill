import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";
const DevContainer = () => {
    const [value, setValue] = useState("");
    return _jsx(ReactMathQuill, { value: value, onChange: setValue }, void 0);
};
const root = document.createElement("div");
document.body.append(root);
ReactDOM.render(_jsx(DevContainer, {}, void 0), root);

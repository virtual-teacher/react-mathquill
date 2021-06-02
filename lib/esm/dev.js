import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";
const DevContainer = () => {
    const [value, setValue] = useState("");
    console.log("[DEBUG] value changed", value); // eslint-disable-line
    return (_jsxs("div", { children: [_jsx(ReactMathQuill, { value: value, onChange: setValue }, void 0),
            _jsx("div", { children: value }, void 0)] }, void 0));
};
const root = document.createElement("div");
document.body.append(root);
ReactDOM.render(_jsx(DevContainer, {}, void 0), root);

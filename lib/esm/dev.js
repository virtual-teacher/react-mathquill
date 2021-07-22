import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";
const DevContainer = () => {
    const [value, setValue] = useState("3.1415");
    console.log("[DEBUG] value changed", value); // eslint-disable-line
    return (_jsxs("div", { children: [_jsx("p", { children: "je\u017Celi formu\u0142a wcze\u015Bniej ju\u017C mia\u0142a kropk\u0119" }, void 0),
            _jsx(ReactMathQuill, { value: value, onChange: setValue }, void 0),
            _jsx("div", { children: value }, void 0)] }, void 0));
};
const root = document.createElement("div");
document.body.append(root);
ReactDOM.render(_jsx(DevContainer, {}, void 0), root);

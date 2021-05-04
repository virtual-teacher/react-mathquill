import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
const DevContainer = () => {
    const [value, setValue] = useState("");
    return (_jsx(ReactMathQuill, { value: value, onChange: setValue, buttonSets: [], onFocus: () => null, onBlur: () => null }, void 0));
};
ReactDOM.render(_jsx(DevContainer, {}, void 0), document.body);

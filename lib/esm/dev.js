import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { ReactMathQuill } from "./index";
import "./mathquill.css";
const DevContainer = () => {
    const [value, setValue] = useState("3.1415\\div5");
    const [mq, setMQ] = useState(null);
    const updateFormula = useCallback((cmd) => {
        if (mq) {
            mq.cmd(cmd).focus();
        }
    }, [mq]);
    return (_jsxs("div", { children: [_jsx(ReactMathQuill, { value: value, onChange: setValue, replaceOnEdit: [
                    [/\\div/g, ":"],
                    [/\./g, ","],
                ], onInit: setMQ }, void 0),
            _jsx("button", Object.assign({ onClick: () => updateFormula("\\langle") }, { children: "langle" }), void 0),
            _jsx("button", Object.assign({ onClick: () => updateFormula("\\rangle") }, { children: "rangle" }), void 0),
            _jsx("button", Object.assign({ onClick: () => updateFormula("(") }, { children: "(" }), void 0),
            _jsx("button", Object.assign({ onClick: () => updateFormula(")") }, { children: ")" }), void 0),
            _jsx("div", { children: value }, void 0)] }, void 0));
};
const root = document.createElement("div");
document.body.append(root);
ReactDOM.render(_jsx(DevContainer, {}, void 0), root);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const index_1 = require("./index");
require("./mathquill.css");
const DevContainer = () => {
    const [value, setValue] = react_1.useState("3.1415\\div5");
    const [mq, setMQ] = react_1.useState(null);
    const updateFormula = react_1.useCallback((cmd) => {
        if (mq) {
            mq.cmd(cmd).focus();
            setValue(mq.latex());
        }
    }, [mq]);
    return (jsx_runtime_1.jsxs("div", { children: [jsx_runtime_1.jsx(index_1.ReactMathQuill, { value: value, onChange: setValue, replaceOnEdit: [
                    [/\\div/g, ":"],
                    [/\./g, ","],
                ], onInit: setMQ }, void 0),
            jsx_runtime_1.jsx("button", Object.assign({ onClick: () => updateFormula("\\langle") }, { children: "langle" }), void 0),
            jsx_runtime_1.jsx("button", Object.assign({ onClick: () => updateFormula("\\rangle") }, { children: "rangle" }), void 0),
            jsx_runtime_1.jsx("button", Object.assign({ onClick: () => updateFormula("(") }, { children: "(" }), void 0),
            jsx_runtime_1.jsx("button", Object.assign({ onClick: () => updateFormula(")") }, { children: ")" }), void 0),
            jsx_runtime_1.jsx("div", { children: value }, void 0)] }, void 0));
};
const root = document.createElement("div");
document.body.append(root);
react_dom_1.default.render(jsx_runtime_1.jsx(DevContainer, {}, void 0), root);

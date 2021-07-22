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
    const [value, setValue] = react_1.useState("3.1415");
    console.log("[DEBUG] value changed", value); // eslint-disable-line
    return (jsx_runtime_1.jsxs("div", { children: [jsx_runtime_1.jsx("p", { children: "je\u017Celi formu\u0142a wcze\u015Bniej ju\u017C mia\u0142a kropk\u0119" }, void 0),
            jsx_runtime_1.jsx(index_1.ReactMathQuill, { value: value, onChange: setValue }, void 0),
            jsx_runtime_1.jsx("div", { children: value }, void 0)] }, void 0));
};
const root = document.createElement("div");
document.body.append(root);
react_dom_1.default.render(jsx_runtime_1.jsx(DevContainer, {}, void 0), root);

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
    const [value, setValue] = react_1.useState("");
    return (jsx_runtime_1.jsx(index_1.ReactMathQuill, { value: value, onChange: setValue, buttonSets: [], onFocus: () => null, onBlur: () => null }, void 0));
};
react_dom_1.default.render(jsx_runtime_1.jsx(DevContainer, {}, void 0), document.body);

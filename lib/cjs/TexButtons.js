"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_katex_1 = __importDefault(require("@matejmazur/react-katex"));
const prettyBig = { fontSize: "150%" };
const slightlyBig = { fontSize: "120%" };
const symbStyle = { fontSize: "130%" };
const basic = [
    () => [
        jsx_runtime_1.jsx("span", Object.assign({ style: slightlyBig }, { children: "+" }), "plus"),
        "+",
    ],
    () => [
        jsx_runtime_1.jsx("span", Object.assign({ style: prettyBig }, { children: "-" }), "minus"),
        "-",
    ],
    () => [
        jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: prettyBig }, { children: "\\cdot" }), "times"),
        "\\cdot",
    ],
    () => [
        jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: prettyBig }, { children: "\\frac{□}{□}" }), "frac"),
        // If there's something in the input that can become part of a
        // fraction, typing "/" puts it in the numerator. If not, typing
        // "/" does nothing. In that case, enter a \frac.
        (input) => {
            const contents = input.latex();
            input.typedText("/");
            if (input.latex() === contents) {
                input.cmd("\\frac");
            }
        },
    ],
];
const buttonSets = {
    basic,
    "basic+div": basic.concat([() => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\div" }, "div"), "\\div"]]),
    trig: [
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\sin" }, "sin"), "\\sin"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\cos" }, "cos"), "\\cos"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\tan" }, "tan"), "\\tan"],
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: symbStyle }, { children: "\\theta" }), "theta"),
            "\\theta",
        ],
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: symbStyle }, { children: "\\phi" }), "pi"),
            "\\phi",
        ],
    ],
    prealgebra: [
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\sqrt{x}" }, "sqrt"), "\\sqrt"],
        // TODO(joel) - how does desmos do this?
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, { children: "\\sqrt[3]{x}" }, "nthroot"),
            (input) => {
                input.typedText("nthroot3");
                input.keystroke("Right");
            },
        ],
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: slightlyBig }, { children: "\u25A1^a" }), "pow"),
            (input) => {
                const contents = input.latex();
                input.typedText("^");
                // If the input hasn't changed (for example, if we're
                // attempting to add an exponent on an empty input or an empty
                // denominator), insert our own "a^b"
                if (input.latex() === contents) {
                    input.typedText("a^b");
                }
            },
        ],
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, Object.assign({ style: slightlyBig }, { children: "\\pi" }), "pi"),
            "\\pi",
        ],
    ],
    logarithms: [
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\log" }, "log"), "\\log"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\ln" }, "ln"), "\\ln"],
        () => [
            jsx_runtime_1.jsx(react_katex_1.default, { children: "\\log_b" }, "log_b"),
            (input) => {
                input.typedText("log_");
                input.keystroke("Right");
                input.typedText("(");
                input.keystroke("Left");
                input.keystroke("Left");
            },
        ],
    ],
    "basic relations": [
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "=" }, "eq"), "="],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\lt" }, "lt"), "\\lt"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\gt" }, "gt"), "\\gt"],
    ],
    "advanced relations": [
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\neq" }, "neq"), "\\neq"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\leq" }, "leq"), "\\leq"],
        () => [jsx_runtime_1.jsx(react_katex_1.default, { children: "\\geq" }, "geq"), "\\geq"],
    ],
};
const TexButtons = ({ sets, onInsert }) => {
    const sortedButtonSets = sets.sort();
    const buttons = sortedButtonSets.map((setName) => buttonSets[setName]);
    const mapRow = (colIndex) => (symbGen, rowIndex) => {
        // create a (component, thing we should send to mathquill) pair
        const symbol = symbGen();
        return (jsx_runtime_1.jsx("button", Object.assign({ onClick: () => onInsert(symbol[1]), className: "tex-button", tabIndex: -1, type: "button" }, { children: symbol[0] }), `col-${colIndex}-row-${rowIndex}`));
    };
    const mapRows = (row, colIndex) => row.map(mapRow(colIndex));
    const buttonRows = buttons.map(mapRows);
    const buttonPopup = buttonRows.map((row, i) => (jsx_runtime_1.jsx("div", Object.assign({ className: "clearfix tex-button-row" }, { children: row }), sets[i])));
    return jsx_runtime_1.jsx("div", Object.assign({ className: "preview-measure" }, { children: buttonPopup }), void 0);
};
exports.default = TexButtons;

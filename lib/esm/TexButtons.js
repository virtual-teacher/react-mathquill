import { jsx as _jsx } from "react/jsx-runtime";
import TeX from "@matejmazur/react-katex";
const prettyBig = { fontSize: "150%" };
const slightlyBig = { fontSize: "120%" };
const symbStyle = { fontSize: "130%" };
const basic = [
    () => [
        _jsx("span", Object.assign({ style: slightlyBig }, { children: "+" }), "plus"),
        "+",
    ],
    () => [
        _jsx("span", Object.assign({ style: prettyBig }, { children: "-" }), "minus"),
        "-",
    ],
    () => [
        _jsx(TeX, Object.assign({ style: prettyBig }, { children: "\\cdot" }), "times"),
        "\\cdot",
    ],
    () => [
        _jsx(TeX, Object.assign({ style: prettyBig }, { children: "\\frac{□}{□}" }), "frac"),
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
    "basic+div": basic.concat([() => [_jsx(TeX, { children: "\\div" }, "div"), "\\div"]]),
    trig: [
        () => [_jsx(TeX, { children: "\\sin" }, "sin"), "\\sin"],
        () => [_jsx(TeX, { children: "\\cos" }, "cos"), "\\cos"],
        () => [_jsx(TeX, { children: "\\tan" }, "tan"), "\\tan"],
        () => [
            _jsx(TeX, Object.assign({ style: symbStyle }, { children: "\\theta" }), "theta"),
            "\\theta",
        ],
        () => [
            _jsx(TeX, Object.assign({ style: symbStyle }, { children: "\\phi" }), "pi"),
            "\\phi",
        ],
    ],
    prealgebra: [
        () => [_jsx(TeX, { children: "\\sqrt{x}" }, "sqrt"), "\\sqrt"],
        // TODO(joel) - how does desmos do this?
        () => [
            _jsx(TeX, { children: "\\sqrt[3]{x}" }, "nthroot"),
            (input) => {
                input.typedText("nthroot3");
                input.keystroke("Right");
            },
        ],
        () => [
            _jsx(TeX, Object.assign({ style: slightlyBig }, { children: "\u25A1^a" }), "pow"),
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
            _jsx(TeX, Object.assign({ style: slightlyBig }, { children: "\\pi" }), "pi"),
            "\\pi",
        ],
    ],
    logarithms: [
        () => [_jsx(TeX, { children: "\\log" }, "log"), "\\log"],
        () => [_jsx(TeX, { children: "\\ln" }, "ln"), "\\ln"],
        () => [
            _jsx(TeX, { children: "\\log_b" }, "log_b"),
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
        () => [_jsx(TeX, { children: "=" }, "eq"), "="],
        () => [_jsx(TeX, { children: "\\lt" }, "lt"), "\\lt"],
        () => [_jsx(TeX, { children: "\\gt" }, "gt"), "\\gt"],
    ],
    "advanced relations": [
        () => [_jsx(TeX, { children: "\\neq" }, "neq"), "\\neq"],
        () => [_jsx(TeX, { children: "\\leq" }, "leq"), "\\leq"],
        () => [_jsx(TeX, { children: "\\geq" }, "geq"), "\\geq"],
    ],
};
const TexButtons = ({ sets, onInsert }) => {
    const sortedButtonSets = sets.sort();
    const buttons = sortedButtonSets.map((setName) => buttonSets[setName]);
    const mapRow = (colIndex) => (symbGen, rowIndex) => {
        // create a (component, thing we should send to mathquill) pair
        const symbol = symbGen();
        return (_jsx("button", Object.assign({ onClick: () => onInsert(symbol[1]), className: "tex-button", tabIndex: -1, type: "button" }, { children: symbol[0] }), `col-${colIndex}-row-${rowIndex}`));
    };
    const mapRows = (row, colIndex) => row.map(mapRow(colIndex));
    const buttonRows = buttons.map(mapRows);
    const buttonPopup = buttonRows.map((row, i) => (_jsx("div", Object.assign({ className: "clearfix tex-button-row" }, { children: row }), sets[i])));
    return _jsx("div", Object.assign({ className: "preview-measure" }, { children: buttonPopup }), void 0);
};
export default TexButtons;

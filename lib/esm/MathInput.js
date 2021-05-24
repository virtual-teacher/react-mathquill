import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import MathQuill from "mathquill";
class MathInput extends React.Component {
    constructor() {
        super(...arguments);
        this.mathinputRef = React.createRef();
        this.handleFocus = () => {
            if (this.props.onFocus) {
                this.props.onFocus();
            }
        };
        this.handleBlur = () => {
            if (this.props.onBlur) {
                this.props.onBlur();
            }
        };
        this.mathField = (options) => {
            // The MathQuill API is now "versioned" through its own "InterVer"
            // system.
            // See: https://github.com/mathquill/mathquill/pull/459
            const MQ = MathQuill.getInterface(2);
            // MathQuill.MathField takes a DOM node, MathQuill-ifies it if it's
            // seeing that node for the first time, then returns the associated
            // MathQuill object for that node. It is stable - will always return
            // the same object when called on the same DOM node.
            return MQ.MathField(this.mathinputRef.current, options);
        };
        this.insert = (value) => {
            const input = this.mathField();
            if (typeof value === "function") {
                value(input);
            }
            else if (value[0] === "\\") {
                input.cmd(value).focus();
            }
            else {
                input.write(value).focus();
            }
            input.focus();
        };
    }
    componentDidMount() {
        const { value, onChange, onInit } = this.props;
        let initialized = false;
        // Initialize MathQuill.MathField instance
        this.mathField({
            // LaTeX commands that, when typed, are immediately replaced by the
            // appropriate symbol. This does not include ln, log, or any of the
            // trig functions; those are always interpreted as commands.
            autoCommands: "pi theta phi sqrt nthroot div cdot",
            // Pop the cursor out of super/subscripts on arithmetic operators
            // or (in)equalities.
            charsThatBreakOutOfSupSub: "+-*/=<>≠≤≥",
            // Prevent excessive super/subscripts or fractions from being
            // created without operands, e.g. when somebody holds down a key
            supSubsRequireOperand: true,
            // The name of this option is somewhat misleading, as tabbing in
            // MathQuill breaks you out of a nested context (fraction/script)
            // if you're in one, but moves focus to the next input if you're
            // not. Spaces (with this option enabled) are just ignored in the
            // latter case.
            //
            // TODO(alex): In order to allow inputting mixed numbers, we will
            // have to accept spaces in certain cases. The desired behavior is
            // still to escape nested contexts if currently in one, but to
            // insert a space if not (we don't expect mixed numbers in nested
            // contexts). We should also limit to one consecutive space.
            spaceBehavesLikeTab: true,
            handlers: {
                edited: (mathField) => {
                    // This handler is guaranteed to be called on change, but
                    // unlike React it sometimes generates false positives.
                    // One of these is on initialization (with an empty string
                    // value), so we have to guard against that below.
                    let latex = mathField.latex();
                    // Provide a MathQuill-compatible way to generate the
                    // not-equals sign without pasting unicode or typing TeX
                    latex = latex.replace(/<>/g, "\\ne");
                    // VT: divide sign directly from keyboard (this effectively removes this sign from editor,
                    // but might be added later on on demand by removing this line)
                    latex = latex.replace(/\:/g, "\\div");
                    // Use the specified symbol to represent multiplication
                    // TODO(alex): Add an option to disallow variables, in
                    // which case 'x' should get converted to '\\times'
                    latex = latex.replace(/\\cdot/g, "\\times");
                    // Preserve cursor position in the common case:
                    // typing '*' to insert a multiplication sign.
                    // We do this by modifying internal MathQuill state
                    // directly, instead of waiting for `.latex()` to be
                    // called in `componentDidUpdate()`.
                    const left = mathField.__controller.cursor[MathQuill.L];
                    if (left && left.ctrlSeq === "\\cdot ") {
                        mathField.__controller.backspace();
                        mathField.cmd("\\times");
                    }
                    if (initialized && value !== latex) {
                        onChange(latex);
                    }
                },
                enter: () => {
                    // This handler is called when the user presses the enter
                    // key. Since this isn't an actual <input> element, we have
                    // to manually trigger the usually automatic form submit.
                    if (this.props.onSubmit) {
                        this.props.onSubmit(this.mathField());
                    }
                },
                upOutOf: (mathField) => {
                    // This handler is called when the user presses the up
                    // arrow key, but there is nowhere in the expression to go
                    // up to (no numerator or exponent). For ease of use,
                    // interpret this as an attempt to create an exponent.
                    mathField.typedText("^");
                },
            },
        });
        // Ideally, we would be able to pass an initial value directly into
        // the constructor above
        this.mathField().latex(value);
        onInit && onInit(this.mathField());
        initialized = true;
    }
    componentDidUpdate() {
        const { value } = this.props;
        if (this.mathField().latex() !== value) {
            this.mathField().latex(value);
        }
    }
    render() {
        var _a;
        const className = "mq-editable-field mq-math-mode";
        return (_jsx("div", Object.assign({ style: { display: "inline-block", width: "100%" } }, { children: _jsx("div", Object.assign({ style: { display: "inline-block", width: "100%" } }, { children: _jsx("span", { ref: this.mathinputRef, className: className, "aria-label": (_a = this.props) === null || _a === void 0 ? void 0 : _a.label, onFocus: this.handleFocus, onBlur: this.handleBlur }, void 0) }), void 0) }), void 0));
    }
}
export default MathInput;

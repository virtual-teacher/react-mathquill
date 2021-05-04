import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom";
import MathQuill from "mathquill";
import TexButtons from "./TexButtons";
class MathInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            focused: false,
        };
        this.mouseDown = false;
        this.labelText = "desktop input";
        this.mathinputRef = React.createRef();
        // handlers:
        // keep track of two related bits of state:
        // * this.state.focused - whether the buttons are currently shown
        // * this.mouseDown - whether a mouse click is active that started in the
        //   buttons div
        this.handleFocus = () => {
            this.setState({ focused: true });
            // TODO(joel) fix properly - we should probably allow onFocus handlers
            // to this property, but we need to work correctly with them.
            // if (this.props.onFocus) {
            //     this.props.onFocus();
            // }
        };
        this.handleMouseDown = (event) => {
            var _a;
            const focused = (_a = ReactDOM.findDOMNode(this)) === null || _a === void 0 ? void 0 : _a.contains(event.target); // eslint-disable-line
            this.mouseDown = Boolean(focused);
            if (!focused) {
                this.setState({ focused: false });
            }
        };
        this.handleMouseUp = () => {
            // this mouse click started in the buttons div so we should focus the
            // input
            if (this.mouseDown) {
                this.focus();
            }
            this.mouseDown = false;
        };
        this.handleBlur = () => {
            if (!this.mouseDown) {
                this.setState({ focused: false });
            }
        };
        this.focus = () => {
            this.mathField().focus();
            this.setState({ focused: true });
        };
        this.blur = () => {
            this.mathField().blur();
            this.setState({ focused: false });
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
            return MQ.MathField(ReactDOM.findDOMNode(this.mathinputRef.current), options); // eslint-disable-line
        };
        this.shouldShowButtons = () => {
            const { focused } = this.state;
            const { buttonsVisible } = this.props;
            if (buttonsVisible === "always") {
                return true;
            }
            if (buttonsVisible === "never") {
                return false;
            }
            return focused;
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
        const { value, onChange } = this.props;
        window.addEventListener("mousedown", this.handleMouseDown);
        window.addEventListener("mouseup", this.handleMouseUp);
        let initialized = false;
        // Initialize MathQuill.MathField instance
        this.mathField({
            // LaTeX commands that, when typed, are immediately replaced by the
            // appropriate symbol. This does not include ln, log, or any of the
            // trig functions; those are always interpreted as commands.
            autoCommands: "pi theta phi sqrt nthroot",
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
                    // Use the specified symbol to represent multiplication
                    // TODO(alex): Add an option to disallow variables, in
                    // which case 'x' should get converted to '\\times'
                    latex = latex.replace(/\\times/g, "\\cdot");
                    if (initialized && value !== latex) {
                        onChange(latex);
                    }
                },
                enter: () => {
                    // This handler is called when the user presses the enter
                    // key. Since this isn't an actual <input> element, we have
                    // to manually trigger the usually automatic form submit.
                    // $(ReactDOM.findDOMNode(this.refs.mathinput)).submit();
                    console.log("should submit if input");
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
        initialized = true;
    }
    componentDidUpdate() {
        const { value } = this.props;
        if (this.mathField().latex() !== value) {
            this.mathField().latex(value);
        }
    }
    componentWillUnmount() {
        window.removeEventListener("mousedown", this.handleMouseDown);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }
    render() {
        const className = "mq-editable-field mq-math-mode";
        const { buttonSets } = this.props;
        let buttons = null;
        if (this.shouldShowButtons()) {
            buttons = _jsx(TexButtons, { sets: buttonSets, onInsert: this.insert }, void 0);
        }
        return (_jsxs("div", Object.assign({ style: { display: "inline-block", width: "100%" } }, { children: [_jsx("div", Object.assign({ style: { display: "inline-block", width: "100%" } }, { children: _jsx("span", { ref: this.mathinputRef, className: className, "aria-label": this.labelText, onFocus: this.handleFocus, onBlur: this.handleBlur }, void 0) }), void 0),
                _jsx("div", Object.assign({ style: { position: "relative" } }, { children: buttons }), void 0)] }), void 0));
    }
}
export default MathInput;

import React from "react";
import ReactDOM from "react-dom";

import MathQuill from "mathquill";
import TexButtons from "./TexButtons";

type MathFieldOptions = Record<string, unknown>;
type MQInstance = {
  latex: (input?: string) => string;
  typedText: (input: string) => MQInstance;
  keystroke: (input: string) => MQInstance;
  write: (input: string) => MQInstance;
  cmd: (cmd: string) => MQInstance;
  focus: () => MQInstance;
  blur: () => MQInstance;
};

type MathInputProps = {
  value: string;
  onChange: (value: string) => void;
  buttonsVisible?: "always" | "never" | "focused";
  buttonSets: string[];
  onFocus: () => void;
  onBlur: () => void;
};

type MathInputState = {
  focused: boolean;
};

class MathInput extends React.Component<MathInputProps, MathInputState> {
  state = {
    focused: false,
  };

  mouseDown = false;

  labelText = "desktop input";

  mathinputRef = React.createRef<HTMLSpanElement>();

  componentDidMount(): void {
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
        edited: (mathField: MQInstance) => {
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
        upOutOf: (mathField: MQInstance) => {
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

  componentDidUpdate(): void {
    const { value } = this.props;
    if (this.mathField().latex() !== value) {
      this.mathField().latex(value);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  // handlers:
  // keep track of two related bits of state:
  // * this.state.focused - whether the buttons are currently shown
  // * this.mouseDown - whether a mouse click is active that started in the
  //   buttons div

  handleFocus = (): void => {
    this.setState({ focused: true });
    // TODO(joel) fix properly - we should probably allow onFocus handlers
    // to this property, but we need to work correctly with them.
    // if (this.props.onFocus) {
    //     this.props.onFocus();
    // }
  };

  handleMouseDown = (event: MouseEvent): void => {
    const focused = ReactDOM.findDOMNode(this)?.contains(event.target as Node); // eslint-disable-line
    this.mouseDown = Boolean(focused);

    if (!focused) {
      this.setState({ focused: false });
    }
  };

  handleMouseUp = (): void => {
    // this mouse click started in the buttons div so we should focus the
    // input
    if (this.mouseDown) {
      this.focus();
    }
    this.mouseDown = false;
  };

  handleBlur = (): void => {
    if (!this.mouseDown) {
      this.setState({ focused: false });
    }
  };

  focus = (): void => {
    this.mathField().focus();
    this.setState({ focused: true });
  };

  blur = (): void => {
    this.mathField().blur();
    this.setState({ focused: false });
  };

  mathField = (options?: MathFieldOptions): MQInstance => {
    // The MathQuill API is now "versioned" through its own "InterVer"
    // system.
    // See: https://github.com/mathquill/mathquill/pull/459
    const MQ = MathQuill.getInterface(2);

    // MathQuill.MathField takes a DOM node, MathQuill-ifies it if it's
    // seeing that node for the first time, then returns the associated
    // MathQuill object for that node. It is stable - will always return
    // the same object when called on the same DOM node.
    return MQ.MathField(
      ReactDOM.findDOMNode(this.mathinputRef.current),
      options
    ); // eslint-disable-line
  };

  shouldShowButtons = (): boolean => {
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

  insert = (value: string | ((input: MQInstance) => void)) => {
    const input = this.mathField();
    if (typeof value === "function") {
      value(input);
    } else if (value[0] === "\\") {
      input.cmd(value).focus();
    } else {
      input.write(value).focus();
    }
    input.focus();
  };

  render(): React.ReactNode {
    const className = "mq-editable-field mq-math-mode";
    const { buttonSets } = this.props;

    let buttons = null;

    if (this.shouldShowButtons()) {
      buttons = <TexButtons sets={buttonSets} onInsert={this.insert} />;
    }

    return (
      <div style={{ display: "inline-block", width: "100%" }}>
        <div style={{ display: "inline-block", width: "100%" }}>
          <span
            ref={this.mathinputRef}
            className={className}
            aria-label={this.labelText}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
        <div style={{ position: "relative" }}>{buttons}</div>
      </div>
    );
  }
}

export default MathInput;

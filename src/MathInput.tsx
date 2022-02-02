import React from "react";
import MathQuill from "mathquill";

type MathFieldOptions = Record<string, unknown>;
export type MQInstance = {
  latex: (input?: string) => string;
  typedText: (input: string) => MQInstance;
  keystroke: (input: string) => MQInstance;
  write: (input: string) => MQInstance;
  cmd: (cmd: string) => MQInstance;
  focus: () => MQInstance;
  blur: () => MQInstance;
  __controller: {
    cursor: Record<string, Record<string, unknown>>;
    backspace: () => unknown;
  };
};

type MathInputProps = {
  value: string;
  label?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onInit?: (input: MQInstance) => void;
  onSubmit?: (input: MQInstance) => void;
  replaceOnEdit?: Array<[RegExp, string]>;
};

class MathInput extends React.Component<MathInputProps> {
  mathInputRef = React.createRef<HTMLSpanElement>();
  cachedMathField: MQInstance | null = null;
  initialized: boolean = false;

  constructor(props: MathInputProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value: string) {
    const { onChange } = this.props;
    onChange(value);
  }

  componentDidMount(): void {
    const { value, onInit } = this.props;

    // Initialize MathQuill.MathField instance
    const mathField = this.mathField({
      // LaTeX commands that, when typed, are immediately replaced by the
      // appropriate symbol. This does not include ln, log, or any of the
      // trig functions; those are always interpreted as commands.
      autoCommands: "pi theta phi sqrt nthroot cdot rangle langle",

      // Pop the cursor out of super/subscripts on arithmetic operators
      // or (in)equalities.
      charsThatBreakOutOfSupSub: "=<>≠≤≥",

      // Prevent excessive super/subscripts or fractions from being
      // created without operands, e.g. when somebody holds down a key
      supSubsRequireOperand: true,

      restrictMismatchedBrackets: false,

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
        edit: this.handleEdit,
        enter: () => {
          // This handler is called when the user presses the enter
          // key. Since this isn't an actual <input> element, we have
          // to manually trigger the usually automatic form submit.
          if (this.props.onSubmit) {
            this.props.onSubmit(this.mathField());
          }
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
    mathField.latex(value);

    onInit && onInit(mathField);
    this.initialized = true;
  }

  componentDidUpdate(): void {
    const { value } = this.props;
    if (this.mathField().latex() !== value) {
      this.mathField().latex(value);
    }
  }

  handleEdit = (mathField: MQInstance): void => {
    const { replaceOnEdit } = this.props;
    // This handler is guaranteed to be called on change, but
    // unlike React it sometimes generates false positives.
    // One of these is on initialization (with an empty string
    // value), so we have to guard against that below.
    let latex = mathField.latex();

    // Provide a MathQuill-compatible way to generate the
    // not-equals sign without pasting unicode or typing TeX
    latex = latex.replace(/<>/g, "\\ne");

    // VT: we have custom requirements regarding how symbols should be rendered, and that may change in future for different environments
    if (replaceOnEdit?.length) {
      for (let index in replaceOnEdit) {
        const [rule, replace] = replaceOnEdit[index];

        latex = latex.replace(rule, replace);
      }
    }

    // Use the specified symbol to represent multiplication
    // TODO(alex): Add an option to disallow variables, in
    // which case 'x' should get converted to '\\times'
    latex = latex.replace(/\\times/g, "\\cdot");

    if (this.initialized) {
      this.onChange(latex);
    }
  };

  handleFocus = (): void => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  handleBlur = (): void => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  mathField = (options?: MathFieldOptions): MQInstance => {
    if (!options && this.cachedMathField) {
      return this.cachedMathField;
    }
    // The MathQuill API is now "versioned" through its own "InterVer"
    // system.
    // See: https://github.com/mathquill/mathquill/pull/459
    const MQ = MathQuill.getInterface(2);

    // MathQuill.MathField takes a DOM node, MathQuill-ifies it if it's
    // seeing that node for the first time, then returns the associated
    // MathQuill object for that node. It is stable - will always return
    // the same object when called on the same DOM node.
    this.cachedMathField = MQ.MathField(this.mathInputRef.current, options);
    return this.cachedMathField!;
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

    return (
      <div style={{ display: "inline-block", width: "100%" }}>
        <div style={{ display: "inline-block", width: "100%" }}>
          <span
            ref={this.mathInputRef}
            className={className}
            aria-label={this.props?.label}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
      </div>
    );
  }
}

export default MathInput;

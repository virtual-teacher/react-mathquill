import React from "react";
declare type MathFieldOptions = Record<string, unknown>;
export declare type MQInstance = {
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
declare type MathInputProps = {
    value: string;
    label?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onInit?: (input: MQInstance) => void;
    onSubmit?: (input: MQInstance) => void;
    replaceOnEdit?: Array<[RegExp, string]>;
};
declare class MathInput extends React.Component<MathInputProps> {
    mathInputRef: React.RefObject<HTMLSpanElement>;
    cachedMathField: MQInstance | null;
    initialized: boolean;
    constructor(props: MathInputProps);
    onChange(value: string): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    handleEdit: (mathField: MQInstance) => void;
    handleFocus: () => void;
    handleBlur: () => void;
    mathField: (options?: MathFieldOptions | undefined) => MQInstance;
    insert: (value: string | ((input: MQInstance) => void)) => void;
    render(): React.ReactNode;
}
export default MathInput;

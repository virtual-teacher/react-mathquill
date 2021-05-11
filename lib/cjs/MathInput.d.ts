import React from "react";
declare type MathFieldOptions = Record<string, unknown>;
declare type MQInstance = {
    latex: (input?: string) => string;
    typedText: (input: string) => MQInstance;
    keystroke: (input: string) => MQInstance;
    write: (input: string) => MQInstance;
    cmd: (cmd: string) => MQInstance;
    focus: () => MQInstance;
    blur: () => MQInstance;
};
declare type MathInputProps = {
    value: string;
    label?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onInit?: (input: MQInstance) => void;
    onSubmit?: (input: MQInstance) => void;
};
declare class MathInput extends React.Component<MathInputProps> {
    mathinputRef: React.RefObject<HTMLSpanElement>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    handleFocus: () => void;
    handleBlur: () => void;
    mathField: (options?: MathFieldOptions | undefined) => MQInstance;
    insert: (value: string | ((input: MQInstance) => void)) => void;
    render(): React.ReactNode;
}
export default MathInput;
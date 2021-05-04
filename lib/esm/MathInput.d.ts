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
    onChange: (value: string) => void;
    buttonsVisible?: "always" | "never" | "focused";
    buttonSets: string[];
    onFocus: () => void;
    onBlur: () => void;
};
declare type MathInputState = {
    focused: boolean;
};
declare class MathInput extends React.Component<MathInputProps, MathInputState> {
    state: {
        focused: boolean;
    };
    mouseDown: boolean;
    labelText: string;
    mathinputRef: React.RefObject<HTMLSpanElement>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    handleFocus: () => void;
    handleMouseDown: (event: MouseEvent) => void;
    handleMouseUp: () => void;
    handleBlur: () => void;
    focus: () => void;
    blur: () => void;
    mathField: (options?: MathFieldOptions | undefined) => MQInstance;
    shouldShowButtons: () => boolean;
    insert: (value: string | ((input: MQInstance) => void)) => void;
    render(): React.ReactNode;
}
export default MathInput;

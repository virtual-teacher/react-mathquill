import React from "react";
declare type MQInstance = {
    latex: () => string;
    typedText: (input: string) => void;
    keystroke: (input: string) => void;
    cmd: (cmd: string) => void;
};
declare type SymbolDetails = string | ((input: MQInstance) => void);
declare type TexButtonsProps = {
    sets: string[];
    onInsert: (details: SymbolDetails) => void;
};
declare const TexButtons: React.FC<TexButtonsProps>;
export default TexButtons;

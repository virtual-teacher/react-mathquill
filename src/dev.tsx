import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import { MQInstance } from "MathInput";

import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("3.1415\\div5");
  const [mq, setMQ] = useState<MQInstance | null>(null);

  const updateFormula = useCallback((cmd: string) => {
    if (mq) {
      mq.cmd(cmd).focus();
      setValue(mq.latex());
    }
  }, [mq]);

  return (
    <div>
      <ReactMathQuill
        value={value}
        onChange={setValue}
        replaceOnEdit={[
          [/\\div/g, ":"],
          [/\./g, ","],
        ]}
        onInit={setMQ}
      />
      <button onClick={() => updateFormula("\\langle")}>langle</button>
      <button onClick={() => updateFormula("\\rangle")}>rangle</button>
      <button onClick={() => updateFormula("(")}>(</button>
      <button onClick={() => updateFormula(")")}>)</button>
      <div>{value}</div>
    </div>
  );
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

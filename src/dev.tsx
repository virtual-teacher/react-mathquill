import React, { useState } from "react";
import ReactDOM from "react-dom";

import { MQInstance } from "MathInput";

import { ReactMathQuill } from "./index";
import "./mathquill.css";

const DevContainer = () => {
  const [value, setValue] = useState("3.1415\\div5");
  const [mq, setMQ] = useState<MQInstance | null>(null);

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
      <button
        onClick={() => {
          if (mq) {
            mq.cmd("\\rangle").focus();
            setValue(mq.latex());
          }
        }}
      >
        Trigger update
      </button>
      <div>{value}</div>
    </div>
  );
};

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(<DevContainer />, root);

/* eslint-disable react/prop-types, react/sort-comp */

import React from "react";

import TeX from "@matejmazur/react-katex";

const prettyBig = { fontSize: "150%" };
const slightlyBig = { fontSize: "120%" };
const symbStyle = { fontSize: "130%" };

// These are functions because we want to generate a new component for each use
// on the page rather than reusing an instance (which will cause an error).
// Also, it's useful for things which might look different depending on the
// props.

type MQInstance = {
  latex: () => string;
  typedText: (input: string) => void;
  keystroke: (input: string) => void;
  cmd: (cmd: string) => void;
};
type SymbolDetails = string | ((input: MQInstance) => void);
type SymbolGenerator = (
  props?: Record<string, unknown>
) => [React.ReactNode, SymbolDetails];

const basic: Array<SymbolGenerator> = [
  () => [
    <span key="plus" style={slightlyBig}>
      +
    </span>,
    "+",
  ],
  () => [
    <span key="minus" style={prettyBig}>
      -
    </span>,
    "-",
  ],

  () => [
    <TeX key="times" style={prettyBig}>
      \cdot
    </TeX>,
    "\\cdot",
  ],
  () => [
    <TeX key="frac" style={prettyBig}>
      {"\\frac{□}{□}"}
    </TeX>,

    // If there's something in the input that can become part of a
    // fraction, typing "/" puts it in the numerator. If not, typing
    // "/" does nothing. In that case, enter a \frac.
    (input) => {
      const contents = input.latex();
      input.typedText("/");
      if (input.latex() === contents) {
        input.cmd("\\frac");
      }
    },
  ],
];

const buttonSets: Record<string, Array<SymbolGenerator>> = {
  basic,

  "basic+div": basic.concat([() => [<TeX key="div">\div</TeX>, "\\div"]]),

  trig: [
    () => [<TeX key="sin">\sin</TeX>, "\\sin"],
    () => [<TeX key="cos">\cos</TeX>, "\\cos"],
    () => [<TeX key="tan">\tan</TeX>, "\\tan"],
    () => [
      <TeX key="theta" style={symbStyle}>
        \theta
      </TeX>,
      "\\theta",
    ],
    () => [
      <TeX key="pi" style={symbStyle}>
        \phi
      </TeX>,
      "\\phi",
    ],
  ],

  prealgebra: [
    () => [<TeX key="sqrt">{"\\sqrt{x}"}</TeX>, "\\sqrt"],
    // TODO(joel) - how does desmos do this?
    () => [
      <TeX key="nthroot">{"\\sqrt[3]{x}"}</TeX>,
      (input) => {
        input.typedText("nthroot3");
        input.keystroke("Right");
      },
    ],
    () => [
      <TeX key="pow" style={slightlyBig}>
        □^a
      </TeX>,
      (input) => {
        const contents = input.latex();
        input.typedText("^");

        // If the input hasn't changed (for example, if we're
        // attempting to add an exponent on an empty input or an empty
        // denominator), insert our own "a^b"
        if (input.latex() === contents) {
          input.typedText("a^b");
        }
      },
    ],
    () => [
      <TeX key="pi" style={slightlyBig}>
        \pi
      </TeX>,
      "\\pi",
    ],
  ],

  logarithms: [
    () => [<TeX key="log">\log</TeX>, "\\log"],
    () => [<TeX key="ln">\ln</TeX>, "\\ln"],
    () => [
      <TeX key="log_b">\log_b</TeX>,
      (input) => {
        input.typedText("log_");
        input.keystroke("Right");
        input.typedText("(");
        input.keystroke("Left");
        input.keystroke("Left");
      },
    ],
  ],

  "basic relations": [
    () => [<TeX key="eq">=</TeX>, "="],
    () => [<TeX key="lt">\lt</TeX>, "\\lt"],
    () => [<TeX key="gt">\gt</TeX>, "\\gt"],
  ],

  "advanced relations": [
    () => [<TeX key="neq">\neq</TeX>, "\\neq"],
    () => [<TeX key="leq">\leq</TeX>, "\\leq"],
    () => [<TeX key="geq">\geq</TeX>, "\\geq"],
  ],
};

type TexButtonsProps = {
  sets: string[];
  onInsert: (details: SymbolDetails) => void;
};
const TexButtons: React.FC<TexButtonsProps> = ({ sets, onInsert }) => {
  const sortedButtonSets = sets.sort();
  const buttons = sortedButtonSets.map((setName) => buttonSets[setName]);

  const mapRow = (colIndex: number) => (
    symbGen: SymbolGenerator,
    rowIndex: number
  ) => {
    // create a (component, thing we should send to mathquill) pair
    const symbol = symbGen();

    return (
      <button
        onClick={() => onInsert(symbol[1])}
        className="tex-button"
        key={`col-${colIndex}-row-${rowIndex}`} // eslint-disable-line
        tabIndex={-1}
        type="button"
      >
        {symbol[0]}
      </button>
    );
  };
  const mapRows = (row: SymbolGenerator[], colIndex: number) =>
    row.map(mapRow(colIndex));
  const buttonRows = buttons.map(mapRows);

  const buttonPopup = buttonRows.map((row, i) => (
    <div className="clearfix tex-button-row" key={sets[i]}>
      {row}
    </div>
  ));

  return <div className="preview-measure">{buttonPopup}</div>;
};

export default TexButtons;

import { count } from "console";
import React, { useState, useEffect } from "react";

interface ITokenSequence {
  tokens: string[];
  reward: number;
}

interface IOptimalPathResult {
  maxReward: number;
  sequencesResult: string[];
  coordinates: [number, number][];
  found: boolean;
  executionTime: number;
}

interface NumericInputErrors {
  [key: string]: string;
}

export const InputManual = () => {
  const [tokenError, setTokenError] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [combinedTokens, setCombinedTokens] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueTokens, setUniqueTokens] = useState<number>(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const [bufferSize, setBufferSize] = useState<string>("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [numSequences, setNumSequences] = useState("");
  const [sequenceSize, setSequenceSize] = useState("");
  const [generatedMatrix, setGeneratedMatrix] = useState<string[][]>([]);
  const [numericInputErrors, setNumericInputErrors] =
    useState<NumericInputErrors>({
      bufferSize: "",
      rows: "",
      columns: "",
      numSequences: "",
      sequenceSize: "",
    });
  const [generatedSequences, setGeneratedSequences] = useState<
    ITokenSequence[]
  >([]);

  const totalRewards = generatedSequences.reduce(
    (total, sequence) => total + sequence.reward,
    0
  );

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const validateNumericInputs = () => {
    const errors: NumericInputErrors = {};

    const numericFields = [
      { key: "bufferSize", value: bufferSize, label: "Buffer size" },
      { key: "rows", value: rows, label: "Number of rows" },
      { key: "columns", value: columns, label: "Number of columns" },
      {
        key: "numSequences",
        value: numSequences,
        label: "Number of sequences",
        min: 2,
      },
      {
        key: "sequenceSize",
        value: sequenceSize,
        label: "Maximal sequences amount",
      },
    ];

    numericFields.forEach(({ key, value, label, min = 1 }) => {
      const intValue = parseInt(value);
      if (intValue < min) {
        errors[key] = `Error : ${label} must be at least ${min}.`;
      }
    });

    return errors;
  };
  useEffect(() => {
    const initialErrors = validateNumericInputs();
    setNumericInputErrors(initialErrors);
  }, [bufferSize, rows, columns, numSequences, sequenceSize]);

  useEffect(() => {
    if (combinedTokens) {
      const inputTokens = combinedTokens.toUpperCase().split(" ");
      if (inputTokens.some((token) => token.length !== 2)) {
        setTokenError("Error: Tokens must be exactly two characters long.");
      } else {
        setTokenError("");
      }
    } else {
      setTokenError("");
    }
  }, [combinedTokens]);

  useEffect(() => {
    setTokens(Array.from({ length: uniqueTokens }, () => ""));
  }, [uniqueTokens]);

  useEffect(() => {
    if (parseInt(sequenceSize) > parseInt(bufferSize)) {
      setNumericInputErrors((errors) => ({
        ...errors,
        sequenceSize:
          "Maximum size of sequences cannot be greater than the buffer size.",
      }));
    } else {
      setNumericInputErrors((errors) => {
        const newErrors = { ...errors };
        delete newErrors.sequenceSize;
        return newErrors;
      });
    }
  }, [sequenceSize, bufferSize]);

  const [optimalPathResult, setOptimalPathResult] =
    useState<IOptimalPathResult>({
      maxReward: 0,
      sequencesResult: [],
      coordinates: [],
      found: false,
      executionTime: 0,
    });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sequenceDict = Object.fromEntries(
      generatedSequences.map((seq) => [seq.tokens.join(","), seq.reward])
    );
    const tokensArray = combinedTokens
      .split(" ")
      .filter((token) => token.trim() !== "");

    const inputTokens = combinedTokens.toUpperCase().split(" ");
    if (inputTokens.some((token) => token.length !== 2)) {
      setTokenError("Error :    Tokens must be exactly two characters long.");
      return;
    } else {
      setTokenError("");
    }

    const numericErrors = validateNumericInputs();
    if (Object.keys(numericErrors).length > 0) {
      setNumericInputErrors(numericErrors);
      return;
    } else {
      setNumericInputErrors({});
    }

    const formData = {
      uniqueTokens,
      bufferSize: parseInt(bufferSize),
      rows: parseInt(rows),
      columns: parseInt(columns),
      numSequences: parseInt(numSequences),
      sequenceSize: parseInt(sequenceSize),
      sequences: sequenceDict,
      tokens: tokensArray,
    };

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setGeneratedMatrix(data.matrix);
      setGeneratedSequences(data.sequences);
      console.log(data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSolve = async () => {
    if (generatedMatrix.length === 0 || generatedSequences.length === 0) {
      alert("Please generate the matrix and sequences first!");
      return;
    }

    setisLoading(true);

    const sequencesForBackend = generatedSequences.map((seq) => ({
      tokens: seq.tokens,
      reward: seq.reward,
    }));

    try {
      const response = await fetch("http://localhost:5000/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matrix: generatedMatrix,
          sequences: sequencesForBackend,
          bufferSize: parseInt(bufferSize),
        }),
      });

      const data = await response.json();
      setOptimalPathResult({
        maxReward: data.maxReward,
        sequencesResult: data.optimalPath,
        coordinates: data.coordinates,
        found: true,
        executionTime: data.executionTime,
      });
    } catch (error) {
      console.error("Error solving optimal path", error);
    } finally {
      setisLoading(false);
    }
  };

  const downloadResult = () => {
    if (!optimalPathResult.found) {
      alert("No result to download!");
      return;
    }

    const content = [
      optimalPathResult.maxReward.toString(),
      optimalPathResult.sequencesResult.join(" "),
      ...optimalPathResult.coordinates.map(
        (coord) => `${coord[0]}, ${coord[1]}`
      ),
      "",
      `${optimalPathResult.executionTime.toFixed(0)} ms`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimal-path-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col border-basic border-2 w-full">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              1. SPECIFY BUFFER SIZE
            </div>
            <div className="mt-4 mb-4 px-10">
              <input
                type="number"
                id="buffersize"
                value={bufferSize}
                onChange={(e) => setBufferSize(e.target.value)}
                className="block text-center w-full px-10 py-2 bg-black border border-2 border-basic text-basic"
                placeholder="1"
                required
              />
              {numericInputErrors.bufferSize && (
                <p className="text-red-500 font-rajdhaniRegular mt-1">
                  {numericInputErrors.bufferSize}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col border-basic border-2">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              2. ENTER UNIQUE TOKENS
            </div>
            <div className="mt-4 mb-4 px-10">
              <input
                type="text"
                id="combinedTokens"
                value={combinedTokens}
                onChange={(e) =>
                  setCombinedTokens(e.target.value.toUpperCase())
                }
                className="w-full py-2 px-10 border border-2 border-basic text-center bg-black text-basic"
                placeholder="7A 55 1C E9"
                required
              />
              {tokenError && (
                <p className="text-red-500 font-rajdhaniRegular mt-1">
                  {tokenError}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col border-basic border-2">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              3. ENTER MATRIX SIZE
            </div>
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="flex flex-grow items-center mt-4 mb-4 justify-center space-x-8">
                <input
                  type="number"
                  id="rows"
                  placeholder="8"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                  className="block text-center w-28  py-2 border border-2 border-basic bg-black text-basic"
                  required
                />
                <p className="text-basic">X</p>
                <input
                  type="number"
                  id="columns"
                  placeholder="8"
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  className="block text-center w-28 py-2 border border-2 border-basic bg-black text-basic"
                  required
                />
              </div>
              <div className="flex flex-col justify-center items-center font-rajdhaniRegular">
                {numericInputErrors.rows && (
                  <p className="text-red-500">{numericInputErrors.rows}</p>
                )}
                {numericInputErrors.columns && (
                  <p className="text-red-500">{numericInputErrors.columns}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col border-basic border-2 w-full">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              4. ENTER SEQUENCES
            </div>
            <div className="flex flex-col w-full items-center mt-4 mb-4 justify-center space-y-8 px-10">
              <div className="flex flex-col w-full">
                <p className="text-basic font-rajdhaniRegular text-lg">
                  Enter Sequence Amount :{" "}
                </p>
                <input
                  type="number"
                  id="sequences"
                  placeholder="8"
                  value={numSequences}
                  onChange={(e) => setNumSequences(e.target.value)}
                  className="block text-center w-full py-2 px-10 border border-2 border-basic bg-black text-basic"
                  required
                />
                {numericInputErrors.numSequences && (
                  <p className="text-red-500 mt-1 font-rajdhaniRegular">
                    {numericInputErrors.numSequences}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <p className="text-basic font-rajdhaniRegular text-lg">
                  Enter Maximal Sequences Amount :
                </p>
                <input
                  type="number"
                  id="sequencessize"
                  placeholder="8"
                  value={sequenceSize}
                  onChange={(e) => setSequenceSize(e.target.value)}
                  className="block text-center w-full px-10 py-2 border border-2 border-basic bg-black text-basic"
                  required
                />
                {numericInputErrors.sequenceSize && (
                  <p className="text-red-500 mt-1 font-rajdhaniRegular">
                    {numericInputErrors.sequenceSize}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-4 py-4 bg-black text-basic border border-2 border-basic font-semibold text-xl font-rajdhaniSemiBold max-w-6/12"
          >
            Generate Matrix and Sequences
          </button>
        </div>
      </form>
      {generatedMatrix.length > 0 && generatedSequences.length > 0 && (
        <>
          <div className="result-container space-y-4 mt-8">
            <div className="matrix-container mb-4 mt-10 border border-2 border-basic min-w-[300px] min-h-[300px] overflow-auto font-rajdhaniRegular">
              <h3 className="flex items-center justify-center font-bold bg-basic text-center h-10 text-black font-rajdhaniBold text-2xl">
                Matrix
              </h3>
              <div className="matrix-box rounded-md h-full flex flex-col justify-center items-center text-basic font-rajdhaniRegular text-[20px]">
                {generatedMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex space-x-2">
                    {row.map((token: string, tokenIndex: number) => (
                      <span key={tokenIndex} className="p-2">
                        {token}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="sequences-container mb-4 mt-4 min-h-[200px] min-w-[300px] overflow-auto border border-2 border-basic">
              <h3 className="flex items-center justify-center font-bold bg-basic text-center h-10 text-black font-rajdhaniBold text-2xl">
                Sequences and Rewards
              </h3>
              <div className="sequences-box rounded-md text-basic font-rajdhaniRegular text-[20px]">
                {generatedSequences.map((sequence, index) => (
                  <div
                    key={index}
                    className="sequence-item rounded mb-2 p-2 flex flex-col items-center"
                  >
                    <span>
                      Sequence {index + 1} : {sequence.tokens.join(" ")}
                    </span>
                    <span className="reward font-bold text-blue-300">
                      Reward : {sequence.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-black rounded-lg max-w-lg w-full border border-2 border-basic">
                  <h3 className="flex items-center justify-center text-3xl font-bold text-black h-[50px] bg-basic text-center font-rajdhaniBold">
                    RESULT
                  </h3>
                  <div className="mt-8 mb-8 text-basic text-xl text-center space-y-4 font-rajdhaniRegular">
                    <div>Loading...</div>
                    <div>Sometimes it might take a long time ^.^</div>
                    <div>Please kindly wait</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={handleSolve}
                className="mt-8 px-8 py-4 bg-bgblack text-basic border border-2 border-basic font-semibold font-rajdhaniRegular text-xl"
              >
                Solve Optimal Path
              </button>
              {optimalPathResult.found && (
                <button
                  onClick={toggleModal}
                  className="flex justify-center px-4 py-2 mt-4 bg-basic text-black font-rajdhaniSemiBold font-semibold"
                >
                  View Result
                </button>
              )}
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
                <div className="bg-bgblack rounded-lg max-w-lg w-full border border-basic border-2 text-basic">
                  <h3 className="flex items-center justify-center text-3xl font-bold text-black h-[60px] bg-basic text-center font-rajdhaniBold">
                    RESULT
                  </h3>
                  <div className="pr-5 pl-5 pb-5">
                    <div className="mt-8 mb-8">
                      {optimalPathResult.maxReward === 0 ? (
                        <p className="text-basic font-rajdhaniRegular text-xl text-center">
                          There are no sequences.
                        </p>
                      ) : (
                        <>
                          <p className="text-[#5ee9f2] mb-2 text-2xl font-rajdhaniSemiBold">
                            {optimalPathResult.maxReward === totalRewards
                              ? "Full Solution Found!"
                              : "Partial Solution Found!"}
                          </p>
                          <div className="text-basic font-rajdhaniRegular text-xl">
                            <p>Max Reward : {optimalPathResult.maxReward}</p>
                            <p>
                              Best Path :{" "}
                              {optimalPathResult.sequencesResult.join(" -> ")}
                            </p>
                            <p>
                              Best Path Coordinates :{" "}
                              {optimalPathResult.coordinates
                                .map((coord) => `(${coord.join(", ")})`)
                                .join(" -> ")}
                            </p>
                            <p>
                              Execution Time :{" "}
                              {optimalPathResult.executionTime.toFixed(2)} ms
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-row space-x-4 justify-center">
                      {optimalPathResult.maxReward !== 0 && (
                        <button
                          onClick={downloadResult}
                          className="download-result-button px-4 py-2 bg-basic hover:bg-black hover:text-basic hover:border-basic hover:border text-black rounded-md font-semibold text-xl font-rajdhaniSemiBold"
                        >
                          Download Result
                        </button>
                      )}
                      <button
                        onClick={toggleModal}
                        className="close-modal-button px-4 py-2 border border-basic hover:bg-basic hover:text-black text-basic rounded-md text-xl font-semibold font-rajdhaniSemiBold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

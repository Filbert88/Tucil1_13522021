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

export const InputManual = () => {
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

  useEffect(() => {
    setTokens(Array.from({ length: uniqueTokens }, () => ""));
  }, [uniqueTokens]);

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
                className="block text-center w-full px-10 py-2 bg-black border border-2 border-basic text-white"
                placeholder="5"
                required
              />
            </div>
          </div>
          <div className="flex flex-col border-basic border-2">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              2. UNIQUE TOKENS
            </div>
            <div className="mt-4 mb-4 px-10">
              <input
                type="text"
                id="combinedTokens"
                value={combinedTokens}
                onChange={(e) =>
                  setCombinedTokens(e.target.value.toUpperCase())
                }
                className="block w-full py-2 px-10 border border-2 border-basic text-center bg-black text-white"
                placeholder="7A 55 1C E9"
                required
              />
            </div>
          </div>
          <div className="flex flex-col border-basic border-2">
            <div className="bg-basic px-10 text-black font-rajdhaniSemiBold font-semibold py-2 text-[24px]">
              3. ENTER MATRIX SIZE
            </div>
            <div className="flex flex-grow items-center mt-4 mb-4 justify-center space-x-8">
              <input
                type="number"
                id="rows"
                placeholder="8"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="block text-center w-28  py-2 border border-basic bg-black text-basic"
                required
              />
              <p className="text-basic">X</p>
              <input
                type="number"
                id="columns"
                placeholder="8"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                className="block text-center w-28 py-2 border border-basic bg-black text-basic"
                required
              />
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
                  className="block text-center w-full py-2 px-10 border border-basic bg-black text-basic"
                  required
                />
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
                  className="block text-center w-full px-10 py-2 border border-basic bg-black text-basic"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-4 py-4 bg-black text-basic border border-2 border-basic font-semibold max-w-6/12"
          >
            Generate Matrix and Sequences
          </button>
        </div>
      </form>
      {generatedMatrix.length > 0 && generatedSequences.length > 0 && (
        <>
          <div className="result-container space-y-4 mt-8">
            <div className="matrix-container mb-4 mt-10 border border-2 border-basic min-w-[300px] min-h-[300px] overflow-auto">
              <h3 className="flex items-center justify-center font-bold bg-basic text-center h-10 text-black">
                Matrix
              </h3>
              <div className="matrix-box rounded-md h-full flex flex-col justify-center items-center">
                {generatedMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex space-x-2">
                    {row.map((token: string, tokenIndex: number) => (
                      <span
                        key={tokenIndex}
                        className="p-2 bg-gray-800 rounded"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="sequences-container mb-4 mt-4 min-h-[200px] min-w-[300px] overflow-auto border border-2 border-basic">
              <h3 className="flex items-center justify-center font-bold bg-basic text-center h-10 text-black">
                Sequences and Rewards
              </h3>
              <div className="sequences-box rounded-md">
                {generatedSequences.map((sequence, index) => (
                  <div
                    key={index}
                    className="sequence-item bg-gray-800 rounded mb-2 p-2 flex justify-center"
                  >
                    <span>{sequence.tokens.join(" - ")}</span>
                    <span className="reward font-bold text-blue-300">
                      - Reward: {sequence.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={handleSolve}
                className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-md text-white font-semibold w-3/4"
              >
                Solve Optimal Path
              </button>
              {optimalPathResult.found && (
                <button
                  onClick={toggleModal}
                  className="flex justify-center px-4 py-2 mt-4 bg-green-500 hover:bg-green-700 text-white rounded-md font-semibold"
                >
                  View Result
                </button>
              )}
            </div>
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-black rounded-lg max-w-lg w-full border border-2 border-basic">
                  <h3 className="flex items-center justify-center text-3xl font-bold text-black h-[60px] bg-basic text-center">
                    RESULT
                  </h3>
                  <div className="loader">Loading...</div>
                </div>
              </div>
            )}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
                <div className="bg-bgblack rounded-lg max-w-lg w-full border border-basic border-2 text-basic">
                  <h3 className="flex items-center justify-center text-3xl font-bold text-black h-[60px] bg-basic text-center">
                    RESULT
                  </h3>
                  <div className="pr-5 pl-5 pb-5">
                    <div className="mt-8 mb-8">
                      {optimalPathResult.maxReward === 0 ? (
                        <p>There are no sequences.</p>
                      ) : (
                        <>
                          <p className="text-[#5ee9f2] mb-2 text-2xl">
                            {optimalPathResult.maxReward === totalRewards
                              ? "Full Solution Found!"
                              : "Partial Solution Found!"}
                          </p>
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
                        </>
                      )}
                    </div>
                    <div className="flex flex-row space-x-4 justify-center">
                      {optimalPathResult.maxReward !== 0 && (
                        <button
                          onClick={downloadResult}
                          className="download-result-button px-4 py-2 bg-basic hover:bg-black hover:text-basic hover:border-basic hover:border text-black rounded-md font-semibold"
                        >
                          Download Result
                        </button>
                      )}
                      <button
                        onClick={toggleModal}
                        className="close-modal-button px-4 py-2 border border-basic hover:bg-basic hover:text-black text-basic rounded-md font-semibold"
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

import React, { useState } from "react";

interface FileContent {
  bufferSize: number;
  matrix: string[][];
  sequences: { tokens: string[]; reward: number }[];
}

interface IOptimalPathResult {
  maxReward: number;
  sequencesResult: string[];
  coordinates: [number, number][];
  found: boolean;
  executionTime: number;
}

export const InputFile = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [totalRewards, setTotalRewards] = useState(0);
  const [fileContent, setFileContent] = useState<FileContent>({
    bufferSize: 0,
    matrix: [],
    sequences: [],
  });
  const [optimalPathResult, setOptimalPathResult] =
    useState<IOptimalPathResult>({
      maxReward: 0,
      sequencesResult: [],
      coordinates: [],
      found: false,
      executionTime: 0,
    });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSolveFromFile = async () => {
    if (!fileContent.matrix.length || !fileContent.sequences.length) {
      alert("Please upload the file and process it first.");
      return;
    }

    setisLoading(true);

    const sequencesFormatted = fileContent.sequences.map((seq) => ({
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
          matrix: fileContent.matrix,
          sequences: sequencesFormatted,
          bufferSize: fileContent.bufferSize,
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
      console.error("Error while solving:", error);
    } finally {
      setisLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileInput(event.target.files[0]);
    } else {
      setFileInput(null);
    }
  };

  const handleFileUpload = async () => {
    if (!fileInput) {
      alert("Please select a file first!");
      return;
    }

    if (fileInput.type !== "text/plain") {
      alert("Only TXT files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
      const uploadResponse = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        setUploadError(errorData.message); // Display error message
        return;
      }
      const uploadData = await uploadResponse.json();

      setUploadError("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("An error occurred while uploading the file.");
    }

    try {
      const uploadResponse = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }
      const uploadData = await uploadResponse.json();

      setFileContent({
        bufferSize: uploadData.bufferSize,
        matrix: uploadData.matrix,
        sequences: uploadData.sequences,
      });
      const totalRewards = uploadData.sequences.reduce(
        (acc: number, seq: any) => acc + seq.reward,
        0
      );
      setTotalRewards(totalRewards);
    } catch (error) {
      console.error("Error uploading file:", error);
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
      <div className="file-input-container w-full">
        <div className="flex flex-col items-center hover:cursor-pointer">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="border border-2 border-basic hover:cursor-pointer font-rajdhaniSemiBold"
          />
          <button
            onClick={handleFileUpload}
            className="mt-8 px-4 py-2 border border-basic text-basic text-xl rounded-md font-rajdhaniSemiBold"
          >
            Upload
          </button>
        </div>
        {uploadError && <div className="error-message">{uploadError}</div>}
      </div>
      {fileContent.matrix.length > 0 && fileContent.sequences.length > 0 && (
        <>
          <div className="matrix-container mb-4 mt-10 border border-2 border-basic min-w-[300px] min-h-[300px] overflow-auto">
            <h3 className="flex items-center justify-center font-bold bg-basic text-center h-10 text-black font-rajdhaniBold text-2xl">
              Matrix
            </h3>
            <div className="rounded-md h-full flex flex-col justify-center items-center text-basic font-rajdhaniRegular text-[20px]">
              {fileContent.matrix.map((row, rowIndex) => (
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
              {fileContent.sequences.map((sequence, index) => (
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
          <button
            onClick={handleSolveFromFile}
            className="mt-8 px-8 py-4 bg-bgblack text-basic border border-2 border-basic font-semibold font-rajdhaniRegular text-xl hover:bg-basic hover:text-black"
          >
            Solve Optimal Path
          </button>
          {optimalPathResult.found && (
            <button
              onClick={toggleModal}
              className="view-result-button px-4 py-2 mt-4 bg-basic text-black hover:border hover:border-2 hover:border-basic hover:text-basic hover:bg-black text-xl font-semibold font-rajdhaniRegular"
            >
              View Result
            </button>
          )}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-black rounded-lg max-w-lg w-full border border-2 border-basic font-rajdhaniRegular">
                <h3 className="flex items-center justify-center text-3xl font-bold text-black h-[50px] bg-basic text-center">
                  RESULT
                </h3>
                <div className="mt-8 mb-8 text-basic text-xl text-center space-y-4">
                  <div>Loading...</div>
                  <div>Sometimes it might take a long time ^.^</div>
                  <div>Please kindly wait</div>
                </div>
              </div>
            </div>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
              <div className="bg-bgblack rounded-lg max-w-lg w-full border border-basic border-2 text-basic">
                <h3 className="flex items-center justify-center text-4xl font-bold text-black h-[60px] bg-basic text-center font-rajdhaniBold">
                  RESULT
                </h3>
                <div className="pr-5 pl-5 pb-5">
                  <div className="mt-8 mb-8">
                    {optimalPathResult.maxReward === 0 ? (
                      <p className="text-center text-basic text-xl">
                        There are no sequences.
                      </p>
                    ) : (
                      <>
                        <p className="text-[#5ee9f2] mb-2 text-3xl font-rajdhaniSemiBold">
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
                  <div className="flex flex-row space-x-4 justify-center font-rajdhaniSemiBold text-xl">
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
        </>
      )}
    </>
  );
};

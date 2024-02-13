"use client";
import React, { useState, useEffect } from "react";
import { InputFile } from "../inputfile/page";
import { InputManual } from "../inputmanual/page";

const Program = () => {
  const [showFile, setShowFile] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="flex flex-col justify-center items-center bg-black p-20">
      <div className="text-basic mb-10 w-full">
        <h1 className="text-[64px] font-rajdhaniBold">
          Cyberpunk 2077 Hacking Minigame Solver
        </h1>
        <p className="text-[20px] font-rajdhaniRegular">
          INSTANT BREACH PROTOCOL SOLVER - START CRACKING, SAMURAI.
        </p>
        <div className="bg-basic w-[65%] h-2"></div>
      </div>
      <div className="mb-10">
        <div className="flex flex-row">
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default action
              setShowForm(false);
              setShowFile(true);
            }}
            className={`mb-4 hover:bg-basic hover:text-black font-rajdhaniMedium border border-basic px-10 py-3 cursor-pointer text-center font-rajdhaniRegular ${
              showFile ? "bg-basic text-bgblack" : "text-basic bg-bgblack"
            }`}
          >
            Input from file
          </button>
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default action
              setShowForm(true);
              setShowFile(false);
            }}
            className={`mb-4 hover:bg-basic hover:text-black font-rajdhaniMedium border border-basic px-10 py-3 cursor-pointer text-center font-rajdhaniRegular ${
              showForm ? "bg-basic text-bgblack" : "text-basic bg-bgblack"
            }`}
          >
            Input Manually
          </button>
        </div>
      </div>

      {showFile && <InputFile />}

      {showForm && <InputManual />}
    </main>
  );
};

export default Program;

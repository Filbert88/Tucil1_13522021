import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  bg-black">
      <div className="text-white text-center">
        <h1 className="text-xl">Welcome to cyberpunk hacking minigame</h1>
        <h2 className="text-lg">Enjoyy !!!</h2>
      </div>
      <a
        href="/program"
        className="mt-4 px-4 py-2 border border-2 border-white rounded-lg text-white"
      >
        START
      </a>
    </main>
  );
}

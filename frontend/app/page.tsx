"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"
export default function Home() {

  const router = useRouter()

  const [gameId, setGameId] = useState("")

  const joinGame = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/game/${gameId}`)
  }

  const createGame = () => {
    const room = uuidv4()
    router.push(`/game/${room}`)
  }

  return (
    <>
      <div className="grid grid-cols-3 -mt-[6rem] gap-4 mx-12 h-screen text-2xl items-center justify-center text-center">
        <div className="border flex flex-col mx-auto  p-4">
          <p>Click this to create ID automatically, hassle free</p>
          <button className='my-4 w-fit mx-auto rounded-md border px-6 py-4 text-white bg-gradient-to-r from-blue-700 to-blue-500' onClick={createGame}>Create Game</button>
        </div>
        <p className="border flex mx-auto">OR</p>
        <div className="border flex flex-col mx-auto p-4">
          <p>Create custom Room IDs</p>
          <input className="p-4 m-4 border rounded-md" value={gameId} onChange={(e)=>setGameId(e.target.value)} type="text" placeholder="Enter a room ID" />
          <button className='my-4 w-fit mx-auto rounded-md border px-6 py-4 text-white bg-gradient-to-r from-blue-700 to-blue-500' onClick={joinGame}>Join Game</button>
        </div>
      </div>
    </>
  );
}

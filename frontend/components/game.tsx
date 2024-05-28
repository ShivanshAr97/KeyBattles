"use client"

import { GameProps, GameStatus, Player, PlayerScore } from '@/types'
import React, { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import Leaderboard from './leaderboard'

const ActualGame = ({ gameId, name }: GameProps) => {
  const [sock, setSock] = useState<Socket>()
  const [players, setPlayers] = useState<Player[]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>("not-started")
  const [para, setPara] = useState<string>("")
  const [host, setHost] = useState<string>("")
  const [inputPara, setInputPara] = useState<string>("")

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ["websocket"]
    })
    setSock(socket)

    socket.emit("join-game", gameId, name)

    return () => {
      removeListeners()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    setUpListeners()
    return () => removeListeners()
  }, [sock])

  useEffect(() => {
    if (!sock || gameStatus !== "progress") return
    sock.emit("player-typed", inputPara)

    window.onbeforeunload = () => {
      if (sock) {
        sock.emit("leave")
      }
    }
  }, [inputPara])


  const removeListeners = () => {
    if (!sock) return
    sock.off("connect")
    sock.off("players")
    sock.off("player-joined")
    sock.off("player-left")
    sock.off("player-score")
    sock.off("game-started")
    sock.off("game-finished")
    sock.off("new-host")
    sock.off("error")
  }

  const setUpListeners = () => {
    if (!sock) return

    sock.on("connect", () => {
      console.log("User connected");
    })

    sock.on("players", (players: Player[]) => {
      setPlayers(players)
    })

    sock.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player])
    })

    sock.on("player-left", (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id))
    })

    sock.on("player-score", ({ id, score }: PlayerScore) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === id) {
            return {
              ...player, score
            }
          }
          return player
        })
      )
    })

    sock.on("game-started", (para: string) => {
      setPara(para)
      setGameStatus("progress")
    })

    sock.on("game-finished", () => {
      setGameStatus("finished")
      setInputPara("")
    })

    sock.on("new-host", (id: string) => {
      setHost(id)
    })

    sock.on("error", (message: string) => {
      console.log("Error", message);
    })
  }

  const startGame = () => {
    if (!sock) return
    sock.emit("start-game")
  }


  return (
    <div className='flex gap-5'>
      <div className='bg-gray-400'>

        <h1>{name}</h1>
        <h1>{gameId}</h1>
        Leaderboard

        {players.sort((a, b) => b.score - a.score).map(((player, index) => (
          <Leaderboard key={player.id} player={player} rank={index + 1} />
        )))}

      </div>
      <div>

        {gameStatus === "not-started" && (
          <>
            <h1>
              Joined lobby, waiting for players
            </h1>
            {host === sock?.id && (
              <button onClick={startGame}>Start Game</button>
            )}
          </>
        )}

        {gameStatus === "progress" && (
          <>
            <h1>Type below</h1>
            <p className='fixed -z-10 text-green-500'>{para}</p>
            <textarea className='z-10 resize-none bg-transparent' value={inputPara} onChange={(e) => setInputPara(e.target.value)} disabled={gameStatus !== "progress" || !sock} />
          </>
        )}

        {gameStatus === "finished" && (
          <>
            <h1>Game Ended</h1>
            {host === sock?.id && (
              <>
                <h1>Restart game for others</h1>
                <button onClick={startGame}>Restart Game</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ActualGame
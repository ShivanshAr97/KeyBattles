import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import Leaderboard from '../components/leaderboard';
import { GameProps, Player } from '@/types';

const ActualGame = ({ gameId, name }: GameProps) => {
  const [sock, setSock] = useState<Socket>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<"not-started" | "progress" | "finished">("not-started");
  const [para, setPara] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [inputPara, setInputPara] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ["websocket"]
    });
    setSock(socket);

    socket.emit("join-game", gameId, name);

    return () => {
      removeListeners();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setUpListeners();
    return () => removeListeners();
  }, [sock]);

  console.log(gameStatus);
  
  useEffect(() => {
    if (gameStatus === "progress") {
      const countdownInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(countdownInterval);
            return 0;
          }
        });
      }, 10000);

      return () => clearInterval(countdownInterval);
    }
  }, [gameStatus]);

  const removeListeners = () => {
    if (!sock) return;
    sock.off("connect");
    sock.off("players");
    sock.off("player-joined");
    sock.off("player-left");
    sock.off("player-score");
    sock.off("game-started");
    sock.off("game-finished");
    sock.off("new-host");
    sock.off("error");
  };

  const setUpListeners = () => {
    if (!sock) return;

    sock.on("connect", () => {
      console.log("User connected");
    });

    sock.on("players", (players: Player[]) => {
      setPlayers(players);
    });

    sock.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    sock.on("player-left", (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    });

    sock.on("player-score", ({ id, score }: { id: string; score: number }) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === id) {
            return {
              ...player,
              score,
            };
          }
          return player;
        })
      );
    });

    sock.on("game-started", (para: string) => {
      setPara(para);
      setGameStatus("progress");
      setTimer(10000);
    });

    sock.on("game-finished", () => {
      setGameStatus("finished");
      setTimer(0);
    });

    sock.on("new-host", (id: string) => {
      setHost(id);
    });

    sock.on("error", (message: string) => {
      console.log("Error", message);
    });
  };

  const startGame = () => {
    if (!sock) return;
    sock.emit("start-game");
    console.log(gameStatus);
    
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPara(event.target.value);
    if (gameStatus === "progress" && sock) {
      sock.emit("player-typed", event.target.value);
    }
  };

  return (
    <div className="flex gap-5">
      <div className="bg-gray-400 p-4">
        <h1>{name}</h1>
        <h1>{gameId}</h1>
        {players.sort((a, b) => b.score - a.score).map(((player, index) => (
          <Leaderboard key={player.id} player={player} rank={index + 1} />
        )))}
        {gameStatus === "progress" && (
          <div className="mt-4">
            <h2>Time remaining: {timer} seconds</h2>
          </div>
        )}
      </div>

      <div className="flex-1 p-4">
        {gameStatus === "not-started" && (
          <>
            <h1>Joined lobby, waiting for players</h1>
            {host === sock?.id && (
              <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={startGame}>
                Start Game
              </button>
            )}
          </>
        )}

        {gameStatus === "progress" && (
          <>
            <h1>Type below</h1>
            <p className="fixed -z-10 text-green-500">{para}</p>
            <textarea
              className="z-10 resize-none bg-transparent border border-gray-300 p-2 mt-2 w-full h-40"
              value={inputPara}
              onChange={handleInputChange}
              disabled={gameStatus !== "progress" || !sock}
            />
          </>
        )}

        {gameStatus === "finished" && (
          <>
            <h1>Game Ended</h1>
            {host === sock?.id && (
              <>
                <h2>Restart game for others</h2>
                <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={startGame}>
                  Restart Game
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActualGame;

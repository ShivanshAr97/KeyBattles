import { Server, Socket } from "socket.io";
import { paragraphs } from "../utils/paragraphs";
import { rooms } from "../handleSockets";

export class Game {
    gameStatus: "not-started" | "progress" | "finished";
    gameId: string;
    players: { id: string; score: number; name: string }[];
    io: Server
    gameHost: string
    para: string

    constructor(id: string, io: Server, host: string) {
        this.gameId = id
        this.players = []
        this.io = io
        this.gameHost = host
        this.gameStatus = "not-started"
        this.para = ""
    }

    handleSockets(socket: Socket) {
        socket.on("start-game", () => {
            if (this.gameStatus === "progress") {
                return socket.emit("error", "Game is in progress, join later")
            }

            if (this.gameHost != socket.id) {
                return socket.emit("error", "You are not the host")
            }
            for (const player of this.players) {
                player.score = 0
            }

            this.io.to(this.gameId).emit("players", this.players)

            this.gameStatus = "progress"

            const para = paragraphs()
            this.para = para
            this.io.to(this.gameId).emit("game-started", para)

            setTimeout(() => {
                this.gameStatus = "finished"
                this.io.to(this.gameId).emit("game-finished")
                this.io.to(this.gameId).emit("players", this.players)
            }, 65000);
        })

        socket.on("player-typed", (typed: string) => {
            if (this.gameStatus != "progress") return socket.emit("error", "Game not started")
            const splitPara = this.para.split(" ")
            const splitTyped=typed.split(" ")
            console.log({splitTyped,splitPara});
            

            let score=0;
            for(let i=0;i<splitTyped.length;i++){
                if(splitPara[i] === splitTyped[i]) score++;
            }

            const player = this.players.find((player=>player.id===socket.id))

            if(player){
                player.score=score
            }

            this.io.to(this.gameId).emit("player-score",{id:socket.id,score})
        })

        socket.on("leave", () => {
            if (socket.id === this.gameHost) {
                this.players = this.players.filter((player) => player.id !== socket.id)
                if (this.players.length !== 0) {
                    this.gameHost = this.players[0].id
                    this.io.to(this.gameId).emit("new-host", this.gameHost)
                    this.io.to(this.gameId).emit("player-left", socket.id)
                }
                else {
                    rooms.delete(this.gameId)
                }
            }
            socket.leave(this.gameId)
            this.players = this.players.filter((player) => player.id != socket.id)
            this.io.to(this.gameId).emit("player-left", socket.id)
        })

        socket.on("disconnect", () => {
            if (socket.id === this.gameHost) {
                this.players = this.players.filter((player) => player.id !== socket.id)
                if (this.players.length !== 0) {
                    this.gameHost = this.players[0].id
                }
                else {
                    rooms.delete(this.gameId)
                }
            }
            socket.leave(this.gameId)
            this.players = this.players.filter((player) => player.id !== socket.id)
        })
    }

    joinPlayer(id: string, name: string, socket: Socket) {
        if (this.gameStatus === "progress") {
            return socket.emit("error", "Game is in progress, join later")
        }
        this.players.push({ id, name, score: 0 })
        this.io.to(this.gameId).emit("player-joined", {
            id,
            name,
            score: 0
        })
        socket.emit("player", this.players)
        socket.emit("new-host", this.gameHost)

        this.handleSockets(socket)
    }
}
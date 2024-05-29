import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {Server} from "socket.io";
import http from "http";
import cors from "cors";
import { handleSockets } from "./handleSockets";


const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET','POST']
    }
});

handleSockets(io)

server.listen(process.env.PORT,()=>{
    console.log(`Server is up at ${process.env.PORT}`);
 
});
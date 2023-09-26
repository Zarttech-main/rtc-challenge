import express from "express";
import  http from "http"
import {Server} from "socket.io"
import cors from "cors"
import { PORT } from "./utils/constants";
import authRouter from "./controllers/AuthController";
import roomRoutes from "./controllers/RoomController";
import notFoundHandler from "./utils/Route404";
import { roomHandler } from "./room/handler";

const app = express();
const server = http.createServer(app)

const corsOption = {
    origin: "*",
    methods: ["GET", "POST"]
}
const io = new Server(server, {
    cors: corsOption
})
app.use(cors(corsOption))
app.use(express.json())

// HTTP Routes handling
app.use("/auth", authRouter)
app.use("/rooms", roomRoutes)
app.all("*", notFoundHandler)


// WebSocket Event handling
io.on("connection", (socket) => {
    console.log("user connected");  

    roomHandler(socket);
    
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})



server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

import { Router } from "express";
import Joi from "joi";

import { createRoom, getRoomById, getUserByRoomId, getUserHomeRoom, getUserRooms } from "../services/RoomService";

const roomRoutes = Router();


roomRoutes.post('/', async (req, res, _next) => {

    const createRoomSchema = Joi.object({
        name: Joi.string().required(),
        userId: Joi.string().required()
    })

    const {error, value} = createRoomSchema.validate(req.body);
    if (error){
        return res.status(403).send(error.details)
    }
    try { 
        const room = await createRoom(value);
        return res.status(200).send(room);
    } catch (error) {
        throw error;
    }
})

roomRoutes.get(`/:roomId`,  async (req, res, _next) => {
    try {
        const roomId = req.params.roomId;
        const room = await getRoomById(roomId)
        return res.status(200).send(room);
    } catch (error) {
        throw error;
    }
})

roomRoutes.get(`/:roomId/owner`,  async (req, res, _next) => {
    try {
        const roomId = req.params.roomId;
        const user = await getUserByRoomId(roomId)
        return res.status(200).send(user);
    } catch (error) {
        throw error;
    }
})

roomRoutes.get(`/user/:userId`,  async (req, res, _next) => {
    try {
        const userId = req.params.userId;
        const rooms = await getUserRooms(userId)
        return res.status(200).send(rooms);
    } catch (error) {
        throw error;
    }
})


roomRoutes.get(`/user/:userId/home`,  async (req, res, _next) => {
    try {
        const userId = req.params.userId;
        const room = await getUserHomeRoom(userId)
        return res.status(200).send(room);
    } catch (error) {
        throw error;
    }
})
export default roomRoutes;

import DataProvider from "../utils/DataProviders"

interface NewRoomData {
    name: string,
    userId: string
}

export const createRoom = async (data: NewRoomData) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const room = await db.room.create({data: data});
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserHomeRoom = async (userId: string) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const room = await db.room.findFirst({
            where: {
                userId: userId
            }
        });
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserRooms = async (userId: string) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const rooms = await db.room.findMany({
            where: {
                userId: userId
            }
        });
        return rooms;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getRoomById = async (roomId: string) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const room = await db.room.findUnique({
            where: {
                id: roomId
            }
        });
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getUserByRoomId = async (roomId: string) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const room = await db.room.findUnique({
            where: {
                id: roomId
            }
        });
        const user = await db.user.findUnique({
            where: {
                id: room?.userId
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

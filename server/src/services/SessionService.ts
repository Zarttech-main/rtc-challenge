import DataProvider from "../utils/DataProviders"


export const createRoomSession = async (roomId: string) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const session = await db.session.create({
            data: {
                roomId
            }
        });
        console.log(session);
        return session;
    } catch (error) {
        console.log(error);
         throw(error)
    }

}

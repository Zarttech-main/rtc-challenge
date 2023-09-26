import { PrismaClient } from "@prisma/client";

class DataProvider {
    static dbClient: PrismaClient | undefined = undefined

    static getDatabaseInstance() {
        if (this.dbClient) {
            return this.dbClient
        }else{
            this.dbClient = new PrismaClient();
            return this.dbClient;
        }
    }
}

export default DataProvider;

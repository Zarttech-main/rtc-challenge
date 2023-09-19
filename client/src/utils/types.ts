export interface User {
    data: {
        id: string;
        name: string;
        email: string;
    };
    token: string
}

export interface Room {
    id: string
    name: string;
    userId: string;
}
